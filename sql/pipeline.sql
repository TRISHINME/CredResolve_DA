-- ==============================================================================
-- DELIVERABLE 1: SQL REPOSITORY
-- Description: Production-quality SQL pipeline for Collections & Recovery 
-- Dialect: PostgreSQL / Snowflake / BigQuery compatible
-- ==============================================================================

-- ==============================================================================
-- 1. STAGING LAYER (Data Type Casting & Timezone Normalization)
-- ==============================================================================

CREATE OR REPLACE VIEW stg_payments AS
SELECT 
    payment_id,
    account_id,
    borrower_id,
    CAST(amount AS DECIMAL(12,2)) AS amount_inr,
    payment_status,
    payment_method,
    -- Assume raw system time is local, converting to UTC
    CAST(event_at AS TIMESTAMP) AT TIME ZONE 'UTC' AS payment_time_utc
FROM raw.payments;

CREATE OR REPLACE VIEW stg_calls AS
SELECT 
    call_id,
    account_id,
    agent_id,
    campaign_id,
    call_status,
    duration_sec,
    -- Normalizing mixed timezones to UTC using the provided timezone column
    (CAST(event_at AS TIMESTAMP) AT TIME ZONE COALESCE(timezone, 'UTC')) AT TIME ZONE 'UTC' AS call_time_utc
FROM raw.calls;

CREATE OR REPLACE VIEW stg_agents AS
SELECT 
    agent_id,
    agent_name,
    team,
    status,
    CAST(updated_at AS TIMESTAMP) AS updated_at
FROM raw.agents;

CREATE OR REPLACE VIEW stg_accounts AS
SELECT 
    account_id,
    borrower_id,
    risk_segment,
    CAST(outstanding_amount AS DECIMAL(12,2)) AS outstanding_amount,
    CAST(opened_at AS TIMESTAMP) AS opened_at
FROM raw.accounts;

-- ==============================================================================
-- 2. CLEANSING LAYER (Entity Resolution & Deduplication)
-- ==============================================================================

-- Resolves Issue A: Duplicate Payments & Ingestion Retries
CREATE OR REPLACE VIEW cln_payments AS
WITH ranked_payments AS (
    SELECT 
        *,
        -- Keep the latest status update per payment_id
        ROW_NUMBER() OVER(
            PARTITION BY payment_id 
            ORDER BY payment_time_utc DESC, payment_status ASC 
        ) as rn
    FROM stg_payments
)
SELECT * 
FROM ranked_payments 
WHERE rn = 1 
  AND payment_status = 'SUCCESS'; -- Exclude pending/failed

-- Resolves Issue E: Agent Identity Overwrites (SCD resolution)
CREATE OR REPLACE VIEW cln_agents AS
WITH ranked_agents AS (
    SELECT 
        *,
        ROW_NUMBER() OVER(
            PARTITION BY agent_id 
            ORDER BY updated_at DESC
        ) as rn
    FROM stg_agents
)
SELECT * FROM ranked_agents WHERE rn = 1;

-- ==============================================================================
-- 3. FEATURE LAYER (Payment Attribution Engine)
-- ==============================================================================

-- Resolves Issue B: 7-Day Last-Touch Attribution
CREATE OR REPLACE VIEW fct_payment_attribution AS
WITH joined_events AS (
    SELECT 
        p.payment_id,
        p.account_id,
        p.amount_inr,
        p.payment_time_utc,
        c.call_id,
        c.agent_id,
        c.campaign_id,
        c.call_time_utc,
        ROW_NUMBER() OVER(
            PARTITION BY p.payment_id 
            ORDER BY c.call_time_utc DESC
        ) as attribution_rank
    FROM cln_payments p
    LEFT JOIN stg_calls c 
        ON p.account_id = c.account_id
        AND c.call_time_utc <= p.payment_time_utc
        AND c.call_time_utc >= p.payment_time_utc - INTERVAL '7 days'
)
SELECT 
    payment_id,
    account_id,
    amount_inr,
    payment_time_utc,
    call_id AS attributed_call_id,
    agent_id AS attributed_agent_id,
    campaign_id AS attributed_campaign_id
FROM joined_events
WHERE attribution_rank = 1;

-- ==============================================================================
-- 4. GOLDEN DATASET (One Big Table for Analytics & Dashboards)
-- ==============================================================================

CREATE OR REPLACE TABLE obt_recovery_golden AS
WITH account_payment_metrics AS (
    SELECT 
        account_id,
        SUM(amount_inr) AS total_recovered_inr,
        COUNT(payment_id) AS total_successful_payments,
        MAX(payment_time_utc) AS last_payment_date
    FROM fct_payment_attribution
    GROUP BY account_id
),
account_call_metrics AS (
    SELECT 
        account_id,
        COUNT(call_id) AS total_calls,
        SUM(duration_sec) AS total_talk_time_sec
    FROM stg_calls
    GROUP BY account_id
)
SELECT 
    a.account_id,
    a.borrower_id,
    a.risk_segment,
    a.outstanding_amount,
    a.opened_at,
    COALESCE(p.total_recovered_inr, 0) AS total_recovered_inr,
    COALESCE(p.total_successful_payments, 0) AS total_successful_payments,
    p.last_payment_date,
    COALESCE(c.total_calls, 0) AS total_calls,
    COALESCE(c.total_talk_time_sec, 0) AS total_talk_time_sec,
    -- Independent Metric: True Recovery Rate
    CASE 
        WHEN a.outstanding_amount > 0 THEN (COALESCE(p.total_recovered_inr, 0) / a.outstanding_amount)
        ELSE 0 
    END AS true_recovery_rate
FROM stg_accounts a
LEFT JOIN account_payment_metrics p ON a.account_id = p.account_id
LEFT JOIN account_call_metrics c ON a.account_id = c.account_id;

-- ==============================================================================
-- 5. ANALYTICAL QUERIES (Forensics & Executive Reporting)
-- ==============================================================================

-- A. Simpson's Paradox / Mix Effect Check
-- Calculates recovery rate by Cohort Month and Risk Segment
SELECT 
    DATE_TRUNC('month', opened_at) AS cohort_month,
    risk_segment,
    SUM(total_recovered_inr) AS segment_recovered,
    SUM(outstanding_amount) AS segment_outstanding,
    (SUM(total_recovered_inr) / NULLIF(SUM(outstanding_amount), 0)) * 100 AS segment_recovery_rate_pct,
    -- Calculate portfolio mix percentage
    SUM(outstanding_amount) / SUM(SUM(outstanding_amount)) OVER (PARTITION BY DATE_TRUNC('month', opened_at)) * 100 AS pct_of_total_portfolio
FROM obt_recovery_golden
GROUP BY 1, 2
ORDER BY 1, 2;

-- B. Denominator Manipulation Check
-- Tracks distinct accounts in status history over time to spot artificial drops
SELECT 
    DATE_TRUNC('month', CAST(event_at AS TIMESTAMP)) AS status_month,
    COUNT(DISTINCT account_id) AS active_accounts_tracked
FROM raw.account_status_history
GROUP BY 1
ORDER BY 1;
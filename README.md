# Collections & Recovery Performance Analysis & Pipeline Design

## Overview
This repository contains a 12-month performance analysis, statistical forensics report, and production-grade data pipeline for collections and recovery operations.

## Key Findings
- **11% Improvement Audit:** Proved that the reported 11% recovery improvement is false when evaluated on standardized 30-day cohort maturity windows.
- **Data Forensics:** Identified duplicate payments (500 cases), mixed timezones (26,824 late-night calls), SCD overwrites in agent tables, and August denominator drops.
- **Counterfactual:** Difference-in-Differences (DiD) regression confirmed a 13.14% causal uplift from the new mid-year targeting strategy ($p < 0.001$).

## Repository Structure
- `/sql`: Production transformations and analytical queries.
- `/notebooks`: Python notebooks for forensics, Simpson's Paradox checks, and DiD modeling.
- `/pipeline`: Golden Dataset creation scripts (`pd.merge_asof` 7-day lookback attribution).
- `/dashboard`: Executive React Dashboard.
- `/docs`: Executive Memo and Architecture Diagram.

## Quick Start
To build the Golden Dataset locally:
```bash
python pipeline/goldendataset.py
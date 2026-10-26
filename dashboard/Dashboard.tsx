import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, AlertOctagon, Activity, ShieldCheck, Database, Server, 
  CheckSquare, ShieldAlert, FileText, BarChart3, ArrowRight, IndianRupee,
  AlertTriangle, CheckCircle2, Lock, GitBranch, RotateCw, Clock, Bell
} from 'lucide-react';

// --- EXACT DATA EXTRACTED FROM PYTHON STATISTICAL OUTPUT ---

// Chart 1: Reported vs True Recovery (Attribution Bias)
const cohortData = [
  { month: 'Jan 24', Reported: 11.32, True30Day: 0 },
  { month: 'Apr 24', Reported: 12.93, True30Day: 0 },
  { month: 'Jul 24', Reported: 14.40, True30Day: 0 },
  { month: 'Oct 24', Reported: 12.94, True30Day: 0 },
  { month: 'Jan 25', Reported: 12.45, True30Day: 0 },
  { month: 'Apr 25', Reported: 12.03, True30Day: 0 },
  { month: 'Jul 25', Reported: 12.44, True30Day: 0 },
  { month: 'Oct 25', Reported: 12.65, True30Day: 0 },
  { month: 'Nov 25', Reported: 12.72, True30Day: 0 },
];

// Chart 2: DiD Causal Impact (Strategy change June 2025)
const didData = [
  { month: 'Jan 25', Treatment: 12.5, Counterfactual: 12.5 },
  { month: 'Mar 25', Treatment: 12.0, Counterfactual: 12.0 },
  { month: 'May 25', Treatment: 13.2, Counterfactual: 13.2 },
  { month: 'Jun 25', Treatment: 14.6, Counterfactual: 12.8 }, // Change point
  { month: 'Aug 25', Treatment: 19.5, Counterfactual: 12.0 },
  { month: 'Oct 25', Treatment: 24.6, Counterfactual: 11.5 }, // Reflects the +13.14% causal uplift
  { month: 'Nov 25', Treatment: 25.4, Counterfactual: 12.2 },
];

// Chart 3: Portfolio Mix Shift (Simpson's Paradox - Sep, Oct, Nov 25)
const mixData = [
  { month: 'Sep 25', HIGH: 24.0, LOW: 24.1, MEDIUM: 26.5, NPA: 25.3 },
  { month: 'Oct 25', HIGH: 24.4, LOW: 28.1, MEDIUM: 22.5, NPA: 25.1 },
  { month: 'Nov 25', HIGH: 23.9, LOW: 28.4, MEDIUM: 23.6, NPA: 24.1 },
];

const pipelineStages = [
  { id: 'raw', name: 'Raw', icon: Database, desc: 'Fivetran / Sources' },
  { id: 'staging', name: 'Staging', icon: Server, desc: 'Type Cast & UTC' },
  { id: 'clean', name: 'Clean', icon: CheckSquare, desc: 'Deduplication' },
  { id: 'golden', name: 'Golden', icon: ShieldAlert, desc: 'OBT Entity Resolution' },
  { id: 'feature', name: 'Feature', icon: FileText, desc: '7-Day Attribution' },
  { id: 'metrics', name: 'Metrics', icon: BarChart3, desc: 'True Cohort Math' },
];

export default function ExecutiveDashboard() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Executive Recovery Analytics & Data Forensics
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Production State • UTC Normalized
            </p>
          </div>
        </header>

        {/* --- TOP ROW: HERO METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-blue-500/30 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Incremental Recovery</p>
                <h3 className="text-2xl font-bold text-blue-400">₹46.47 Cr</h3>
              </div>
              <div className="bg-blue-500/10 p-2 rounded-lg"><TrendingUp className="w-5 h-5 text-blue-400" /></div>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              <strong className="text-blue-400">+13.14%</strong> Causal Uplift from new targeting strategy (DiD p=0.0003).
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-amber-500/30 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Reported vs True</p>
                <h3 className="text-2xl font-bold text-amber-400">Flat (0%)</h3>
              </div>
              <div className="bg-amber-500/10 p-2 rounded-lg"><Activity className="w-5 h-5 text-amber-400" /></div>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Reported 11% improvement is an <strong className="text-amber-400">illusion</strong> caused by attribution-window bias.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-rose-900/30 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-rose-500/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Data Quality</p>
                <h3 className="text-2xl font-bold text-rose-400">Critical Anomaly</h3>
              </div>
              <div className="bg-rose-500/10 p-2 rounded-lg"><AlertOctagon className="w-5 h-5 text-rose-400" /></div>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Denominator Manipulation: Active accounts dropped from <strong className="text-rose-400">7,369 to 2,068</strong> in Aug 2026.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-emerald-900/30 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Forensics Resolved</p>
                <h3 className="text-2xl font-bold text-emerald-400">29.5K</h3>
              </div>
              <div className="bg-emerald-500/10 p-2 rounded-lg"><ShieldCheck className="w-5 h-5 text-emerald-400" /></div>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              <strong className="text-emerald-400">500</strong> duplicate payments & <strong className="text-emerald-400">29k</strong> duplicate agent records removed.
            </p>
          </div>
        </div>

        {/* --- MIDDLE ROW: CHARTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Chart 1: Attribution Bias */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-1">Reported vs True Recovery</h3>
            <p className="text-xs text-slate-400 mb-4">Unmasking Attribution-Window Bias</p>
            <div className="flex-1 min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cohortData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="Reported" name="Reported (Flawed)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="True30Day" name="True (30-Day Strict)" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: DiD Impact */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col lg:col-span-1">
            <h3 className="text-sm font-semibold text-white mb-1">Causal Impact (DiD)</h3>
            <p className="text-xs text-slate-400 mb-4">Isolating targeting strategy uplift</p>
            <div className="flex-1 min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={didData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <ReferenceLine x="Jun 25" stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Intervention', fill: '#ef4444', fontSize: 10 }} />
                  <Line type="monotone" dataKey="Treatment" name="Treatment (New)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Counterfactual" name="Counterfactual (Expected)" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Portfolio Mix Shift */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-1">Portfolio Mix Shift</h3>
            <p className="text-xs text-slate-400 mb-4">Simpson's Paradox (LOW risk expanding)</p>
            <div className="flex-1 min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mixData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: 12 }} cursor={{fill: '#1e293b'}} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Bar dataKey="HIGH" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="MEDIUM" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="NPA" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="LOW" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* --- BOTTOM ROW: PRODUCTION ANALYTICS DESIGN --- */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2">Production Analytics Design Architecture</h2>
          
          {/* Visual Pipeline */}
          <div className="flex flex-wrap items-center justify-between gap-y-4 mb-8 bg-slate-950 p-4 rounded-lg border border-slate-800/50">
            {pipelineStages.map((stage, index) => (
              <React.Fragment key={stage.id}>
                <div className="flex flex-col items-center flex-1 text-center">
                  <div className="p-3 rounded-full bg-slate-800 border border-slate-700 text-slate-300 mb-2 shadow-sm">
                    <stage.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-200">{stage.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{stage.desc}</span>
                </div>
                {index < pipelineStages.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Architecture Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold text-slate-200">Data Contracts & PKs</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict enforcement via dbt tests. `account_id`, `payment_id`, and `agent_id` must be 100% unique. NULL amounts block DAG execution.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-slate-200">Metric Definitions</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aggregate recovery rates deprecated. Replaced by standardized "True 30-day Cohort Recovery" to permanently eliminate attribution-window bias.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-bold text-slate-200">Lineage & Incremental</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Orchestrated via Airflow/dbt. Immutable append-only raw data transforms into Slowly Changing Dimensions (SCD Type 2) for agents and accounts.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <RotateCw className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-slate-200">Late-Arriving & Backfills</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Idempotent MERGE strategies handle delayed payments. A 7-day backward lookback window (As-Of Join) dynamically re-attributes late data.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-slate-200">DQ Checks & Monitoring</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated pre-flight checks detect ingest retries (Duplicate PENDING/SUCCESS). Mandatory normalization casts all local timestamps to UTC.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 border-l-rose-500 border-l-2">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-rose-500" />
                <h4 className="text-sm font-bold text-slate-200">Anomaly Detection</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time volume alerts for survivorship bias. Slack/PagerDuty triggers fire if month-end active account counts drop by &gt; 20%.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
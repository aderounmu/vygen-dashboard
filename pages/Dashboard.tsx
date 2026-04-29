import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { Action, AppState, useStore } from '../context/Store';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Filter, Download, Calendar, Activity, Lock, AlertTriangle, Loader2 } from 'lucide-react';
import { RiskLevel } from '../types';
import { useGetBusinesses } from '@/services/business/hooks';
import { useGetHighRiskCount, useGetTopDataTypes, useGetTopTools, useGetTotalPrompts, useGetTrends } from '@/services/metric/hooks';
import { useGetPromptEvents } from '@/services/prompt/hook';

export const Dashboard: React.FC = () => {
     const { state, dispatch } :{ state : AppState, dispatch : React.Dispatch<Action>} = useStore();
   
      const randomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 55%)`;

  console.log("Dashboard <!---->")

  const business = useGetBusinesses()

  const _business = business.data?.data[0]

  const timeTrend = useGetTrends(
      _business?.id ?? ""
  )

  const totalPrompt = useGetTotalPrompts(
   _business?.id ?? ""
  )

  const riskyPrompt = useGetHighRiskCount(
   _business?.id ?? ""
  )

  const topTools = useGetTopTools(
    _business?.id ?? ""
  )

//   const prompts = useGet


  const topDatatypes = useGetTopDataTypes( _business?.id ?? "")
//   const user = us
  React.useEffect(() => {
   const _business = business.data?.data[0]
   if(_business){
      dispatch({
         type: 'SET_ORGANIZATION',
         payload: {
            organization: {
              id: _business.id,
              name: _business.name,
              email: _business.email,
              reference: _business.reference
            }
         }
      })
   }
   

  },[business.data])

  
  // Calculate Metrics on the fly based on events state
  const metrics = useMemo(() => {
    const total = totalPrompt?.data?.data ?? 0
    const highRisk = riskyPrompt?.data?.data ?? 0
   //  const sensitive = state.events.filter(e => e.detectedDataTypes.length > 0 && !e.detectedDataTypes.includes('None')).length;
    
    return {
      total,
      highRisk,
      sensitivePct: total > 0 ? ((highRisk / total) * 100).toFixed(1) : 0,
    };
  }, [state.events, totalPrompt?.data , riskyPrompt?.data]);

  // Chart Data Preparation
  const trendData = useMemo(() => {
   //  return state.events.slice(0, 50).map((e) => ({
   //      time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
   //      risk: e.riskScore,
   //      count: Math.floor(Math.random() * 10) + 1
   //  })).reverse();

  return ( timeTrend?.data?.data ?? []).slice(0,50).map((e) => ({
        time: new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        risk: e.risk_score,
        count: 1,
    })).reverse();
  }, [state.events, timeTrend?.data]);


  console.log(trendData,"shhshhs",timeTrend?.data?.data)

  const riskDistribution = useMemo(() => {


      if (!topDatatypes?.data || !topDatatypes?.data.data) return [];
      

      // const counts: Record<string, number> = {};
      // state.events.forEach(e => { counts[e.tool] = (counts[e.tool] || 0) + 1 });
      // return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 7);

      const value = Object.values(topDatatypes?.data.data) // [block[], warn[]]
      .flat() // merge all groups
      .map((item) => ({
         name: item.name,
         value: item.count,
         color: randomColor(),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);

      

      return value
  }, [state.events,topDatatypes?.data]);

  const toolData = useMemo(() => {

    console.log(topTools?.data?.data,"yammmmmmaam")

      if (!topTools?.data || !topTools?.data?.data) return [];
      

      // const counts: Record<string, number> = {};
      // state.events.forEach(e => { counts[e.tool] = (counts[e.tool] || 0) + 1 });
      // return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 7);
      const value = Object.entries(topTools.data.data)
      .map(([name, value]) => ({
         name,
         value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
      console.log(value)

      return value

      

      // return value
  }, [state.events,topTools?.data]);


  const currentData = useGetPromptEvents(state?.organization?.id ?? "",4,1)
//   const  = [
//     { name: 'SSN', value: 60, color: '#6366f1' }, // Indigo
//     { name: 'NIN', value: 50, color: '#0ea5e9' }, // Sky
//     { name: 'PII', value: 90, color: '#a855f7' }, // Purple
//   ];

  if(
   business.isLoading 
   || topDatatypes.isLoading
   || timeTrend.isLoading
   || riskyPrompt.isLoading
   || totalPrompt.isLoading
   || topTools.isLoading
   || currentData.isLoading

  ){
   return <div className="flex justify-center item-center w-full h-full px-3 py-5">
      <Loader2 className="w-5 h-5 animate-spin" /> 
   </div>
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Dashboard Title & Actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        {/* Hiding Filters */}
        {/* <div className="flex items-center gap-3">
             <div className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                Oct 18 - Nov 18
             </div>
             <div className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                Monthly
             </div>
             <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filter
             </button>
             <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
             </button>
        </div> */}
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                   <Activity className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Prompts</span>
             </div>
             <div className="group relative">
                <MoreHorizontal className="w-5 h-5 text-slate-400 cursor-pointer" />
             </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
             <h2 className="text-4xl font-bold text-slate-900 dark:text-white">{metrics.total.toLocaleString()}</h2>
             {/* <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                15.8% <ArrowUpRight className="w-3 h-3 ml-0.5" />
             </span> */}
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                   <Lock className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Sensitive Data Exposure</span>
             </div>
             <div className="group relative">
                <MoreHorizontal className="w-5 h-5 text-slate-400 cursor-pointer" />
             </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
             <h2 className="text-4xl font-bold text-slate-900 dark:text-white">{metrics.sensitivePct}%</h2>
             {/* <span className="flex items-center text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded-md">
                34.0% <ArrowDownRight className="w-3 h-3 ml-0.5" />
             </span> */}
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                   <AlertTriangle className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">High Risk Events</span>
             </div>
             <div className="group relative">
                <MoreHorizontal className="w-5 h-5 text-slate-400 cursor-pointer" />
             </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
             <h2 className="text-4xl font-bold text-slate-900 dark:text-white">{metrics.highRisk}</h2>
             {/* <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                24.2% <ArrowUpRight className="w-3 h-3 ml-0.5" />
             </span> */}
          </div>
        </div>
      </div>

      {/* Middle Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50">
           <div className="flex justify-between items-center mb-6">
              <div>
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">Risk Trend</h3>
                 {/* <div className="flex items-center gap-2 mt-1">
                    <span className="text-emerald-500 text-sm font-semibold flex items-center">
                        15.8% <ArrowUpRight className="w-3 h-3 ml-1" />
                    </span>
                    <span className="text-sm text-slate-400">+143.50 increased</span>
                 </div> */}
              </div>
              <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center">
                    <Filter className="w-3 h-3 mr-1.5" /> Filter
                  </button>
                  <button className="p-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
              </div>
           </div>
           
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={trendData}>
                 <defs>
                   <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                 <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                 <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                 />
                 <Area type="monotone" dataKey="risk" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                 <Area type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Vertical Bar Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Tools</h3>
              <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300">
                 Weekly <ChevronDown className="w-3 h-3 inline ml-1" />
              </button>
           </div>
           <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">24,473</h2>
              {/* <div className="flex items-center gap-2 mt-1 mb-6">
                    <span className="text-emerald-500 text-sm font-semibold flex items-center">
                        8.3% <ArrowUpRight className="w-3 h-3 ml-1" />
                    </span>
                    <span className="text-sm text-slate-400">+749 increased</span>
              </div> */}
           </div>
           <div className="h-55">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={toolData} barSize={24} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="toolBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dy={6}
                      interval={0}
                    />
                    <Tooltip
                        cursor={{fill: 'rgba(99, 102, 241, 0.06)'}}
                        contentStyle={{ color:'#6366f1', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 600, color: 'black' }}
                        formatter={(value, _name, item) => [value as number, item?.payload?.name]}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="url(#toolBarGradient)" />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Donut Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Data Types</h3>
              <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300">
                 Monthly <ChevronDown className="w-3 h-3 inline ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-6">
                {riskDistribution.map((item, i) => (
                    <div key={i} className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <div className="w-1 h-4 rounded-full" style={{backgroundColor: item.color}}></div>
                            <span className="text-xs text-slate-500">{item.name}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="h-[200px] relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                 </PieChart>
               </ResponsiveContainer>
               {/* Center Text (Absolute for Donut Half) */}
               <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-4">
               </div>
            </div>
        </div>

        {/* List of Integrations (Recent Alerts) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Alerts</h3>
              <button className="text-sm font-medium text-brand-600 hover:text-brand-700">See All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-left border-b border-slate-50 dark:border-slate-700">
                            <th className="pb-3 pl-2">Application</th>
                            <th className="pb-3">Type</th>
                            <th className="pb-3">Risk Rate</th>
                            {/* <th className="pb-3 text-right">Impact</th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                     {/*  {[
                            { app: 'Chatgpt', type: 'Finance', rate: 40, impact: '$650.00', color: '#6366f1' },
                            { app: 'Claude', type: 'CRM', rate: 80, impact: '$720.50', color: '#f97316' },
                            { app: 'Deepseek', type: 'Marketplace', rate: 20, impact: '$432.25', color: '#22c55e' },
                        ].map((row, i) => ( */}
                        {
                        // [
                        //     { app: 'Chatgpt', type: 'Finance', rate: 40,  color: '#6366f1' },
                        //     { app: 'Claude', type: 'CRM', rate: 80, color: '#f97316' },
                        //     { app: 'Deepseek', type: 'Marketplace', rate: 20,  color: '#22c55e' },
                        // ]
                        
                        (currentData?.data?.data ?? []).splice(0,3).map((row, i) => {
                           const color = randomColor()
                           const riskRate =  row.risk_score > 0 && row.risk_score ? (row.risk_score / 10) * 100 : 0
                           return (
                            <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="py-4 pl-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded border border-slate-200 flex items-center justify-center">
                                            {/* Checkbox mock */}
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs`} style={{backgroundColor:color }}>
                                            {(row.ai_tool_data?.tool_name ?? "")[0]}
                                        </div>
                                        <span className="font-medium text-slate-900 dark:text-white">{row.ai_tool_data?.tool_name ?? ""}</span>
                                    </div>
                                </td>
                                <td className="py-4 text-sm text-slate-500">{row.action}</td>
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 w-24 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                                            <div className="h-1.5 rounded-full" style={{width: `${riskRate}%`, backgroundColor: color}}></div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-500">{riskRate}%</span>
                                    </div>
                                </td>
                                {/* <td className="py-4 text-right text-sm font-medium text-slate-600 dark:text-slate-300">{row.impact}</td> */}
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

// Helper for icons used in the new dashboard layout
function ChevronDown({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
    )
}

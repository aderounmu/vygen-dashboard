import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { RiskBadge } from '../components/RiskBadge';
import { ChevronLeft, ChevronRight, Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { AIEvent } from '../types';

export const ActivityLog: React.FC = () => {
  const { state } = useStore();
  const [selectedEvent, setSelectedEvent] = useState<AIEvent | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEvents = state.events.filter(e => {
      const match = state.searchQuery.toLowerCase();
      return e.user.name.toLowerCase().includes(match) || 
             e.tool.toLowerCase().includes(match) ||
             e.promptSnippet.toLowerCase().includes(match);
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentData = filteredEvents.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Activity Log</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed inspection of AI interactions and DLP events.</p>
        </div>
        <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Export CSV</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tool</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {currentData.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img className="h-8 w-8 rounded-full" src={event.user.avatar} alt="" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{event.user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{event.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                        {event.tool}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RiskBadge level={event.riskLevel} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RiskBadge action={event.actionTaken} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        onClick={() => setSelectedEvent(event)}
                        className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white dark:bg-slate-800 px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between sm:px-6">
            <div className="flex-1 flex justify-between items-center">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(page * itemsPerPage, filteredEvents.length)}</span> of <span className="font-medium">{filteredEvents.length}</span> results
                </p>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Slide-over / Modal for Inspection Details */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedEvent(null)}></div>
          <div className="fixed inset-y-0 right-0 max-w-xl w-full flex pl-10">
            <div className="w-full relative bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-y-scroll">
                
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-900">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Event Inspection</h2>
                        <p className="text-sm text-slate-500">ID: {selectedEvent.id}</p>
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-500">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Header Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-semibold text-slate-500 uppercase">Risk Score</p>
                            <div className="flex items-center mt-1">
                                <span className={`text-2xl font-bold ${selectedEvent.riskScore > 80 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                                    {selectedEvent.riskScore}
                                </span>
                                <span className="text-sm text-slate-400 ml-1">/ 100</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                             <p className="text-xs font-semibold text-slate-500 uppercase">Latency</p>
                             <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{selectedEvent.latencyMs}ms</p>
                        </div>
                    </div>

                    {/* Detected Data */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Detected Sensitivity</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedEvent.detectedDataTypes.map(type => (
                                <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {type}
                                </span>
                            ))}
                            {selectedEvent.detectedDataTypes.includes('None') && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Safe
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Prompt Content */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Prompt Content (Anonymized)</h3>
                        <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                            {selectedEvent.promptSnippet}
                            {"\n\n"}<span className="text-slate-400 italic">// ... truncated for security ...</span>
                        </div>
                    </div>

                    {/* Risk Factors */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Risk Factors Calculation</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Tool Reputation (Public)</span>
                                <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div className="bg-orange-500 h-2 rounded-full" style={{width: '80%'}}></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Data Sensitivity</span>
                                <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{width: `${selectedEvent.riskScore}%`}}></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">User Anomaly Score</span>
                                <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '20%'}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mt-auto">
                    <button 
                        onClick={() => setSelectedEvent(null)}
                        className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    >
                        Close Inspection
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
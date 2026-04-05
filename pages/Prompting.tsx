import React, { useState } from 'react';
import { Send, ShieldCheck, ShieldAlert, ShieldX, Loader2, AlertTriangle, CheckCircle, Ban, Cpu, Globe, Zap, Info, ChevronDown } from 'lucide-react';
import { useGetAiToolConfigurations, useGetDataClassificationConfigurations } from '@/services/ai-configurations/hooks';
import { AppState, useStore } from '@/context/Store';
import { useSubmitPrompt } from '@/services/prompt/hook';
import { toast } from 'sonner';
import { useGetBusinessMember } from '@/services/business/hooks';


type actionType = 'block' | 'warn' | 'pass'
interface Violation {
  type: string;
  action: actionType;
  message: string;
}


interface ValidationResult {
  isValid: boolean;
  violations: Violation[];
  action: actionType;
  timestamp: string;
  risk_score: number;
  reasons: string[];
  platform: string;
}

const PLATFORMS = [
  { id: 'chatgpt', name: 'ChatGPT (OpenAI)', icon: Zap },
  { id: 'claude', name: 'Claude (Anthropic)', icon: Globe },
  { id: 'gemini', name: 'Gemini (Google)', icon: Cpu },
  { id: 'perplexity', name: 'Perplexity AI', icon: Globe },
  { id: 'copilot', name: 'Microsoft Copilot', icon: ShieldCheck },
];

export const Prompting: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { state}: {state: AppState} = useStore();
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // const bussines_member_id = "f4054b61-4e54-4c8b-b74e-af3b60396e17";

  const plaforms = useGetAiToolConfigurations(state?.organization?.id ?? "")
  const [selectedPlatform, setSelectedPlatform] = useState((plaforms?.data?.data ?? [])[0]?.tool_name);

  const bussiness_member = useGetBusinessMember(
    state?.organization?.id ?? ""
  )

  console.log("business member: ", bussiness_member)

  


  const submitPrompt = useSubmitPrompt(
    {
      successFn : (data) => {
          // toast.success("Prompt submit")
          const _data = (data?.data ?? [])[0]
          const isBlocked = _data.action.toLowerCase() === 'block'
          const _result: ValidationResult = {
            isValid: !isBlocked,
            violations: _data?.reasons?.split(",").map((item) => {
              return {
                type: item,
                action: _data.action.toLowerCase() as actionType,
                message: ""
              } as Violation
            }),
            action: _data.action.toLowerCase() as actionType,
            timestamp: _data.created_at,
            risk_score: _data.risk_score,
            reasons:_data?.reasons?.split(","),
            platform: _data?.ai_tool_data?.tool_name,
          }
          setResult(_result)
     },
     failureFn: (error) => {
        const message = ""
        setError("Error occured submitting prompt")
        toast.error(`Error occured submitting prompt`)
     }
    }
  )

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    // Simulate network delay
    // setTimeout(() => {
    //   const promptLower = prompt.toLowerCase();
    //   const violations: Violation[] = [];
    //   const reasons: string[] = [];
    //   let riskScore = 0;

    //   // Client-side validation logic
    //   if (promptLower.includes("nin") || /\d{11}/.test(prompt)) {
    //     violations.push({
    //       type: "NIN",
    //       action: 'block',
    //       message: "Potential National Identification Number detected."
    //     });
    //     reasons.push("nin");
    //     riskScore = Math.max(riskScore, 95);
    //   }

    //   if (promptLower.includes("password") || promptLower.includes("secret_key")) {
    //     violations.push({
    //       type: "Credentials",
    //       action: 'block',
    //       message: "Potential credentials detected."
    //     });
    //     reasons.push("credentials");
    //     riskScore = Math.max(riskScore, 90);
    //   }

    //   if (promptLower.includes("email") || promptLower.includes("phone")) {
    //     violations.push({
    //       type: "PII",
    //       action: 'warn',
    //       message: "Personally Identifiable Information detected."
    //     });
    //     reasons.push("pii");
    //     riskScore = Math.max(riskScore, 45);
    //   }

    //   if (violations.length === 0) {
    //     riskScore = 5;
    //   }

    //   const isBlocked = violations.some(v => v.action === 'block');
    //   const isWarned = violations.some(v => v.action === 'warn');

    //   setResult({
    //     isValid: !isBlocked,
    //     violations,
    //     action: isBlocked ? 'block' : (isWarned ? 'warn' : 'pass'),
    //     timestamp: new Date().toISOString(),
    //     risk_score: riskScore,
    //     reasons: reasons.length > 0 ? reasons : ["none"],
    //     platform: PLATFORMS.find(p => p.id === selectedPlatform)?.name || 'Unknown'
    //   });
    //   setIsLoading(false);
    // }, 800);

    const payload = {
      business_reference : state.organization.reference ?? "",
      business_member_id: bussiness_member.data.data.id ?? "",
      ai_tool: selectedPlatform,
      prompt: prompt
    }

    console.log("Submitting prompt: ", {
      businessId: state?.organization?.id ?? "",
      payload
    })
  
    submitPrompt.mutate({
      businessId: state?.organization?.id ?? "",
      payload,
    })
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'block': return <ShieldX className="w-12 h-12 text-red-500" />;
      case 'warn': return <ShieldAlert className="w-12 h-12 text-yellow-500" />;
      case 'pass': return <ShieldCheck className="w-12 h-12 text-emerald-500" />;
      default: return null;
    }
  };

  const getActionTitle = (action: string) => {
    switch (action) {
      case 'block': return 'Prompt Blocked';
      case 'warn': return 'Warning Issued';
      case 'pass': return 'Prompt Approved';
      default: return '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Prompting & Validation</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Simulate prompts across different AI platforms with real-time DLP.</p>
        </div>
        
        <div className="w-full md:w-64">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Platform</label>
          <div className="relative">
            <select 
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none appearance-none shadow-sm cursor-pointer"
            >
              {(plaforms?.data?.data ?? []).map(p => (
                <option key={p.id} value={p.tool_name}>{p.tool_name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex gap-2 items-center pr-3 pointer-events-none">
              <Globe className="w-4 h-4 text-slate-400" />
              <ChevronDown/>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Enter Prompt</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Live DLP Active</span>
              </div>
            </div>
            <form onSubmit={handleValidate} className="space-y-4">
              <textarea
                className="w-full h-80 p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none font-sans text-sm leading-relaxed"
                placeholder={`Type your prompt for ${selectedPlatform?.toLowerCase() ?? ""}...`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                type="submit"
                disabled={submitPrompt.isPending || !prompt.trim()}
                className="w-full flex items-center justify-center py-3.5 px-4 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all shadow-md font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {submitPrompt.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Validate & Simulate
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {!result && !error && (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center min-h-[400px]">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
                <ShieldCheck className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 dark:text-white font-bold mb-1">Ready for Validation</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[240px]">Results will appear here after validation. We'll check for PII, NIN, and other sensitive data.</p>
            </div>
          )}

          {error && (
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Validation Error</h3>
              <p className="text-red-600 dark:text-red-300 mt-2">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-in slide-in-from-right duration-300">
              {/* Header Status */}
              <div className={`p-8 text-center border-b border-slate-100 dark:border-slate-700 ${
                result.action === 'block' ? 'bg-red-50/50 dark:bg-red-900/10' :
                result.action === 'warn' ? 'bg-yellow-50/50 dark:bg-yellow-900/10' :
                'bg-emerald-50/50 dark:bg-emerald-900/10'
              }`}>
                <div className="flex justify-center mb-4">
                  {getActionIcon(result.action)}
                </div>
                <h3 className={`text-xl font-bold ${
                  result.action === 'block' ? 'text-red-700 dark:text-red-400' :
                  result.action === 'warn' ? 'text-yellow-700 dark:text-yellow-400' :
                  'text-emerald-700 dark:text-emerald-400'
                }`}>
                  {getActionTitle(result.action)}
                </h3>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform:</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{result.platform}</span>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="p-6 grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-700">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Score</p>
                  <div className="flex items-end gap-1">
                    <span className={`text-2xl font-bold ${
                      result.risk_score > 80 ? 'text-red-500' : 
                      result.risk_score > 40 ? 'text-yellow-500' : 
                      'text-emerald-500'
                    }`}>{result.risk_score}</span>
                    <span className="text-xs text-slate-400 mb-1">/ 100</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Reason</p>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 capitalize">{result.reasons[0]}</span>
                </div>
              </div>

              {/* Policy Violations List */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Policy Violations</h4>
                  <span className="text-[10px] font-medium text-slate-400">JSON: {`{"risk_score": ${result.risk_score}, "action": "${result.action}", "reasons": "${result.reasons.join(', ')}"}`}</span>
                </div>
                
                {result.violations.length === 0 ? (
                  <div className="flex items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">No violations detected</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {result.violations.map((v, i) => (
                      <div key={i} className={`flex items-start p-4 border rounded-xl ${
                        v.action === 'block' ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800' : 'bg-yellow-50 border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-800'
                      }`}>
                        {v.action === 'block' ? <Ban className="w-5 h-5 text-red-500 mr-3 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />}
                        <div>
                          <p className={`text-sm font-bold ${v.action === 'block' ? 'text-red-700 dark:text-red-400' : 'text-yellow-700 dark:text-yellow-400'}`}>
                            {v.type} Detected
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{v.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Sample UI for Toggling (as requested) */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                   <div className="flex items-center gap-2 mb-3">
                      <Info className="w-4 h-4 text-brand-500" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Validation Insights</span>
                   </div>
                   <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      The prompt was analyzed using the <strong>Vyken DLP Engine</strong>. 
                      Detected patterns for <strong>{result.reasons.join(', ')}</strong> triggered a <strong>{result.action}</strong> action. 
                      Risk score was calculated based on data sensitivity and platform reputation.
                   </div>
                </div>

                <div className="pt-4 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>VALIDATED AT: {new Date(result.timestamp).toLocaleTimeString()}</span>
                  <span>ENGINE: VYKEN-DLP-V1</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

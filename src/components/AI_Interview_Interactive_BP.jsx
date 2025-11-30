import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight, ChevronLeft, Play, Users,
  TrendingUp, Database, Brain, Cpu, Target,
  Activity, Zap, Layers, MessageSquare,
  Settings, Lightbulb, UserCheck, Sparkles, BarChart3,
  Bot, Send, ThumbsUp, AlertCircle, RefreshCw,
  Video, Mic, BookOpen, UserPlus, FileText, Swords,
  Sigma, GitBranch, Scale, User, GraduationCap, Briefcase, Code
} from 'lucide-react';

// -------------------
// OpenAI API 交互工具函数 (已替换)
// -------------------
const callOpenAI = async (prompt, isJson = false) => {
  // ⚠️ 请在此处填入您的 OpenAI API Key，或者配置环境变量
  const apiKey = "";
  const url = "https://api.openai.com/v1/chat/completions";

  const payload = {
    model: "gpt-4o", // 使用 GPT-4o 或 gpt-3.5-turbo
    messages: [
      { role: "system", content: "You are a helpful AI assistant specialized in technical interviews." },
      { role: "user", content: prompt }
    ],
    response_format: isJson ? { type: "json_object" } : undefined
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API Error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (isJson && text) {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("JSON Parse Error:", e);
        return null;
      }
    }
    return text;
  } catch (error) {
    console.error("OpenAI API Call Failed:", error);
    return null;
  }
};

// -------------------
// MathJax 组件：用于渲染 LaTeX 公式
// -------------------
const MathJaxFormula = ({ formula, block = false }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise && window.MathJax.typesetPromise([ref.current]);
    }
  }, [formula]);

  return (
    <span ref={ref} className={block ? "block my-4 text-center" : ""}>
      {block ? `\\[${formula}\\]` : `\\(${formula}\\)`}
    </span>
  );
};

// -------------------
// 核心数据与常量配置
// -------------------
const TOTAL_EMPLOYMENT = 734000000; // 7.34亿就业人口
const GRADUATES_2025 = 12220000;   // 1222万毕业生
const UNIT_PRICE = 100;            // 单价 100元

// -------------------
// 子组件：中国就业人口预测折线图
// -------------------
const EmploymentTrendChart = () => {
  const data = [
    { year: 2020, val: 7.5 }, { year: 2021, val: 7.46 },
    { year: 2022, val: 7.33 }, { year: 2023, val: 7.40 },
    { year: 2024, val: 7.38 }, { year: 2025, val: 7.34 },
    { year: 2026, val: 7.31 }, { year: 2027, val: 7.28 },
    { year: 2028, val: 7.25 }, { year: 2029, val: 7.22 },
    { year: 2030, val: 7.19 }
  ];

  const width = 400;
  const height = 180;
  const padding = 20;
  const minVal = 7.0;
  const maxVal = 7.6;

  const xScale = (i) => padding + (i / (data.length - 1)) * (width - padding * 2);
  const yScale = (val) => height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
  const pathD = `M ${data.map((d, i) => `${xScale(i)} ${yScale(d.val)}`).join(' L ')}`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h4 className="text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
        <TrendingUp size={16} className="text-blue-600"/> 就业人口趋势预测 (亿人)
      </h4>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {[7.2, 7.3, 7.4, 7.5].map(v => (
          <line key={v} x1={padding} y1={yScale(v)} x2={width-padding} y2={yScale(v)} stroke="#e2e8f0" strokeDasharray="4" />
        ))}
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="3" className="drop-shadow-md" />
        <circle cx={xScale(5)} cy={yScale(data[5].val)} r="4" fill="white" stroke="#ef4444" strokeWidth="2" />
        <text x={xScale(5)} y={yScale(data[5].val) - 10} fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="bold">2025: 7.34亿</text>
        {data.map((d, i) => i % 2 === 0 && (
          <text key={d.year} x={xScale(i)} y={height} fontSize="10" fill="#94a3b8" textAnchor="middle">{d.year}</text>
        ))}
      </svg>
      <div className="text-[10px] text-slate-400 mt-2">虽然总量微降，但结构性错配加剧了对精准匹配的需求。</div>
    </div>
  );
};

// -------------------
// 子组件：GSPO 算法动态演示图表
// -------------------
const AlgorithmChart = ({ epoch }) => {
  const generateData = (steps) => {
    const ppo = [];
    const gspo = [];
    for (let i = 0; i <= 20; i++) {
      const noise = Math.random() * 30 * (1 - i/20);
      const ppoVal = 100 - (i * 3) + noise;
      const gspoVal = 100 - (i * 4.5) - (i > 5 ? 10 : 0);
      ppo.push(Math.max(10, ppoVal));
      gspo.push(Math.max(5, gspoVal));
    }
    return { ppo, gspo };
  };

  const [data] = useState(() => generateData(20));
  const currentPPO = data.ppo.slice(0, epoch);
  const currentGSPO = data.gspo.slice(0, epoch);

  const width = 500;
  const height = 250;
  const padding = 30;
  const xScale = (width - padding * 2) / 20;
  const yScale = (height - padding * 2) / 100;

  const makePath = (arr) => {
    if (arr.length === 0) return "";
    let d = `M ${padding} ${height - padding - arr[0] * yScale}`;
    arr.forEach((val, i) => {
      d += ` L ${padding + i * xScale} ${height - padding - val * yScale}`;
    });
    return d;
  };

  const makeArea = (arr) => {
    if (arr.length === 0) return "";
    let d = makePath(arr);
    d += ` L ${padding + (arr.length - 1) * xScale} ${height - padding}`;
    d += ` L ${padding} ${height - padding} Z`;
    return d;
  };

  return (
    <div className="relative bg-slate-900/95 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden h-full flex flex-col justify-between">
      <div className="absolute inset-0 opacity-10"
           style={{backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
      </div>

      <div className="flex justify-between mb-4 text-xs font-mono relative z-10">
        <div className="flex items-center text-red-400">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
          Standard PPO (Token-level)
        </div>
        <div className="flex items-center text-blue-400">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 shadow-[0_0_10px_#3b82f6]"></div>
          A-GSPO (Sequence-level)
        </div>
      </div>

      <svg width="100%" height="200" viewBox={`0 0 ${width} ${height}`} className="overflow-visible relative z-10">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#475569" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#475569" strokeWidth="1" />

        <defs>
          <linearGradient id="gradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={makeArea(currentGSPO)} fill="url(#gradBlue)" className="transition-all duration-300 ease-out" />
        <path d={makePath(currentPPO)} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" strokeOpacity="0.7" className="transition-all duration-300" />
        <path d={makePath(currentGSPO)} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" className="transition-all duration-300 filter drop-shadow-[0_0_3px_rgba(59,130,246,0.5)]" />
      </svg>

      <div className="mt-4 text-center">
        <div className="text-[10px] text-slate-400">RLHF Training Steps</div>
      </div>
    </div>
  );
};

// -------------------
// 子组件：Gemini 实战模拟器 (增强版)
// -------------------
const LiveDemo = () => {
  const [role, setRole] = useState("前端工程师");
  const [mode, setMode] = useState("selection"); // selection, mode1, mode2, mode3
  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState([]); // For Agent vs Agent
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState("");

  const reset = () => {
    setMode("selection");
    setStatus("idle");
    setQuestion("");
    setAnswer("");
    setEvaluation(null);
    setLogs([]);
    setError("");
  };

  // Case 1: AI 面试官 (Standard)
  const startMode1 = async () => {
    setMode("mode1");
    setStatus("generating_q");
    const prompt = `你是一位严厉的资深技术面试官。请针对 "${role}" 职位生成一道简短、有深度的面试题。只输出问题。`;
    const text = await callOpenAI(prompt); // Changed to callOpenAI
    if (text) {
      setQuestion(text);
      setStatus("answering");
    } else {
      setError("API Error");
    }
  };

  const evaluateMode1 = async () => {
    setStatus("evaluating");
    const prompt = `职位:${role}\n问题:${question}\n回答:${answer}\n请以JSON格式返回评估:{score:number, analysis:string, highlight:string, suggestion:string}`;
    const res = await callOpenAI(prompt, true); // Changed to callOpenAI
    if (res) {
      setEvaluation(res);
      setStatus("results");
    }
  };

  // Case 2: 真人面试官 (Human asks AI)
  const startMode2 = () => {
    setMode("mode2");
    setStatus("answering"); // User inputs question
  };

  const submitQuestionMode2 = async () => {
    setStatus("generating_a"); // AI generating answer
    const prompt = `你现在是一位正在应聘 "${role}" 职位的候选人。面试官问你: "${answer}" (注:这里的answer变量存的是用户的问题)。请用专业、自信的口吻回答，展示你的胜任力。`;
    const text = await callOpenAI(prompt); // Changed to callOpenAI
    if (text) {
      setEvaluation({ analysis: text }); // Reuse evaluation UI to show answer
      setStatus("results");
    }
  };

  // Case 3: Agent vs Agent (Simulation)
  const startMode3 = async () => {
    setMode("mode3");
    setStatus("simulating");
    setLogs([{ role: 'system', text: '初始化对抗生成环境...' }]);

    // Step 1: Interviewer generates question
    const qPrompt = `模拟面试开始。你是面试官，招聘 "${role}"。请提出第一个问题。简短一点。`;
    const qText = await callOpenAI(qPrompt); // Changed to callOpenAI
    const newLogs = [...logs, { role: 'Interviewer', text: qText }];
    setLogs(newLogs);

    // Step 2: Candidate answers
    const aPrompt = `你是 "${role}" 候选人。面试官问: "${qText}"。请回答。`;
    const aText = await callOpenAI(aPrompt); // Changed to callOpenAI
    const newLogs2 = [...newLogs, { role: 'Candidate', text: aText }];
    setLogs(newLogs2);

    // Step 3: Interviewer evaluates/follows up
    const fPrompt = `你是面试官。候选人回答: "${aText}"。请简短评价并结束面试。`;
    const fText = await callOpenAI(fPrompt); // Changed to callOpenAI
    setLogs([...newLogs2, { role: 'Interviewer', text: fText }]);

    setStatus("finished");
  };

  return (
    <div className="w-full max-w-5xl mx-auto min-h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="text-blue-600"/> 数据生成控制台
          </h2>
          <p className="text-slate-500 text-sm">选择不同的角色扮演模式，生成高质量的指令微调数据集 (SFT Data)</p>
          <p className="text-xs text-indigo-500 mt-1 font-mono">Powered by OpenAI GPT-4o</p>
        </div>
        {mode !== 'selection' && (
          <button onClick={reset} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
            <RefreshCw size={14}/> 返回模式选择
          </button>
        )}
      </div>

      {mode === 'selection' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div onClick={startMode1} className="group cursor-pointer bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
              <Bot size={32}/>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">模式 A: AI 面试官</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              最经典模式。AI 提问，人类回答。用于采集真实的候选人与 AI 的交互数据，进行偏好对齐。
            </p>
          </div>

          <div onClick={startMode2} className="group cursor-pointer bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-500 transition-all text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors text-purple-600">
              <UserCheck size={32}/>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">模式 B: 真人面试官</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              反向图灵测试。人类提问，AI 作答。用于专家评估模型的专业能力，构建专家演示数据 (Expert Demo)。
            </p>
          </div>

          <div onClick={startMode3} className="group cursor-pointer bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-green-500 transition-all text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors text-green-600">
              <Swords size={32}/>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">模式 C: 对抗生成</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Agent vs Agent。全自动化的左右互搏，低成本快速生成海量对话数据，用于预训练或 SFT。
            </p>
          </div>

          <div className="md:col-span-3 mt-4 flex justify-center">
             <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-center w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="设置目标岗位 (默认: 前端工程师)"
             />
          </div>
        </div>
      )}

      {/* Mode 1 UI */}
      {mode === 'mode1' && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
           {status === 'generating_q' && <div className="text-center py-10 text-slate-500 animate-pulse">AI 面试官正在出题...</div>}
           {(status === 'answering' || status === 'evaluating' || status === 'results') && (
             <div className="space-y-6">
               <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                 <div className="text-xs font-bold text-blue-600 mb-1">AI Interviewer Question:</div>
                 <div className="font-medium text-slate-800">{question}</div>
               </div>
               <textarea
                 value={answer}
                 onChange={(e) => setAnswer(e.target.value)}
                 className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                 placeholder="请输入你的回答..."
                 disabled={status !== 'answering'}
               />
               {status === 'answering' && (
                 <button onClick={evaluateMode1} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold w-full">提交回答</button>
               )}
               {status === 'results' && evaluation && (
                 <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-green-800">AI 评分: {evaluation.score}</span>
                    </div>
                    <p className="text-sm text-green-700">{evaluation.analysis}</p>
                 </div>
               )}
             </div>
           )}
        </div>
      )}

      {/* Mode 2 UI */}
      {mode === 'mode2' && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
           <div className="space-y-6">
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">作为面试官，请输入你的问题:</label>
               <input
                 type="text"
                 value={answer} // Reuse answer state for input
                 onChange={(e) => setAnswer(e.target.value)}
                 className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                 placeholder="例如: 请介绍一下 React 的虚拟 DOM..."
                 disabled={status === 'results'}
               />
             </div>
             {status === 'answering' && (
                <button onClick={submitQuestionMode2} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold w-full flex items-center justify-center gap-2">
                  <Bot size={18}/> 让 AI 候选人回答
                </button>
             )}
             {status === 'generating_a' && <div className="text-center py-4 text-purple-500 animate-pulse">AI 候选人正在思考...</div>}
             {status === 'results' && evaluation && (
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 relative">
                  <div className="absolute -top-3 -left-3 bg-purple-600 text-white p-2 rounded-lg shadow-md"><UserCheck size={20}/></div>
                  <div className="ml-6">
                    <div className="text-xs font-bold text-purple-400 mb-2 uppercase">AI Candidate Response</div>
                    <p className="text-slate-800 leading-relaxed">{evaluation.analysis}</p>
                  </div>
                </div>
             )}
           </div>
        </div>
      )}

      {/* Mode 3 UI */}
      {mode === 'mode3' && (
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 animate-fade-in min-h-[400px] flex flex-col">
           <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2">
             {logs.map((log, idx) => (
               <div key={idx} className={`flex gap-4 ${log.role === 'Interviewer' ? 'flex-row' : log.role === 'Candidate' ? 'flex-row-reverse' : 'justify-center'}`}>
                 {log.role !== 'system' && (
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${log.role === 'Interviewer' ? 'bg-blue-600' : 'bg-green-600'}`}>
                     {log.role === 'Interviewer' ? <Bot size={16} className="text-white"/> : <UserCheck size={16} className="text-white"/>}
                   </div>
                 )}
                 <div className={`p-3 rounded-xl max-w-[80%] text-sm ${
                   log.role === 'system' ? 'bg-transparent text-slate-500 text-xs italic' : 
                   log.role === 'Interviewer' ? 'bg-slate-800 text-slate-200 rounded-tl-none' : 
                   'bg-green-900/30 text-green-100 border border-green-800 rounded-tr-none'
                 }`}>
                   {log.role !== 'system' && <div className="text-[10px] opacity-50 mb-1 font-bold uppercase">{log.role}</div>}
                   {log.text}
                 </div>
               </div>
             ))}
             {status === 'simulating' && (
               <div className="flex justify-center py-4">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce mx-1"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce mx-1 delay-75"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce mx-1 delay-150"></div>
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};

// -------------------
// 子组件：团队介绍页 (Updated)
// -------------------
const TeamPage = () => {
  const team = [
    { name: "高尔濂", role: "Project Leader", desc: "项目负责人 / 市场调研+算法设计", icon: <Code size={20}/>, color: "bg-blue-100 text-blue-600" },
    { name: "王亚妃", role: "Product Manager", desc: "项目成员 / 数据收集", icon: <Briefcase size={20}/>, color: "bg-pink-100 text-pink-600" },
    { name: "徐琛", role: "Algorithm Eng", desc: "项目成员 / 知识库设计", icon: <GitBranch size={20}/>, color: "bg-orange-100 text-orange-600" },
    { name: "杨焱博", role: "Algorithm Eng", desc: "项目成员 / RL算法设计", icon: <GitBranch size={20}/>, color: "bg-orange-100 text-orange-600" },
    { name: "马蕊", role: "Advisor", desc: "项目成员 / 认知框架设计", icon: <GraduationCap size={20}/>, color: "bg-purple-100 text-purple-600" },
    { name: "高子尧", role: "Frontend Dev", desc: "项目成员 / 知识库设计", icon: <User size={20}/>, color: "bg-green-100 text-green-600" },
    { name: "陈星延", role: "Advisor", desc: "副教授 / 创新创业指导教师", icon: <GraduationCap size={20}/>, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet The Team</h2>
        <p className="text-slate-500">来自北京邮电大学的创新团队</p>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative group/scroll">
        <div className="flex overflow-x-auto gap-6 pb-8 px-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {team.map((member, idx) => (
            <div key={idx} className="min-w-[280px] md:min-w-[300px] snap-center bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${member.color} rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                  {member.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
              <div className="text-xs font-bold text-indigo-600 mb-3 uppercase tracking-wide">{member.role}</div>
              <p className="text-sm text-slate-500 leading-relaxed mt-auto">
                {member.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative fade for scroll hints - Left/Right Fade */}
        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent pointer-events-none md:block hidden"></div>
        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent pointer-events-none md:block hidden"></div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">加入我们？</h3>
          <p className="opacity-70 mb-6">如果你对 LLM、RLHF 或前端交互感兴趣，欢迎联系。</p>
          <button className="px-6 py-2 bg-white text-slate-900 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors">
            联系负责人
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};

// -------------------
// 主组件
// -------------------
const App = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [marketRate, setMarketRate] = useState(0.001);
  const [revenue, setRevenue] = useState(0);
  const [trainStep, setTrainStep] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [activeModule, setActiveModule] = useState(null); // Added back for ReAct framework

  // MathJax Loader
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.async = true;
    document.head.appendChild(script);

    window.MathJax = {
      tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
      svg: { fontCache: 'global' }
    };

    return () => {
      document.head.removeChild(script);
    }
  }, []);

  useEffect(() => {
    const val = (TOTAL_EMPLOYMENT * (marketRate / 100) * UNIT_PRICE).toFixed(0);
    setRevenue(val);
  }, [marketRate]);

  useEffect(() => {
    let interval;
    if (isTraining) {
      interval = setInterval(() => {
        setTrainStep((prev) => {
          if (prev >= 20) {
            setIsTraining(false);
            return 20;
          }
          return prev + 1;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isTraining]);

  const steps = [
    { id: 'intro', title: '愿景' },
    { id: 'market', title: '市场' },
    { id: 'data', title: '数据' },
    { id: 'framework', title: '架构' },
    { id: 'algorithm', title: '算法' },
    { id: 'demo', title: 'Live Demo' },
    { id: 'team', title: '团队' }, // New Team Step
    { id: 'summary', title: '未来' }
  ];

  const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const Card = ({ children, className = "" }) => (
    <div className={`bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-xl shadow-slate-200/50 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-x-hidden selection:bg-blue-200 selection:text-blue-900">

      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* 顶部导航 */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-lg border-b border-slate-200/60 z-50 px-6 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveStep(0)}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight leading-none text-slate-900">Interactive BP</div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">AI Recruitment System</div>
          </div>
        </div>

        <div className="hidden md:flex gap-2 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/60 backdrop-blur-sm">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(idx)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                idx === activeStep 
                  ? 'bg-white text-blue-600 shadow-sm scale-105' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="relative z-10 pt-32 pb-24 max-w-6xl mx-auto px-6 min-h-screen flex flex-col justify-center">

        {/* Step 1: 封面/愿景 */}
        {activeStep === 0 && (
          <div className="flex flex-col md:flex-row items-center gap-16 animate-fade-in-up">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                2025 北邮创新创业项目
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                认知的镜像<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  灵魂的共鸣
                </span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                基于 GSPO 强化学习与真实数据驱动。<br/>
                <span className="font-semibold text-indigo-600">融合 AI 智能体 (Agents) 与深度认知架构 (Cognitive Framework)</span>，构建拥有"思考力"的 AI 面试官。
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={nextStep} className="group px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-3">
                  开始演示 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="px-8 py-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 font-medium text-slate-600 flex items-center gap-4 hover:bg-white/80 transition-colors cursor-default">
                   <div className="flex -space-x-3">
                     {[1,2,3].map(i => (
                       <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 z-${10-i}`}>User</div>
                     ))}
                   </div>
                   <span>已服务 10,000+ 求职者</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex justify-center perspective-1000">
              <div className="relative w-[450px] h-[450px] animate-float">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse-slow"></div>

                <Card className="relative w-full h-full !bg-white/80 flex flex-col items-center justify-center gap-8 border-t-white/80 border-l-white/80 transform rotate-y-12 hover:rotate-0 transition-transform duration-700 ease-out">
                  <div className="relative">
                     <Brain size={100} className="text-blue-600 drop-shadow-lg" />
                     <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-4 border-white"></div>
                  </div>

                  <div className="space-y-3 text-center w-full max-w-[200px]">
                    <div className="h-2.5 bg-slate-100 rounded-full w-full animate-pulse"></div>
                    <div className="h-2.5 bg-slate-100 rounded-full w-2/3 mx-auto animate-pulse delay-75"></div>
                    <div className="h-2.5 bg-slate-100 rounded-full w-4/5 mx-auto animate-pulse delay-150"></div>
                  </div>

                  <div className="absolute -left-8 bottom-12 bg-white p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                      <Zap size={24} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">拟真度评分</div>
                      <div className="font-bold text-xl text-slate-900">98.5%</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: 市场动态推演 */}
        {activeStep === 1 && (
          <div className="space-y-10 animate-fade-in">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-bold text-slate-900">万亿级市场的微观推演</h2>
              <p className="text-slate-500 text-lg">基于真实就业数据构建的商业模型</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <Card className="md:col-span-4 h-full flex flex-col justify-between !bg-white">
                <div>
                  <div className="flex items-center gap-3 mb-8 text-slate-800">
                    <div className="p-2 bg-slate-100 rounded-lg"><Settings size={20} /></div>
                    <h3 className="font-bold text-xl">推演参数</h3>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-end mb-4">
                        <label className="text-sm font-bold text-slate-700">市场渗透率 (Market Share)</label>
                        <span className="text-3xl font-bold text-blue-600">{marketRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.001"
                        max="1.0"
                        step="0.001"
                        value={marketRate}
                        onChange={(e) => setMarketRate(e.target.value)}
                        className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:ring-4 focus:ring-blue-100 transition-shadow"
                      />
                      <div className="flex justify-between text-xs font-medium text-slate-400 mt-2">
                        <span>0.001% (种子期)</span>
                        <span>1.0% (爆发期)</span>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-xl space-y-3 border border-slate-100">
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-500">就业人口基数</span>
                         <span className="font-bold text-slate-700">7.34 亿</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-500">年换工作频次</span>
                         <span className="font-bold text-slate-700">~17.5%</span>
                      </div>
                    </div>

                    {/* 新增: 就业人口趋势图 */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <EmploymentTrendChart />
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-xs text-slate-400 leading-relaxed">
                  * 数据来源：国家统计局 2024年统计年鉴 / 智联招聘年度报告
                </div>
              </Card>

              <div className="md:col-span-8 grid grid-cols-1 gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-3xl shadow-2xl shadow-blue-500/20 group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform"><Users size={100}/></div>
                    <div className="flex items-center gap-2 mb-3 opacity-80 font-medium">
                      <Activity size={18} /> 预计用户规模
                    </div>
                    <div className="text-5xl font-bold tracking-tight mb-4">
                      {Math.floor(TOTAL_EMPLOYMENT * (marketRate / 100)).toLocaleString()}
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                      <span>覆盖应届生</span>
                      <span className="font-bold">{((TOTAL_EMPLOYMENT * (marketRate / 100) / GRADUATES_2025) * 100).toFixed(2)}%</span>
                    </div>
                  </div>

                  <Card className="flex flex-col justify-center group hover:scale-[1.02] transition-transform border-l-4 border-l-green-500">
                    <div className="flex items-center gap-2 mb-3 text-slate-500 font-medium">
                      <BarChart3 size={18} /> 预计年度营收 (ARR)
                    </div>
                    <div className="text-5xl font-bold text-slate-900 tracking-tight">
                      <span className="text-2xl text-slate-400 mr-2">¥</span>
                      {parseInt(revenue).toLocaleString()}
                    </div>
                    <div className="mt-4 text-sm text-green-600 font-bold flex items-center gap-1">
                      <TrendingUp size={16} /> YoY +125% (Pro forma)
                    </div>
                  </Card>
                </div>

                <Card>
                  <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                    <Target size={20} className="text-purple-500"/>
                    痛点热力图
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span>HR 端：海量简历筛选效率低</span>
                        <span className="text-red-500">高频痛点 85%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-400 to-red-600 w-[85%] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span>C 端：面试反馈缺失，能力盲区</span>
                        <span className="text-orange-500">刚需痛点 92%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 w-[92%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 数据引擎 */}
        {activeStep === 2 && (
          <div className="flex flex-col items-center animate-fade-in w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">数据引擎：从混沌到有序</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">构建 "Data Flywheel"（数据飞轮），利用自蒸馏技术解决高质量面试数据稀缺难题。</p>
            </div>

            <div className="relative w-full max-w-5xl">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent -z-10 transform -translate-y-1/2 border-t border-dashed border-slate-300"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  {
                    icon: <Database size={32}/>, color: 'text-pink-500', bg: 'bg-pink-50',
                    title: "多源异构采集",
                    sub: "Raw Data Injection",
                    desc: "全方位采集真实面试场景数据，构建基础语料池。",
                    extra: (
                      <div className="flex justify-center gap-3 mt-3">
                        <div className="flex flex-col items-center gap-1 group/icon">
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 group-hover/icon:scale-110 transition-transform"><Video size={14}/></div>
                          <span className="text-[9px] text-slate-500">Bilibili</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 group/icon">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 group-hover/icon:scale-110 transition-transform"><BookOpen size={14}/></div>
                          <span className="text-[9px] text-slate-500">小红书</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 group/icon">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 group-hover/icon:scale-110 transition-transform"><Mic size={14}/></div>
                          <span className="text-[9px] text-slate-500">录音</span>
                        </div>
                      </div>
                    )
                  },
                  {
                    icon: <Cpu size={32}/>, color: 'text-blue-600', bg: 'bg-blue-50',
                    title: "知识数据增强",
                    sub: "Knowledge Data Augmentation",
                    desc: "多场景对抗生成，生成更多伪标签数据。",
                    badge: "核心技术",
                    extra: (
                      <div className="mt-3 space-y-1 text-xs text-left bg-blue-50/50 p-2 rounded-lg">
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> AI 面试官 + 真人应聘者</div>
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> 真人面试官 + AI 应聘者</div>
                        <div className="flex items-center gap-2 font-bold text-indigo-600"><Swords size={12}/> Agent vs Agent 对抗</div>
                      </div>
                    )
                  },
                  {
                    icon: <Target size={32}/>, color: 'text-purple-500', bg: 'bg-purple-50',
                    title: "RLHF & 数据策略",
                    sub: "Data Generation Scheme",
                    desc: "高质量数据生成与微调闭环。",
                    extra: (
                       <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-slate-500 font-mono bg-purple-50/50 p-2 rounded-lg">
                          <span>Generate</span>
                          <ChevronRight size={10}/>
                          <span className="font-bold text-purple-600">Annotate</span>
                          <ChevronRight size={10}/>
                          <span>Fine-tune</span>
                       </div>
                    )
                  }
                ].map((item, i) => (
                  <div key={i} className="group bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative hover:-translate-y-2 transition-all duration-300 flex flex-col">
                    {item.badge && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-500/30 tracking-wider">
                        {item.badge}
                      </div>
                    )}
                    <div className={`w-20 h-20 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-1 text-center">{item.title}</h3>
                    <div className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider mb-4">{item.sub}</div>
                    <p className="text-sm text-slate-600 text-center leading-relaxed mb-4">
                      {item.desc}
                    </p>
                    {item.extra && (
                      <div className="mt-auto">
                        {item.extra}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: 认知架构 (Full Restoration) */}
        {activeStep === 3 && (
          <div className="animate-fade-in w-full">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">ReAct 认知架构</h2>
                <p className="text-slate-500">点击流程图节点，查看 AI 的内部思考回路</p>
              </div>
              <div className="text-right hidden md:block">
                 <div className="text-xs font-bold text-slate-400 uppercase">Framework</div>
                 <div className="font-mono text-blue-600">LangGraph / MCP Protocol</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
              {/* 交互式流程图 */}
              <div className="lg:col-span-2 bg-slate-50/50 rounded-3xl border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center p-8 select-none">
                <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-[0.05]">
                    {[...Array(400)].map((_,i)=><div key={i} className="border border-slate-900"></div>)}
                </div>

                {/* 模拟对话气泡 */}
                <div className="absolute top-8 left-8 bg-white px-4 py-2 rounded-tl-none rounded-2xl shadow-sm border border-slate-200 text-sm text-slate-600 italic max-w-xs z-10">
                   "用户: 请问 React 的 Fiber 架构是什么？"
                </div>

                <div className="relative z-20 flex flex-col items-center gap-4 w-full max-w-md">

                  {/* Thought */}
                  <div
                    onClick={() => setActiveModule('thought')}
                    className={`w-full cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 relative group
                      ${activeModule === 'thought' 
                        ? 'bg-white border-blue-500 shadow-xl shadow-blue-200 scale-105' 
                        : 'bg-white border-slate-200 hover:border-blue-300'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${activeModule==='thought'?'bg-blue-100 text-blue-600':'bg-slate-100 text-slate-400'}`}>
                        <Lightbulb size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">1. Thought (思考)</div>
                        <div className="text-xs text-slate-500 mt-1">分析意图 · 拆解任务 · 规划路径</div>
                      </div>
                    </div>
                  </div>

                  <div className="h-8 w-0.5 bg-slate-300"></div>

                  {/* Tools & Observe (并列) */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div
                      onClick={() => setActiveModule('tools')}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 
                        ${activeModule === 'tools' 
                          ? 'bg-white border-green-500 shadow-xl shadow-green-200 scale-105' 
                          : 'bg-white border-slate-200 hover:border-green-300'}`}
                    >
                       <div className="mb-3 p-2 w-fit rounded-lg bg-green-100 text-green-600"><Settings size={20}/></div>
                       <div className="font-bold text-sm text-slate-800">2. Action</div>
                       <div className="text-[10px] text-slate-500 mt-1">RAG / Sandbox</div>
                    </div>
                    <div
                      onClick={() => setActiveModule('observe')}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 
                        ${activeModule === 'observe' 
                          ? 'bg-white border-purple-500 shadow-xl shadow-purple-200 scale-105' 
                          : 'bg-white border-slate-200 hover:border-purple-300'}`}
                    >
                       <div className="mb-3 p-2 w-fit rounded-lg bg-purple-100 text-purple-600"><Activity size={20}/></div>
                       <div className="font-bold text-sm text-slate-800">3. Observe</div>
                       <div className="text-[10px] text-slate-500 mt-1">结果解析</div>
                    </div>
                  </div>

                  <div className="h-8 w-0.5 bg-slate-300"></div>

                  {/* Reflection */}
                  <div
                    onClick={() => setActiveModule('reflection')}
                    className={`w-full cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300
                      ${activeModule === 'reflection' 
                        ? 'bg-white border-orange-500 shadow-xl shadow-orange-200 scale-105' 
                        : 'bg-white border-slate-200 hover:border-orange-300'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${activeModule==='reflection'?'bg-orange-100 text-orange-600':'bg-slate-100 text-slate-400'}`}>
                        <MessageSquare size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">4. Reflection (反思)</div>
                        <div className="text-xs text-slate-500 mt-1">质量评估 · 追问生成 · 情感调节</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 详情面板 */}
              <div className="lg:col-span-1">
                <Card className="h-full flex flex-col !p-0 overflow-hidden border-0">
                  <div className="bg-slate-100/50 p-4 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Logs</div>
                  </div>

                  <div className="p-6 flex-1 overflow-y-auto">
                    {activeModule === null ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center opacity-60">
                        <UserCheck size={64} strokeWidth={1} className="mb-4"/>
                        <p className="text-sm">点击左侧模块<br/>查看 AI 实时日志</p>
                      </div>
                    ) : (
                      <div className="animate-fade-in space-y-6">
                        {/* 动态内容渲染 */}
                        {activeModule === 'thought' && (
                          <>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-lg"><Lightbulb size={20}/> Chain of Thought</div>
                            <div className="bg-slate-800 rounded-lg p-4 font-mono text-xs text-green-400 leading-relaxed shadow-inner">
                              <span className="text-slate-500"># Thinking Process</span><br/>
                              &gt; User asks about "Fiber".<br/>
                              &gt; Context: Frontend Interview.<br/>
                              &gt; Plan: <br/>
                              &nbsp;&nbsp;1. Retrieve technical definition.<br/>
                              &nbsp;&nbsp;2. Check key benefits (Time Slicing).<br/>
                              &nbsp;&nbsp;3. Formulate probing question about "Reconciliation".
                            </div>
                          </>
                        )}

                        {activeModule === 'tools' && (
                           <>
                            <div className="flex items-center gap-2 text-green-600 font-bold text-lg"><Settings size={20}/> Tool Execution</div>
                            <div className="space-y-3">
                              <div className="bg-white border border-slate-200 p-3 rounded-lg text-sm shadow-sm">
                                <div className="font-bold text-slate-700 mb-1">VectorDB Search</div>
                                <div className="text-xs text-slate-500">Query: "React Fiber Principle"</div>
                                <div className="mt-2 text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded w-fit">Latency: 24ms</div>
                              </div>
                            </div>
                           </>
                        )}

                        {activeModule === 'observe' && (
                           <>
                            <div className="flex items-center gap-2 text-purple-600 font-bold text-lg"><Activity size={20}/> Observation</div>
                            <p className="text-sm text-slate-600">
                              Agent 观察到检索结果包含大量 "Stack Reconciler" 对比内容，决定在后续对话中引导用户进行对比分析。
                            </p>
                           </>
                        )}

                        {activeModule === 'reflection' && (
                           <>
                            <div className="flex items-center gap-2 text-orange-600 font-bold text-lg"><MessageSquare size={20}/> Self-Reflection</div>
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                              <div className="flex justify-between text-xs font-bold text-orange-800 mb-2">
                                <span>Response Quality</span>
                                <span>8.5/10</span>
                              </div>
                              <div className="w-full bg-orange-200 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-orange-500 h-full w-[85%]"></div>
                              </div>
                              <div className="mt-3 text-xs text-orange-700 leading-snug">
                                评价：当前回答准确，但略显生硬。建议增加语气词 "您觉得呢？" 以增强互动性。
                              </div>
                            </div>
                           </>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: 算法实验室 (重构) */}
        {activeStep === 4 && (
          <div className="animate-fade-in w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-slate-900">RLHF 算法引擎: GSPO</h2>
                  <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-200">Based on Qwen Team Research</div>
                </div>
                <p className="text-slate-500 max-w-2xl">
                  Group Sequence Policy Optimization (GSPO) 是用于大模型 <b>RLHF 微调</b> 的核心算法，解决了传统 PPO 在长文本生成中的不稳定性。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* 左侧：公式推导与创新 */}
              <div className="lg:col-span-7 space-y-6">
                 {/* 核心公式卡片 */}
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-[10px] px-3 py-1 rounded-bl-xl font-mono">Formula 1.0: Objective Function</div>
                    <div className="mb-4 flex items-center gap-2">
                      <Sigma className="text-purple-600"/>
                      <span className="font-bold text-slate-800">目标函数 (Optimization Objective)</span>
                    </div>
                    <div className="overflow-x-auto pb-2">
                       <div className="text-lg text-slate-700 leading-relaxed whitespace-nowrap flex justify-center">
                         <MathJaxFormula formula="J_{GSPO}(\theta) = \mathbb{E} \left[ \frac{1}{G} \sum_{i=1}^G \min \left( s_i \hat{A}_i, \text{clip}(s_i, 1-\epsilon, 1+\epsilon) \hat{A}_i \right) \right]" block />
                       </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-700">解释：</span> 不同于 Token 级别的优化，GSPO 对<b>整个回答序列 (Sequence)</b> 进行采样和评分。$G$ 代表组内样本数（Group Size），通过组内归一化来降低梯度方差。
                    </div>
                 </div>

                 {/* 我们的创新公式 */}
                 <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden border border-indigo-700">
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] px-3 py-1 rounded-bl-xl font-mono font-bold">Our Innovation</div>
                    <div className="mb-4 flex items-center gap-2">
                      <GitBranch className="text-indigo-300"/>
                      <span className="font-bold text-lg">A-GSPO: 自适应群组优势估计</span>
                    </div>

                    <p className="text-xs text-indigo-200 mb-4">
                      针对面试场景的长对话特性，我们在原始 GSPO 优势函数 <MathJaxFormula formula="\hat{A}_i"/> 的基础上，引入了<b>"语义一致性"</b>动态因子。
                    </p>

                    <div className="bg-white/10 p-4 rounded-xl border border-white/10 mb-4 backdrop-blur-sm flex justify-center">
                       <div className="text-lg leading-relaxed text-center">
                         <MathJaxFormula formula="\hat{A}_i^{new} = \frac{R_i - \mu(R_{group})}{\sigma(R_{group})} + \underbrace{\lambda \cdot \mathcal{S}(y_i, \mathcal{C})}_{\text{Context Consistency}}" block />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="font-bold text-indigo-300 mb-1"><MathJaxFormula formula="\mu, \sigma"/> (Group Norm)</div>
                        <div className="opacity-70">组内奖励的均值与方差，用于标准化，这是 GSPO 稳定的关键。</div>
                      </div>
                      <div>
                        <div className="font-bold text-indigo-300 mb-1"><MathJaxFormula formula="\mathcal{S}"/> (Semantic Term)</div>
                        <div className="opacity-70">上下文一致性评分，惩罚模型在多轮追问中出现的逻辑矛盾。</div>
                      </div>
                    </div>
                 </div>
              </div>

              {/* 右侧：训练监控面板 */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <AlgorithmChart epoch={trainStep} />

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                   <div className="flex items-center justify-between">
                     <span className="font-bold text-slate-800 flex items-center gap-2"><Scale size={18}/> 训练控制台</span>
                     <span className={`text-xs px-2 py-0.5 rounded-full ${isTraining ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                       {isTraining ? 'Training Active' : 'Idle'}
                     </span>
                   </div>

                   <div className="flex items-center gap-4">
                      <button
                        onClick={() => { setTrainStep(0); setIsTraining(!isTraining); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${isTraining ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'}`}
                      >
                        {isTraining ? '模型微调中...' : <><Play size={18} fill="currentColor"/> 启动 RLHF 微调</>}
                      </button>
                   </div>

                   <div className="space-y-3 pt-2">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Current Epoch</span>
                        <span className="font-mono">{trainStep} / 20</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-300" style={{width: `${(trainStep/20)*100}%`}}></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                         <div className="text-center p-2 bg-slate-50 rounded-lg">
                           <div className="text-[10px] text-slate-400">Reward Mean</div>
                           <div className="text-xs font-bold text-slate-700">{(0.4 + trainStep * 0.02).toFixed(2)}</div>
                         </div>
                         <div className="text-center p-2 bg-slate-50 rounded-lg">
                           <div className="text-[10px] text-slate-400">KL Div</div>
                           <div className="text-xs font-bold text-slate-700">{(0.1 - trainStep * 0.002).toFixed(3)}</div>
                         </div>
                         <div className="text-center p-2 bg-slate-50 rounded-lg">
                           <div className="text-[10px] text-slate-400">Group Var</div>
                           <div className="text-xs font-bold text-green-600">Low</div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Live Demo (New Enhanced) */}
        {activeStep === 5 && (
           <div className="animate-fade-in w-full">
             <LiveDemo />
           </div>
        )}

        {/* Step 7: 团队介绍 (New) */}
        {activeStep === 6 && (
           <div className="animate-fade-in w-full">
             <TeamPage />
           </div>
        )}

        {/* Step 8: 战略与总结 */}
        {activeStep === 7 && (
           <div className="animate-fade-in w-full text-center">
             <h2 className="text-4xl font-bold text-slate-900 mb-16">未来战略路线图</h2>

             <div className="relative max-w-5xl mx-auto mb-20">
               <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-100 rounded-full -z-10 transform -translate-y-1/2"></div>

               <div className="grid grid-cols-4 gap-4">
                  {[
                    { phase: "Phase 1", time: "0-6月", title: "原型验证", desc: "核心算法跑通 & 内测", color: "bg-blue-600" },
                    { phase: "Phase 2", time: "6-12月", title: "SaaS 上线", desc: "API 体系 & 商业闭环", color: "bg-indigo-600" },
                    { phase: "Phase 3", time: "12-18月", title: "规模扩张", desc: "多行业 & 多语言适配", color: "bg-purple-600" },
                    { phase: "Phase 4", time: "18-24月", title: "行业生态", desc: "制定 AI 面试行业标准", color: "bg-fuchsia-600" },
                  ].map((item, i) => (
                    <div key={i} className="relative group">
                      <div className={`w-4 h-4 rounded-full border-4 border-white ${item.color} mx-auto mb-6 shadow-sm z-10 relative`}></div>
                      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 group-hover:-translate-y-2 transition-transform duration-300">
                        <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold text-white mb-3 ${item.color}`}>
                          {item.phase}
                        </div>
                        <div className="font-bold text-lg text-slate-800 mb-1">{item.title}</div>
                        <div className="text-xs font-bold text-slate-400 mb-3">{item.time}</div>
                        <div className="text-sm text-slate-600 leading-snug opacity-80">{item.desc}</div>
                      </div>
                    </div>
                  ))}
               </div>
             </div>

             <div className="relative overflow-hidden p-10 bg-slate-900 rounded-3xl text-white shadow-2xl mx-auto max-w-4xl group">
               <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 z-0"></div>
               <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
               <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>

               <div className="relative z-10">
                 <h3 className="text-3xl font-bold mb-4">准备好重塑招聘体验了吗？</h3>
                 <p className="mb-8 text-slate-300 max-w-xl mx-auto">
                   这不仅仅是一个工具，而是连接人才与机会的智能桥梁。
                 </p>
                 <button className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-blue-50 hover:scale-105 transition-all shadow-lg">
                   联系团队获取 Demo
                 </button>
               </div>
             </div>
           </div>
        )}

      </main>

      {/* 底部导航控制 */}
      <footer className="fixed bottom-0 w-full bg-white/80 backdrop-blur-lg border-t border-slate-200 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={activeStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 font-medium transition-colors"
          >
            <ChevronLeft size={20} /> <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex gap-2">
             {steps.map((_, i) => (
               <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeStep ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300'}`}></div>
             ))}
          </div>

          <button
            onClick={nextStep}
            disabled={activeStep === steps.length - 1}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-slate-900/20 active:scale-95"
          >
            <span className="hidden sm:inline">Next Step</span> <ChevronRight size={18} />
          </button>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotateY(10deg); } 50% { transform: translateY(-15px) rotateY(10deg); } }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.4; } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default App;
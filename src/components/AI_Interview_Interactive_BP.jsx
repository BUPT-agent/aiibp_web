import React, { useState, useEffect } from 'react';
import {
  ChevronRight, ChevronLeft, Play, Users,
  TrendingUp, Database, Brain, Cpu, Target,
  Activity, Zap, Layers, MessageSquare,
  Settings, Lightbulb, UserCheck
} from 'lucide-react';

// -------------------
// 核心数据与常量配置
// -------------------
const TOTAL_EMPLOYMENT = 734000000; // 7.34亿就业人口
const GRADUATES_2025 = 12220000;   // 1222万毕业生
const UNIT_PRICE = 100;            // 单价 100元

// -------------------
// 子组件：GSPO 算法动态演示图表
// -------------------
const AlgorithmChart = ({ epoch }) => {
  // 模拟 GSPO vs PPO 的收敛数据
  const generateData = (steps) => {
    const ppo = [];
    const gspo = [];
    for (let i = 0; i <= 20; i++) {
      // PPO: 震荡较大，收敛慢
      const noise = Math.random() * 30 * (1 - i/20);
      const ppoVal = 100 - (i * 3) + noise;
      // GSPO: 平滑，收敛快
      const gspoVal = 100 - (i * 4.5) - (i > 5 ? 10 : 0);

      ppo.push(Math.max(10, ppoVal));
      gspo.push(Math.max(5, gspoVal));
    }
    return { ppo, gspo };
  };

  const data = generateData(20);
  const currentPPO = data.ppo.slice(0, epoch);
  const currentGSPO = data.gspo.slice(0, epoch);

  // SVG 绘图参数
  const width = 500;
  const height = 250;
  const padding = 30;
  const xScale = (width - padding * 2) / 20;
  const yScale = (height - padding * 2) / 100;

  const makePath = (arr, color) => {
    if (arr.length === 0) return "";
    let d = `M ${padding} ${height - padding - arr[0] * yScale}`;
    arr.forEach((val, i) => {
      d += ` L ${padding + i * xScale} ${height - padding - val * yScale}`;
    });
    return d;
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-inner">
      <div className="flex justify-between mb-2 text-xs text-slate-400">
        <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div> 传统 PPO (高方差/震荡)</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div> GSPO (群组优化/稳定)</div>
      </div>
      <svg width="100%" height="250" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* 坐标轴 */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#475569" strokeWidth="2" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#475569" strokeWidth="2" />
        <text x={width/2} y={height} fill="#94a3b8" fontSize="10" textAnchor="middle">训练轮次 (Epochs)</text>
        <text x="0" y={height/2} fill="#94a3b8" fontSize="10" transform={`rotate(-90, 10, ${height/2})`}>Loss / 不稳定性</text>

        {/* 曲线 */}
        <path d={makePath(currentPPO)} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" className="transition-all duration-300" />
        <path d={makePath(currentGSPO)} fill="none" stroke="#3b82f6" strokeWidth="3" className="transition-all duration-300" />

        {/* 动态点 */}
        {currentPPO.length > 0 && (
          <circle cx={padding + (currentPPO.length - 1) * xScale} cy={height - padding - currentPPO[currentPPO.length - 1] * yScale} r="4" fill="#ef4444" />
        )}
        {currentGSPO.length > 0 && (
          <circle cx={padding + (currentGSPO.length - 1) * xScale} cy={height - padding - currentGSPO[currentGSPO.length - 1] * yScale} r="4" fill="#3b82f6" />
        )}
      </svg>
    </div>
  );
};

// -------------------
// 主组件
// -------------------
const App = () => {
  const [activeStep, setActiveStep] = useState(0);

  // 市场推演状态
  const [marketRate, setMarketRate] = useState(0.001); // 0.001%
  const [revenue, setRevenue] = useState(0);

  // 算法演示状态
  const [trainStep, setTrainStep] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  // 认知框架交互状态
  const [activeModule, setActiveModule] = useState(null);

  // 计算营收
  useEffect(() => {
    // 基础营收 = 就业人口 * 渗透率 * 单价
    const val = (TOTAL_EMPLOYMENT * (marketRate / 100) * UNIT_PRICE).toFixed(0);
    setRevenue(val);
  }, [marketRate]);

  // 训练动画循环
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
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isTraining]);

  const steps = [
    { id: 'intro', title: '项目愿景' },
    { id: 'market', title: '市场推演' },
    { id: 'data', title: '数据引擎' },
    { id: 'framework', title: '认知架构' },
    { id: 'algorithm', title: 'GSPO算法' },
    { id: 'summary', title: '战略规划' }
  ];

  const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  // -------------------
  // 页面渲染逻辑
  // -------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800 font-sans selection:bg-blue-200">

      {/* 顶部导航 */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">AI</div>
          <span className="font-bold text-lg tracking-tight text-slate-800">智能面试系统 <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Interactive BP</span></span>
        </div>
        <div className="flex gap-1">
          {steps.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => setActiveStep(idx)}
              className={`h-2 w-8 rounded-full cursor-pointer transition-all duration-300 ${idx === activeStep ? 'bg-blue-600 w-12' : 'bg-slate-200 hover:bg-slate-300'}`}
              title={s.title}
            />
          ))}
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="pt-24 pb-20 max-w-6xl mx-auto px-4 min-h-[800px] flex flex-col justify-center">

        {/* Step 1: 封面/愿景 */}
        {activeStep === 0 && (
          <div className="flex flex-col md:flex-row items-center gap-12 animate-fade-in">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-2">
                2025 北邮创新创业项目
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                不仅仅是模拟，<br/>更是<span className="text-blue-600">认知的镜像</span>。
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                基于强化学习 (GSPO) 与真实数据驱动的下一代招聘与求职解决方案。
                打破"死板题库"，构建拥有"灵魂"的 AI 面试官。
              </p>
              <div className="flex gap-4 pt-4">
                <button onClick={nextStep} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2">
                  开始演示 <ChevronRight size={20} />
                </button>
                <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-center">
                    <div className="text-sm text-slate-500">负责人</div>
                    <div className="font-bold">高尔濂</div>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="text-center">
                    <div className="text-sm text-slate-500">指导老师</div>
                    <div className="font-bold">陈星延 副教授</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 flex flex-col items-center justify-center gap-6 transform rotate-3 hover:rotate-0 transition-all duration-500">
                  <Brain size={80} className="text-blue-600" />
                  <div className="space-y-2 text-center w-full">
                    <div className="h-2 bg-slate-100 rounded w-3/4 mx-auto animate-pulse"></div>
                    <div className="h-2 bg-slate-100 rounded w-1/2 mx-auto animate-pulse"></div>
                    <div className="h-2 bg-slate-100 rounded w-5/6 mx-auto animate-pulse"></div>
                  </div>
                  <div className="absolute -right-6 -bottom-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <Zap size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">面试真实度</div>
                      <div className="font-bold text-green-600">98.5%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: 市场动态推演 */}
        {activeStep === 1 && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">万亿级市场的微观推演</h2>
              <p className="text-slate-500">拖动滑块，查看不同市场渗透率下的商业潜力</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 控制面板 */}
              <div className="md:col-span-1 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                <div className="flex items-center gap-2 mb-6 text-blue-600">
                  <Settings size={20} />
                  <h3 className="font-bold text-lg">推演参数设置</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                      <span>市场渗透率</span>
                      <span className="text-blue-600 font-bold">{marketRate}%</span>
                    </label>
                    <input
                      type="range"
                      min="0.001"
                      max="1.0"
                      step="0.001"
                      value={marketRate}
                      onChange={(e) => setMarketRate(e.target.value)}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>0.001% (保守)</span>
                      <span>1.0% (乐观)</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">就业人口基数</span>
                      <span className="font-medium">7.34 亿</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">年离职/求职人数</span>
                      <span className="font-medium">~1.29 亿</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">客单价 (年)</span>
                      <span className="font-medium">¥ 100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 结果展示 */}
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-xl transform transition-all hover:scale-105">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                      <Activity size={18} />
                      <span className="text-sm font-medium">预计用户规模</span>
                    </div>
                    <div className="text-4xl font-bold tracking-tight">
                      {Math.floor(TOTAL_EMPLOYMENT * (marketRate / 100)).toLocaleString()} <span className="text-lg font-normal opacity-80">人</span>
                    </div>
                    <div className="mt-4 text-sm bg-white/20 inline-block px-3 py-1 rounded-full">
                      覆盖 2025 高校毕业生 {((TOTAL_EMPLOYMENT * (marketRate / 100) / GRADUATES_2025) * 100).toFixed(2)}%
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col justify-center transform transition-all hover:scale-105">
                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                      <TrendingUp size={18} />
                      <span className="text-sm font-medium">预计年度营收</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 tracking-tight">
                      ¥ {parseInt(revenue).toLocaleString()}
                    </div>
                    <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                      <TrendingUp size={14} /> 增长潜力巨大
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-purple-500"/> 用户痛点分布
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>HR：工作过载与筛选压力</span>
                        <span className="text-red-500 font-bold">41%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[41%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>求职者：缺乏真实反馈与指导</span>
                        <span className="text-orange-500 font-bold">85%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-[85%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 数据引擎 */}
        {activeStep === 2 && (
          <div className="flex flex-col items-center animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">数据引擎：真实世界的映射</h2>
            <p className="text-slate-500 mb-12">从社交媒体到强化学习，构建数据的闭环</p>

            <div className="relative w-full max-w-4xl">
              {/* 连接线 */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 transform -translate-y-1/2"></div>

              <div className="grid grid-cols-3 gap-8">
                {/* 节点 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center relative group hover:-translate-y-2 transition-transform">
                  <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                    <Database />
                  </div>
                  <h3 className="font-bold text-lg mb-2">多源数据采集</h3>
                  <p className="text-xs text-slate-500 mb-2">Bilibili / 小红书 / 真实面试录音</p>
                  <div className="text-xs bg-pink-50 text-pink-600 py-1 px-2 rounded">
                    非结构化数据清洗
                  </div>
                </div>

                {/* 节点 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center relative group hover:-translate-y-2 transition-transform">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                    核心技术
                  </div>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                    <Cpu />
                  </div>
                  <h3 className="font-bold text-lg mb-2">自蒸馏 (Self-Distillation)</h3>
                  <p className="text-xs text-slate-500 mb-2">Teacher 模型 -&gt; Student 模型</p>
                  <div className="text-xs bg-blue-50 text-blue-600 py-1 px-2 rounded">
                    百万级合成数据生成
                  </div>
                </div>

                {/* 节点 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center relative group hover:-translate-y-2 transition-transform">
                  <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                    <Target />
                  </div>
                  <h3 className="font-bold text-lg mb-2">GSPO 策略优化</h3>
                  <p className="text-xs text-slate-500 mb-2">对抗博弈与群组序列优化</p>
                  <div className="text-xs bg-purple-50 text-purple-600 py-1 px-2 rounded">
                    高拟真面试官 Agent
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: 认知架构 (核心交互) */}
        {activeStep === 3 && (
          <div className="animate-fade-in w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">ReAct 认知架构与自我反思</h2>
              <p className="text-slate-500">点击下方模块，查看 AI 内部的思考回路</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 架构可视化区 */}
              <div className="lg:col-span-2 bg-slate-50 p-8 rounded-3xl border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Brain size={200} />
                </div>

                {/* 流程图 */}
                <div className="relative z-10 flex flex-col items-center gap-6">
                  {/* 输入 */}
                  <div className="px-6 py-2 bg-slate-200 rounded-full text-slate-600 text-sm font-bold">
                    User Input: "请问 React 的 Fiber 架构是什么？"
                  </div>
                  <div className="h-6 w-0.5 bg-slate-300"></div>

                  {/* 核心循环 */}
                  <div className="border-2 border-dashed border-blue-300 rounded-3xl p-6 bg-white/50 w-full max-w-md relative">
                    <div className="absolute -top-3 left-6 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 font-bold rounded">
                      Reasoning Loop
                    </div>

                    {/* Thought */}
                    <div
                      onClick={() => setActiveModule('thought')}
                      className={`cursor-pointer p-4 rounded-xl border mb-4 transition-all ${activeModule === 'thought' ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' : 'bg-white border-slate-200 hover:border-blue-400'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Lightbulb size={20} />
                        <div>
                          <div className="font-bold text-sm">Thought (思考)</div>
                          <div className="text-xs opacity-80">分析意图，检索 Memory</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mb-4 text-slate-400"><ChevronRight className="rotate-90"/></div>

                    {/* Action & Tools */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div
                        onClick={() => setActiveModule('tools')}
                        className={`cursor-pointer p-3 rounded-xl border transition-all ${activeModule === 'tools' ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105' : 'bg-white border-slate-200 hover:border-green-400'}`}
                      >
                         <div className="font-bold text-sm mb-1 flex items-center gap-2"><Settings size={14}/> Tools</div>
                         <div className="text-[10px] opacity-80">RAG / MCP Code</div>
                      </div>
                      <div
                        onClick={() => setActiveModule('observe')}
                        className={`cursor-pointer p-3 rounded-xl border transition-all ${activeModule === 'observe' ? 'bg-purple-600 text-white border-purple-600 shadow-lg scale-105' : 'bg-white border-slate-200 hover:border-purple-400'}`}
                      >
                         <div className="font-bold text-sm mb-1 flex items-center gap-2"><Activity size={14}/> Observe</div>
                         <div className="text-[10px] opacity-80">工具执行结果反馈</div>
                      </div>
                    </div>

                    <div className="flex justify-center mb-4 text-slate-400"><ChevronRight className="rotate-90"/></div>

                    {/* Reflection */}
                    <div
                      onClick={() => setActiveModule('reflection')}
                      className={`cursor-pointer p-4 rounded-xl border transition-all ${activeModule === 'reflection' ? 'bg-orange-500 text-white border-orange-500 shadow-lg scale-105' : 'bg-white border-slate-200 hover:border-orange-400'}`}
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare size={20} />
                        <div>
                          <div className="font-bold text-sm">Reflection (反思)</div>
                          <div className="text-xs opacity-80">评估当前回答是否完整，是否需要追问</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-6 w-0.5 bg-slate-300"></div>

                  {/* 输出 */}
                  <div className="px-6 py-2 bg-slate-800 text-white rounded-full text-sm font-bold shadow-lg">
                    Final Response: "Fiber 是 React 16 引入的..." + 追问
                  </div>
                </div>
              </div>

              {/* 详情面板 */}
              <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Module Detail</div>

                {activeModule === null && (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
                    <UserCheck size={48} className="mb-4 opacity-20"/>
                    <p>请点击左侧流程图中的模块<br/>查看具体技术实现</p>
                  </div>
                )}

                {activeModule === 'thought' && (
                  <div className="animate-fade-in">
                    <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2"><Lightbulb/> 思考链 (CoT)</h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      系统不直接生成答案，而是先生成"思考过程"。
                      <br/><br/>
                      <code className="bg-slate-100 p-2 rounded block text-xs">
                        Thinking: 用户问的是 Fiber 架构，这属于 React 核心原理。我需要确认这是否是高级岗位面试。需要调用知识库确认 Fiber 的关键特性：可中断渲染、优先级调度。
                      </code>
                    </p>
                    <div className="text-xs font-bold text-slate-500">技术栈: LangChain / Prompt Engineering</div>
                  </div>
                )}

                {activeModule === 'tools' && (
                  <div className="animate-fade-in">
                    <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2"><Settings/> 工具调用 (MCP)</h3>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex gap-2">
                        <div className="mt-1 min-w-[16px]"><Database size={16} className="text-green-500"/></div>
                        <div>
                          <strong>RAG 向量库:</strong> 检索企业内部面试题库、技术文档。
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <div className="mt-1 min-w-[16px]"><Layers size={16} className="text-green-500"/></div>
                        <div>
                          <strong>A2A 编程环境:</strong> 实时运行 Python/JS 代码，验证候选人代码的正确性。
                        </div>
                      </li>
                    </ul>
                  </div>
                )}

                {activeModule === 'reflection' && (
                  <div className="animate-fade-in">
                    <h3 className="text-xl font-bold text-orange-500 mb-4 flex items-center gap-2"><MessageSquare/> 自我反思</h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      这是区别于普通 ChatBot 的核心。
                      <br/><br/>
                      Agent 会"自我评价"生成的追问是否过于简单或偏离主题。如果评分过低，它会重新生成策略。
                    </p>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                      <div className="text-xs font-bold text-orange-700 mb-1">Reward Model:</div>
                      <div className="text-xs text-orange-600">基于 GSPO 训练的奖励模型，用于评估对话质量。</div>
                    </div>
                  </div>
                )}
                 {activeModule === 'observe' && (
                  <div className="animate-fade-in">
                    <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2"><Activity/> 观察与解析</h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      解析工具调用的返回结果，并将其转化为上下文信息。
                      <br/><br/>
                      例如：代码运行报错 <code>RuntimeError</code>，观察模块会捕捉此错误，并指示"思考模块"针对错误进行追问，考察候选人的调试能力。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: 算法实验室 (GSPO) */}
        {activeStep === 4 && (
          <div className="animate-fade-in w-full">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">GSPO 算法实验室</h2>
                <p className="text-slate-500">Group Sequence Policy Optimization：解决长对话"崩塌"难题</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm">
                <span className="font-bold text-slate-700">公式核心：</span>
                <span className="font-serif italic text-blue-600 ml-2">J(θ) = E [ min(r_t(θ)A_t, clip(...)A_t) - β * GroupNorm ]</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                 <AlgorithmChart epoch={trainStep} />

                 <div className="mt-6 flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                    <button
                      onClick={() => { setTrainStep(0); setIsTraining(!isTraining); }}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${isTraining ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {isTraining ? '训练中...' : <><Play size={18}/> 开始训练模拟</>}
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Current Epoch: {trainStep}</span>
                        <span>Max: 20</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-300" style={{width: `${(trainStep/20)*100}%`}}></div>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="md:col-span-1 space-y-4">
                <div className="bg-white p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-2">1. 序列级优化</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    不同于传统单步优化，GSPO 针对<b>整个对话序列</b>进行评分，确保面试逻辑连贯，避免"前言不搭后语"。
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border-l-4 border-purple-500 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-2">2. 群组归一化</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    对同一 Prompt 生成的多个回答进行<b>分组 (Grouping)</b>，在组内进行优势函数 (Advantage) 归一化，大幅降低方差。
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border-l-4 border-green-500 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-2">3. 训练稳定性</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    如左图所示，GSPO (蓝线) 收敛速度比 PPO 快约 30%，且 Loss 曲线更平滑，无剧烈震荡。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: 战略与总结 */}
        {activeStep === 5 && (
           <div className="animate-fade-in w-full text-center">
             <h2 className="text-3xl font-bold text-slate-900 mb-12">未来战略路线图</h2>

             <div className="relative max-w-4xl mx-auto">
               <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 transform -translate-y-1/2"></div>

               <div className="grid grid-cols-4 gap-4">
                  {[
                    { phase: "Phase 1", time: "0-6月", title: "原型验证", desc: "算法研发 & 内测", color: "bg-blue-600" },
                    { phase: "Phase 2", time: "6-12月", title: "SaaS 上线", desc: "API 体系 & 商业闭环", color: "bg-green-600" },
                    { phase: "Phase 3", time: "12-18月", title: "规模扩张", desc: "多行业 & 多语言", color: "bg-purple-600" },
                    { phase: "Phase 4", time: "18-24月", title: "生态构建", desc: "行业标准制定", color: "bg-orange-600" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 relative group hover:-translate-y-2 transition-transform">
                      <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${item.color} text-white text-xs px-3 py-1 rounded-full font-bold shadow-md`}>
                        {item.phase}
                      </div>
                      <div className="mt-4 font-bold text-lg text-slate-800">{item.title}</div>
                      <div className="text-xs font-bold text-slate-400 mb-2">{item.time}</div>
                      <div className="text-sm text-slate-600">{item.desc}</div>
                    </div>
                  ))}
               </div>
             </div>

             <div className="mt-16 p-8 bg-blue-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold mb-4">准备好体验下一代招聘了吗？</h3>
                 <p className="mb-6 opacity-80 max-w-2xl mx-auto">
                   我们不仅仅是在做一个工具，我们正在重塑人与职业机会连接的方式。
                   基于 GSPO 算法与深度认知架构，让每一次面试都成为成长的契机。
                 </p>
                 <button className="px-8 py-3 bg-white text-blue-900 rounded-full font-bold hover:bg-blue-50 transition-colors">
                   联系团队获取 Demo
                 </button>
               </div>
               {/* 装饰圆圈 */}
               <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
             </div>
           </div>
        )}

      </main>

      {/* 底部控制栏 */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-4 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={activeStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-colors"
          >
            <ChevronLeft size={20} /> 上一步
          </button>

          <div className="text-sm text-slate-400 font-medium">
             Page {activeStep + 1} of {steps.length}
          </div>

          <button
            onClick={nextStep}
            disabled={activeStep === steps.length - 1}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
          >
            下一步 <ChevronRight size={20} />
          </button>
        </div>
      </footer>

      {/* 简单的 CSS 动画注入 */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 3s infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
      `}</style>
    </div>
  );
};

export default App;
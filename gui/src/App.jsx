import React, { useState, useEffect, useRef } from 'react';
import { Play, Settings, Terminal, Shield, Cpu, Monitor, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!window.electronAPI) {
      console.error('Electron API not found!');
      setLogs(['ERROR: Dashboard system failed to connect to the host. Please restart the application.']);
      return;
    }

    window.electronAPI.onScriptOutput((data) => {
      setLogs((prev) => [...prev, data]);
    });

    window.electronAPI.onScriptFinished(() => {
      setIsRunning(false);
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const runScript = (name) => {
    setIsRunning(true);
    setLogs((prev) => [...prev, `\n> Starting ${name}...\n`]);
    window.electronAPI.runScript(name);
  };

  const clearLogs = () => setLogs([]);

  const EmulatorCard = ({ title, type, script, launch, icon: Icon, color }) => (
    <div className="glass glass-hover p-6 rounded-2xl flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-${color}/20 text-${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-slate-400">{type}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <button
          onClick={() => runScript(script)}
          disabled={isRunning}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-brand-accent/20 hover:bg-brand-accent/40 text-brand-accent transition-colors disabled:opacity-50 no-drag"
        >
          <Settings size={18} />
          <span>Setup</span>
        </button>
        <button
          onClick={() => runScript(launch)}
          disabled={isRunning}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-brand-success/20 hover:bg-brand-success/40 text-brand-success transition-colors disabled:opacity-50 no-drag"
        >
          <Play size={18} />
          <span>Launch</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col select-none">
      {/* Title Bar Area */}
      <div className="h-10 bg-brand-dark/50 drag-region flex items-center px-4">
        <span className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Samsung S25 Ultra Manager</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-20 glass border-y-0 border-l-0 border-r flex flex-col items-center py-8 gap-8">
          <div className="p-3 bg-brand-accent rounded-xl text-white shadow-lg shadow-brand-accent/20">
            <Shield size={24} />
          </div>
          <div className="flex flex-col gap-6 mt-4">
            <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'text-brand-accent bg-brand-accent/10' : 'text-slate-400 hover:text-white'}`}>
              <Monitor size={24} />
            </button>
            <button onClick={() => setActiveTab('logs')} className={`p-2 rounded-lg transition-colors ${activeTab === 'logs' ? 'text-brand-accent bg-brand-accent/10' : 'text-slate-400 hover:text-white'}`}>
              <Terminal size={24} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
                    Device Control Center
                  </h1>
                  <p className="text-slate-400 mt-2">Manage your S25 Ultra virtual environments</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EmulatorCard
                    title="Standard Edition"
                    type="x86_64 Architecture"
                    script="setup_s25_ultra.ps1"
                    launch="launch_s25_ultra.bat"
                    icon={Monitor}
                    color="accent"
                  />
                  <EmulatorCard
                    title="Native ARM64"
                    type="AArch64 (Legacy/Comp)"
                    script="setup_s25_ultra_arm.ps1"
                    launch="launch_s25_ultra_arm.bat"
                    icon={Cpu}
                    color="warning"
                  />
                </div>

                {/* Quick Status */}
                <div className="glass p-6 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${isRunning ? 'bg-brand-success animate-pulse' : 'bg-slate-600'}`} />
                    <span className="font-medium">{isRunning ? 'Execution in progress...' : 'System Ready'}</span>
                  </div>
                  {isRunning && (
                    <div className="flex items-center gap-2 text-brand-accent text-sm">
                      <Loader2 size={16} className="animate-spin" />
                      View detailed logs below
                    </div>
                  )}
                </div>

                {/* Mini Log Console */}
                <div className="glass rounded-2xl overflow-hidden flex flex-col h-48">
                  <div className="bg-slate-900/50 px-4 py-2 flex justify-between items-center border-b border-white/5">
                    <span className="text-xs font-mono text-slate-500 uppercase">Live Output</span>
                    <button onClick={clearLogs} className="text-[10px] text-slate-500 hover:text-white transition-colors">CLEAR</button>
                  </div>
                  <div ref={scrollRef} className="flex-1 p-4 font-mono text-xs text-brand-success/80 overflow-y-auto custom-scrollbar">
                    {logs.length === 0 ? '> Waiting for command...' : logs.map((log, i) => (
                      <div key={i} className="whitespace-pre-wrap mb-1">{log}</div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col"
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-bold">Terminal History</h1>
                  <p className="text-slate-400 text-sm">Full execution logs and telemetry</p>
                </div>
                <div ref={scrollRef} className="flex-1 glass bg-black/40 p-6 rounded-2xl font-mono text-sm text-brand-success/90 overflow-y-auto custom-scrollbar border-white/5">
                  {logs.map((log, i) => (
                    <div key={i} className="mb-1 leading-relaxed">{log}</div>
                  ))}
                  {isRunning && (
                    <div className="flex items-center gap-2 mt-2 text-brand-accent">
                      <Loader2 size={14} className="animate-spin" />
                      <span>Processing...</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={clearLogs} className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                    Clear History
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default App;

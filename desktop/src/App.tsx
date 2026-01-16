import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

// Icons (Using SVGs directly for now to avoid extra deps, similar to SF Symbols)
const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const InboxIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
);
const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
);
const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);

function App() {
  const [safeTaskResult, setSafeTaskResult] = useState("");
  const [selectedMail, setSelectedMail] = useState<number | null>(null);

  // Mock Data
  const emails = [
    { id: 1, sender: "Apple", subject: "Your Receipt", preview: "Thank you for your purchase...", time: "10:30 AM" },
    { id: 2, sender: "GitHub", subject: "[GitHub] Security Alert", preview: "We noticed a new login...", time: "Yesterday" },
    { id: 3, sender: "Mom", subject: "Dinner?", preview: "Are you coming over this weekend?", time: "Friday" },
  ];

  async function runSafeTask() {
    try {
        setSafeTaskResult("Running safe task...");
        const res = await invoke("run_core_task") as string;
        setSafeTaskResult(res);
    } catch (e) {
        setSafeTaskResult(`Error: ${e}`);
    }
  }

  return (
    <div className="flex h-screen w-full bg-system-background text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      
      {/* Sidebar (Navigation) */}
      <div className="w-64 bg-system-groupedBackground border-r border-system-separator pt-10 px-2 flex flex-col backdrop-blur-xl bg-opacity-80">
        <div className="px-3 mb-6">
             <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <MailIcon /> Mail
             </h1>
        </div>
        
        <nav className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium bg-system-blue text-white rounded-md">
            <InboxIcon /> Inbox
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors">
            <SendIcon /> Sent
          </button>
        </nav>

        <div className="mt-auto mb-4 px-3">
             <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Security Core</h3>
                <button 
                    onClick={runSafeTask}
                    className="w-full flex items-center justify-center gap-2 text-xs bg-green-500 hover:bg-green-600 text-white py-1.5 rounded transition"
                >
                    <ShieldIcon /> Run Safe Task
                </button>
                {safeTaskResult && <p className="mt-2 text-[10px] text-gray-600 dark:text-gray-400 truncate" title={safeTaskResult}>{safeTaskResult}</p>}
             </div>
        </div>
      </div>

      {/* Email List */}
      <div className="w-80 border-r border-system-separator bg-white dark:bg-black overflow-y-auto">
        <div className="p-3 border-b border-system-separator sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10">
             <h2 className="text-lg font-bold">Inbox</h2>
             <input type="text" placeholder="Search" className="mt-2 w-full bg-system-groupedBackground px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue/50" />
        </div>
        <ul>
            {emails.map(email => (
                <li 
                    key={email.id} 
                    onClick={() => setSelectedMail(email.id)}
                    className={`p-4 border-b border-system-separator cursor-pointer transition-colors ${selectedMail === email.id ? 'bg-system-blue text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                >
                    <div className="flex justify-between items-baseline mb-1">
                        <span className={`font-semibold text-sm ${selectedMail === email.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{email.sender}</span>
                        <span className={`text-xs ${selectedMail === email.id ? 'text-blue-100' : 'text-gray-500'}`}>{email.time}</span>
                    </div>
                    <div className={`text-sm font-medium mb-0.5 ${selectedMail === email.id ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>{email.subject}</div>
                    <div className={`text-xs truncate ${selectedMail === email.id ? 'text-blue-100' : 'text-gray-500'}`}>{email.preview}</div>
                </li>
            ))}
        </ul>
      </div>

      {/* Email Content (Detail View) */}
      <div className="flex-1 bg-white dark:bg-black flex flex-col">
        {selectedMail ? (
            <div className="p-8">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{emails.find(e => e.id === selectedMail)?.subject}</h1>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">
                                {emails.find(e => e.id === selectedMail)?.sender[0]}
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold">{emails.find(e => e.id === selectedMail)?.sender}</span>
                                <span className="text-gray-500 ml-2">&lt;sender@example.com&gt;</span>
                            </div>
                        </div>
                    </div>
                    <span className="text-sm text-gray-500">{emails.find(e => e.id === selectedMail)?.time}</span>
                 </div>
                 <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-300">
                    <p>Hello,</p>
                    <p>{emails.find(e => e.id === selectedMail)?.preview}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <p>Best regards,<br/>{emails.find(e => e.id === selectedMail)?.sender}</p>
                 </div>
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <MailIcon />
                <p className="mt-2">No Message Selected</p>
            </div>
        )}
      </div>

    </div>
  );
}

export default App;
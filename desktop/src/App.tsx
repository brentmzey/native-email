import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

interface Email {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  date: string;
}

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
const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
);
const ComposeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
);
const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg className="w-4 h-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
);
const ReplyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

// Generate consistent avatar colors based on name
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500',
    'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-indigo-500'
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

function App() {
  const [safeTaskResult, setSafeTaskResult] = useState("");
  const [selectedMail, setSelectedMail] = useState<number | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [starred, setStarred] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      const items = await invoke("get_inbox") as Email[];
      setEmails(items);
      if (items.length > 0 && !selectedMail) {
        setSelectedMail(items[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  async function runSafeTask() {
    try {
        setSafeTaskResult("Running safe task...");
        const res = await invoke("run_core_task") as string;
        setSafeTaskResult(res);
    } catch (e) {
        setSafeTaskResult(`Error: ${e}`);
    }
  }

  const selectedEmail = emails.find(e => e.id === selectedMail);

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      
      {/* Sidebar (Navigation) */}
      <div className="w-72 bg-white/60 dark:bg-gray-900/60 border-r border-gray-200/50 dark:border-gray-800/50 pt-6 px-4 flex flex-col backdrop-blur-2xl shadow-xl">
        <div className="px-2 mb-8">
             <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <MailIcon />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mail
                </h1>
             </div>
             <p className="text-xs text-gray-500 dark:text-gray-400 pl-[52px]">{emails.length} messages</p>
        </div>
        
        <button 
          onClick={loadEmails}
          className="mb-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        >
          <ComposeIcon /> Compose
        </button>

        <nav className="space-y-1 mb-6">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl transition-all duration-200 shadow-sm">
            <InboxIcon /> 
            <span>Inbox</span>
            <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">{emails.length}</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200">
            <SendIcon /> 
            <span>Sent</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200">
            <StarIcon /> 
            <span>Starred</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200">
            <TrashIcon /> 
            <span>Trash</span>
          </button>
        </nav>

        <div className="mt-auto mb-4">
             <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shadow-md">
                    <ShieldIcon />
                  </div>
                  <h3 className="text-xs font-bold text-green-800 dark:text-green-200">Security Core</h3>
                </div>
                <button 
                    onClick={runSafeTask}
                    className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                    Run Safe Task
                </button>
                {safeTaskResult && (
                  <p className="mt-2 text-[10px] text-green-700 dark:text-green-300 truncate font-medium" title={safeTaskResult}>
                    {safeTaskResult}
                  </p>
                )}
             </div>
        </div>
      </div>

      {/* Email List */}
      <div className="w-96 border-r border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl overflow-y-auto">
        <div className="p-5 border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl z-10 shadow-sm">
             <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Inbox</h2>
                <button 
                  onClick={loadEmails}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshIcon />
                </button>
             </div>
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="Search messages..." 
                 className="w-full bg-gray-100/80 dark:bg-gray-800/80 px-4 py-2.5 pl-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-sm" 
               />
               <svg className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
             </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
              {emails.map(email => {
                const isSelected = selectedMail === email.id;
                const isStarred = starred.has(email.id);
                return (
                  <li 
                      key={email.id} 
                      onClick={() => setSelectedMail(email.id)}
                      className={`p-5 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-l-4 border-blue-500' 
                          : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/30 border-l-4 border-transparent'
                      }`}
                  >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full ${getAvatarColor(email.sender)} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
                          {email.sender[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                              <span className={`font-semibold text-sm truncate ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                                {email.sender}
                              </span>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setStarred(prev => {
                                      const next = new Set(prev);
                                      if (next.has(email.id)) next.delete(email.id);
                                      else next.add(email.id);
                                      return next;
                                    });
                                  }}
                                  className="hover:scale-110 transition-transform"
                                >
                                  <StarIcon filled={isStarred} />
                                </button>
                                <span className={`text-xs font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                                  {email.date}
                                </span>
                              </div>
                          </div>
                          <div className={`text-sm font-semibold mb-1 truncate ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                            {email.subject}
                          </div>
                          <div className={`text-xs truncate ${isSelected ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500'}`}>
                            {email.preview}
                          </div>
                        </div>
                      </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>

      {/* Email Content (Detail View) */}
      <div className="flex-1 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl flex flex-col">
        {selectedEmail ? (
            <div className="flex-1 flex flex-col">
                 {/* Email Header */}
                 <div className="border-b border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                          <div className={`w-14 h-14 rounded-2xl ${getAvatarColor(selectedEmail.sender)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                              {selectedEmail.sender[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-1">
                                <h2 className="font-bold text-lg text-gray-900 dark:text-white">{selectedEmail.sender}</h2>
                                <span className="text-sm text-gray-500 dark:text-gray-400">&lt;sender@example.com&gt;</span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">to me</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{selectedEmail.date}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStarred(prev => {
                              const next = new Set(prev);
                              if (next.has(selectedEmail.id)) next.delete(selectedEmail.id);
                              else next.add(selectedEmail.id);
                              return next;
                            });
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <StarIcon filled={starred.has(selectedEmail.id)} />
                        </button>
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{selectedEmail.subject}</h1>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]">
                        <ReplyIcon /> Reply
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-semibold transition-all duration-200">
                        Forward
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-semibold transition-all duration-200">
                        <TrashIcon /> Delete
                      </button>
                    </div>
                 </div>

                 {/* Email Body */}
                 <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto">
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Hello,</p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedEmail.preview}</p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          Best regards,<br/>
                          <span className="font-semibold">{selectedEmail.sender}</span>
                        </p>
                      </div>
                    </div>
                 </div>
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4 shadow-xl">
                  <MailIcon />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Message Selected</h3>
                <p className="text-sm text-gray-500 dark:text-gray-500">Choose a message from your inbox to read</p>
            </div>
        )}
      </div>

    </div>
  );
}

export default App;
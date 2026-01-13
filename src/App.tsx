import React, { useState, useEffect } from 'react';
import { Settings, User as UserIcon, Plus, Trash2, CheckCircle2, Circle, X, Edit2, Link as LinkIcon, Cloud, Flag, Calendar, FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { useStore } from './store';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import type { Priority } from './types';

function App() {
  const {
    tasks,
    lists,
    links,
    addList,
    deleteList,
    renameList,
    addLink,
    deleteLink,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    currentUser,
    switchUser,
    activeTab,
    setActiveTab,
    background,
    setBackground,
  } = useStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customBgUrl, setCustomBgUrl] = useState('');


  // Clock State
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time for PKT and SGT
  const formatTimeKey = (tz: string) => {
    return time.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Weather State (Rahim Yar Khan)
  const [weather, setWeather] = useState<{ temp: number, code: number } | null>(null);

  useEffect(() => {
    // Fetch weather for Rahim Yar Khan (Lat: 28.4212, Long: 70.2989)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=28.4212&longitude=70.2989&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data.current_weather) {
          setWeather({ temp: data.current_weather.temperature, code: data.current_weather.weathercode });
        }
      })
      .catch(err => console.error("Weather fetch failed", err));
  }, []);


  const handleAddTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle, newTaskPriority);
    setNewTaskTitle('');
    setNewTaskPriority('medium'); // Reset
    toast.success("Task added");
  };

  const handleAddList = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newListTitle.trim()) return;
    addList(newListTitle);
    setNewListTitle('');
    setIsAddingList(false);
    toast.success(`List "${newListTitle}" created`);
  };

  const handleSaveSettings = () => {
    if (customBgUrl) {
      setBackground(customBgUrl);
      toast.success("Background updated");
    }
    setShowSettings(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'For Usama') {
      return task.listId === 'For Usama' || task.assignedTo === 'u2';
    }
    return task.listId === activeTab;
  });

  const backgrounds = [
    { name: 'Aurora', url: '/background.png' },
    { name: 'Sunset', url: '/bg-sunset.png' },
    { name: 'Forest', url: '/bg-forest.png' },
  ];

  const hasLists = lists.length > 0;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-sans">
      <Toaster position="bottom-center" theme="dark" />

      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90 transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `url('${background}')` }}
      />

      {/* Greeting Widget */}
      <div className="relative z-10 mb-8 w-full max-w-5xl px-4 flex justify-between items-end animate-in fade-in slide-in-from-top-4 duration-500">
        <Greeting name={currentUser.name} />
        <QuickLinks links={links} onAdd={addLink} onDelete={deleteLink} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl backdrop-blur-2xl bg-black/40 rounded-[2.5rem] border border-white/10 shadow-2xl p-10 text-white transition-all duration-300 min-h-[600px] flex flex-col">

        {/* Top Header: Clocks, Weather, Focus Mode */}
        <div className="flex justify-between items-center mb-8 w-full border-b border-white/5 pb-4">
          <div className="flex gap-8 items-center">
            <ClockDisplay label="PKT" time={formatTimeKey('Asia/Karachi')} />
            <div className="w-px h-10 bg-white/10"></div>
            <ClockDisplay label="SGT" time={formatTimeKey('Asia/Singapore')} />
          </div>

          <div className="flex items-center gap-4">

            {weather ? (
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                <Cloud size={20} className="text-blue-300" />
                <div className="text-right">
                  <div className="text-lg font-light leading-none">{weather.temp}°C</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Rahim Yar Khan</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-white/30">Loading weather...</div>
            )}
          </div>
        </div>


        {/* Tabs Area */}
        <div className="flex items-start justify-between mb-8 w-full sticky top-0 z-20">
          <div className="flex flex-wrap items-center gap-3 w-full">
            {lists.map(list => (
              <TabButton
                key={list.id}
                label={list.name}
                count={tasks.filter(t => t.listId === list.id).length}
                active={activeTab === list.id}
                onClick={() => setActiveTab(list.id)}
                onDelete={() => deleteList(list.id)}
                onRename={(name) => renameList(list.id, name)}
              />
            ))}

            {(currentUser.role === 'HAMZA' || currentUser.role === 'USAMA') && hasLists && (
              <TabButton
                label="For Usama"
                count={tasks.filter(t => t.assignedTo === 'u2').length}
                active={activeTab === 'For Usama'}
                onClick={() => setActiveTab('For Usama')}
              />
            )}

            {hasLists && (
              <div className="relative">
                {!isAddingList ? (
                  <button
                    onClick={() => setIsAddingList(true)}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors group"
                    title="Create New List"
                  >
                    <Plus size={22} className="text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                ) : (
                  <form onSubmit={handleAddList} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-200">
                    <input
                      autoFocus
                      type="text"
                      value={newListTitle}
                      onChange={e => setNewListTitle(e.target.value)}
                      placeholder="List name..."
                      className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                      onBlur={() => !newListTitle && setIsAddingList(false)}
                    />
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-3 mb-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {!hasLists ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 mt-10 animate-in fade-in duration-500">
              {isAddingList ? (
                <form onSubmit={handleAddList} className="flex flex-col items-center gap-4 w-full max-w-sm">
                  <input
                    autoFocus
                    type="text"
                    value={newListTitle}
                    onChange={e => setNewListTitle(e.target.value)}
                    placeholder="Name your first list..."
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-xl text-center text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder-white/30"
                    onBlur={() => !newListTitle && setIsAddingList(false)}
                  />
                  <div className="text-sm text-white/40">Press Enter to create</div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingList(true)}
                  className="group flex flex-col items-center gap-4 p-8 rounded-3xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300 border border-white/10 group-hover:border-white/20 shadow-2xl">
                    <Plus size={40} className="text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-light text-white/80 group-hover:text-white transition-colors">Start by creating a list</p>
                    <p className="text-white/40 font-light group-hover:text-white/60 transition-colors">Organize your tasks like a pro</p>
                  </div>
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-40 text-white/30"
                >
                  <p className="font-light text-xl">All caught up</p>
                </motion.div>
              ) : (
                filteredTasks.map(task => (
                  <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} onDelete={() => deleteTask(task.id)} onUpdate={(updates) => updateTask(task.id, updates)} />
                ))
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Input Area (Only show if there is an active tab) */}
        {activeTab && (
          <form onSubmit={handleAddTask} className="relative mt-auto pt-6 border-t border-white/5 flex gap-2">
            <div className="flex-grow relative">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={activeTab === 'For Usama' ? "Assign a task for Usama..." : "Add a new task..."}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-12 py-4 text-lg text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all font-light shadow-inner"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                  className="bg-transparent text-xs text-white/50 border-none focus:ring-0 cursor-pointer hover:text-white transition-colors appearance-none text-right pr-2"
                >
                  <option value="low" className="bg-black text-white">Low</option>
                  <option value="medium" className="bg-black text-white">Medium</option>
                  <option value="high" className="bg-black text-white">High</option>
                </select>
                <Flag size={14} className={clsx(
                  newTaskPriority === 'high' ? 'text-red-400' :
                    newTaskPriority === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                )} />
              </div>
            </div>
            <button type="submit" className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all">
              <Plus size={24} />
            </button>
          </form>
        )}

      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-8 right-8 flex items-center gap-4 z-20">
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium hover:border-white/30"
        >
          <Settings size={18} />
          Settings
        </button>

        <div className="relative group">
          <button className="bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium flex items-center gap-2 hover:border-white/30">
            <UserIcon size={18} />
            <span>{currentUser.name}</span>
          </button>
          <div className="absolute bottom-full right-0 mb-3 w-36 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100 shadow-xl">
            <button onClick={() => switchUser('HAMZA')} className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors border-b border-white/5">
              Hamza (Admin)
            </button>
            <button onClick={() => switchUser('USAMA')} className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors">
              Usama
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light">Settings</h2>
              <button onClick={() => setShowSettings(false)}><X size={24} className="text-white/50 hover:text-white" /></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Background Image</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {backgrounds.map(bg => (
                    <button
                      key={bg.name}
                      onClick={() => { setBackground(bg.url); toast.success("Background applied"); }}
                      className={clsx("h-16 rounded-lg bg-cover bg-center border-2 transition-all", background === bg.url ? "border-purple-500" : "border-transparent opacity-60 hover:opacity-100")}
                      style={{ backgroundImage: `url('${bg.url}')` }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customBgUrl}
                    onChange={e => setCustomBgUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 text-sm"
                    placeholder="Or enter Image URL..."
                  />
                  <button onClick={handleSaveSettings} className="bg-white/10 hover:bg-white/20 px-4 rounded-xl">
                    <LinkIcon size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}

// --- SUB-COMPONENTS --- //

function Greeting({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Simple quotes
  const quotes = [
    "Focus on the step in front of you, not the whole staircase.",
    "Discipline is doing what needs to be done, even if you don't want to do it.",
    "Small progress is still progress."
  ];
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="flex flex-col">
      <h1 className="text-5xl font-light tracking-tight text-white mb-2">
        {greeting}, <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">{name}</span>
      </h1>
      <p className="text-white/60 text-lg font-light italic">"{quote}"</p>
    </div>
  );
}

function QuickLinks({ links, onAdd, onDelete }: { links: any[], onAdd: (t: string, u: string) => void, onDelete: (id: string) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && url) {
      let finalUrl = url;
      if (!url.startsWith('http')) finalUrl = `https://${url}`;
      onAdd(title, finalUrl);
      setTitle(''); setUrl(''); setShowAdd(false);
      toast.success("Link added");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {links.map(link => (
        <div key={link.id} className="group relative">
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-black/20 hover:bg-white/10 transition-all backdrop-blur-md border border-white/5 hover:border-white/20 w-20 h-20 justify-center"
          >
            <img
              src={`https://www.google.com/s2/favicons?sz=64&domain=${link.url}`}
              alt={link.title}
              className="w-8 h-8 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-[10px] text-white/50 group-hover:text-white transition-colors truncate w-full text-center">{link.title}</span>
          </a>
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(link.id); }}
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          >
            <X size={10} />
          </button>
        </div>
      ))}

      <div className="relative">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex flex-col items-center justify-center gap-1 w-20 h-20 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 border-dashed hover:border-white/30 text-white/30 hover:text-white"
        >
          <Plus size={24} />
          <span className="text-[10px]">Add</span>
        </button>

        {showAdd && (
          <div className="absolute top-full right-0 mt-2 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl w-60 z-50 shadow-2xl animate-in fade-in zoom-in-95">
            <form onSubmit={handleAdd} className="space-y-2">
              <input className="w-full bg-white/10 rounded border border-white/10 px-2 py-1 text-sm text-white" placeholder="Title (e.g. Gmail)" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
              <input className="w-full bg-white/10 rounded border border-white/10 px-2 py-1 text-sm text-white" placeholder="URL (e.g. mail.google.com)" value={url} onChange={e => setUrl(e.target.value)} />
              <button type="submit" className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-1.5 rounded">Add Link</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}



function ClockDisplay({ label, time }: { label: string, time: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase mb-0.5">{label}</span>
      <span className="text-2xl font-light tracking-wider font-mono">{time}</span>
    </div>
  )
}

function TabButton({ label, count, active, onClick, onDelete, onRename }: { label: string, count?: number, active: boolean, onClick: () => void, onDelete?: () => void, onRename?: (name: string) => void }) {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(label);

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim() && onRename) {
      onRename(editName);
      setIsEditing(false);
      setShowOptions(false);
      toast.success("List renamed");
    }
  };

  return (
    <div className="relative group/tab">
      {isEditing ? (
        <form onSubmit={handleRename} className="px-2">
          <input
            autoFocus
            className="bg-white/10 border border-white/30 rounded-full px-3 py-1.5 text-[15px] font-medium text-white w-32 focus:outline-none"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={() => setIsEditing(false)}
          />
        </form>
      ) : (
        <button
          onClick={() => {
            if (active) setShowOptions(!showOptions);
            onClick();
          }}
          className={clsx(
            "px-6 py-2.5 rounded-full text-[15px] font-medium transition-all duration-300 flex items-center gap-2.5",
            active
              ? "bg-white/10 text-white shadow-[0_0_25px_rgba(255,255,255,0.1)] ring-1 ring-white/20 backdrop-blur-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          )}
        >
          {label}
          {count !== undefined && count > 0 && (
            <span className={clsx(
              "text-[11px] font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center",
              active ? "bg-white/20 text-white" : "bg-white/10 text-gray-400"
            )}>
              {count}
            </span>
          )}
        </button>
      )}

      {/* Tab Options Popover */}
      {active && showOptions && !isEditing && (
        <div className="absolute top-full left-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
          <button onClick={() => { setIsEditing(true); setShowOptions(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 flex items-center gap-2 text-white/80 hover:text-white">
            <Edit2 size={14} /> Rename
          </button>
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(); toast.success("List deleted"); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-500/20 text-red-400 flex items-center gap-2 hover:text-red-300">
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete, onUpdate }: { task: any, onToggle: () => void, onDelete: () => void, onUpdate?: (updates: any) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(task.notes || '');
  const [editingNotes, setEditingNotes] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Priority styling
  const priorityConfig = {
    high: {
      badge: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30',
      border: 'border-l-red-500',
      icon: 'text-red-400',
      label: 'High'
    },
    medium: {
      badge: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20',
      border: 'border-l-amber-500',
      icon: 'text-amber-400',
      label: 'Medium'
    },
    low: {
      badge: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20',
      border: 'border-l-blue-500',
      icon: 'text-blue-400',
      label: 'Low'
    }
  };

  const config = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium;

  // Format due date
  const formatDueDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.ceil((timestamp - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`, color: 'text-red-400 bg-red-500/20' };
    if (diffDays === 0) return { text: 'Due today', color: 'text-amber-400 bg-amber-500/20' };
    if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-400 bg-yellow-500/20' };
    if (diffDays <= 7) return { text: `Due in ${diffDays} days`, color: 'text-green-400 bg-green-500/20' };
    return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'text-white/60 bg-white/10' };
  };

  const handleSaveNotes = () => {
    if (onUpdate) {
      onUpdate({ notes });
      toast.success('Notes saved');
    }
    setEditingNotes(false);
  };

  const handleSetDueDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (onUpdate) {
      onUpdate({ dueDate: date.getTime() });
      toast.success('Due date set');
    }
    setShowDatePicker(false);
  };

  const handleRemoveDueDate = () => {
    if (onUpdate) {
      onUpdate({ dueDate: undefined });
      toast.success('Due date removed');
    }
  };

  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle || !linkUrl) return;

    let finalUrl = linkUrl;
    if (!linkUrl.startsWith('http')) finalUrl = `https://${linkUrl}`;

    const newAttachment = { id: Date.now().toString(), title: linkTitle, url: finalUrl };
    const attachments = [...(task.attachments || []), newAttachment];

    if (onUpdate) {
      onUpdate({ attachments });
      toast.success('Link added');
    }
    setLinkTitle('');
    setLinkUrl('');
    setShowAddLink(false);
  };

  const handleRemoveAttachment = (id: string) => {
    const attachments = (task.attachments || []).filter((a: any) => a.id !== id);
    if (onUpdate) {
      onUpdate({ attachments });
      toast.success('Link removed');
    }
  };


  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={clsx(
        "group rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 relative overflow-hidden",
        task.priority && `border-l-4 ${config.border}`
      )}
    >
      {/* Main Task Row */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer"
        onClick={onToggle}
      >
        {/* Checkbox */}
        <button
          className="text-white/40 group-hover:text-purple-400 transition-colors shrink-0"
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
        >
          {task.completed ? (
            <CheckCircle2 size={24} className="text-purple-400/80" />
          ) : (
            <Circle size={24} strokeWidth={1.5} className="group-hover:stroke-white transition-colors" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={clsx(
              "text-lg font-light tracking-wide transition-all",
              task.completed ? "text-white/20 line-through decoration-white/20" : "text-white/90"
            )}>
              {task.title}
            </span>

            {/* Priority Badge */}
            <span className={clsx(
              "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full",
              config.badge
            )}>
              <Flag size={10} className="inline mr-1" />
              {config.label}
            </span>
          </div>

          {/* Meta Info Row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* Due Date Badge */}
            {task.dueDate && (
              <span className={clsx(
                "text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5",
                formatDueDate(task.dueDate).color
              )}>
                <Calendar size={12} />
                {formatDueDate(task.dueDate).text}
              </span>
            )}

            {/* Notes Indicator */}
            {task.notes && (
              <span className="text-xs text-white/40 flex items-center gap-1">
                <FileText size={12} />
                Has notes
              </span>
            )}

            {/* Attachments Count */}
            {task.attachments && task.attachments.length > 0 && (
              <span className="text-xs text-white/40 flex items-center gap-1">
                <LinkIcon size={12} />
                {task.attachments.length} link{task.attachments.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Expand Button */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="text-white/40 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
            title="Expand task"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); toast.success("Task deleted"); }}
            className="text-white/30 hover:text-red-400 transition-all p-2 hover:bg-white/10 rounded-full"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Expanded Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/5"
          >
            <div className="p-5 space-y-4">

              {/* Due Date Section */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50 flex items-center gap-2">
                  <Calendar size={16} />
                  Due Date
                </span>
                <div className="flex items-center gap-2">
                  {task.dueDate ? (
                    <>
                      <span className={clsx(
                        "text-sm px-3 py-1.5 rounded-lg",
                        formatDueDate(task.dueDate).color
                      )}>
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveDueDate(); }}
                        className="text-white/30 hover:text-red-400 p-1"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : showDatePicker ? (
                    <input
                      type="date"
                      onChange={handleSetDueDate}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/40"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowDatePicker(true); }}
                      className="text-sm text-white/40 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      + Add date
                    </button>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/50 flex items-center gap-2">
                    <FileText size={16} />
                    Notes
                  </span>
                  {!editingNotes && task.notes && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingNotes(true); }}
                      className="text-xs text-white/40 hover:text-white"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editingNotes ? (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes to this task..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 resize-none min-h-[100px]"
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => { setNotes(task.notes || ''); setEditingNotes(false); }}
                        className="text-xs text-white/40 hover:text-white px-3 py-1.5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNotes}
                        className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-1.5 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : task.notes ? (
                  <div
                    className="bg-white/5 rounded-xl px-4 py-3 text-sm text-white/70 whitespace-pre-wrap cursor-pointer hover:bg-white/[0.07] transition-colors"
                    onClick={(e) => { e.stopPropagation(); setEditingNotes(true); }}
                  >
                    {task.notes}
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingNotes(true); }}
                    className="text-sm text-white/40 hover:text-white px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors w-full text-left"
                  >
                    + Add notes...
                  </button>
                )}
              </div>

              {/* Attachments Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/50 flex items-center gap-2">
                    <LinkIcon size={16} />
                    Links & Documents
                  </span>
                </div>

                {/* Existing Attachments */}
                {task.attachments && task.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {task.attachments.map((attachment: any) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg group/link transition-colors"
                      >
                        <img
                          src={`https://www.google.com/s2/favicons?sz=32&domain=${attachment.url}`}
                          alt=""
                          className="w-4 h-4 rounded-sm opacity-60"
                        />
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-white/70 hover:text-white flex items-center gap-1"
                        >
                          {attachment.title}
                          <ExternalLink size={12} className="opacity-50" />
                        </a>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveAttachment(attachment.id); }}
                          className="text-white/20 hover:text-red-400 opacity-0 group-hover/link:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Link Form */}
                {showAddLink ? (
                  <form onSubmit={handleAddAttachment} className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <input
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                        placeholder="Link title"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                        autoFocus
                      />
                      <input
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="URL"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => { setLinkTitle(''); setLinkUrl(''); setShowAddLink(false); }}
                        className="text-xs text-white/40 hover:text-white px-3 py-1.5"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-1.5 rounded-lg transition-colors"
                      >
                        Add Link
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowAddLink(true); }}
                    className="text-sm text-white/40 hover:text-white px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors w-full text-left"
                  >
                    + Add link or document...
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default App;

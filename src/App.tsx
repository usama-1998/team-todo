import { useState, useEffect } from 'react';
import { useStore } from './store';
import { Toaster, toast } from 'sonner';
import type { Priority } from './types';

// Components
import { Greeting } from './components/Greeting';
import { QuickLinks } from './components/QuickLinks';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TaskBoard } from './components/TaskBoard';
import { Settings } from './components/Settings';
import { OnboardingModal } from './components/OnboardingModal';

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
    activeTab,
    setActiveTab,
    background,
    setBackground,
    userName,
    setUserName,
    reorderTasks,
  } = useStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskDate, setNewTaskDate] = useState<string>(''); // For date input

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

  const handleAddTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskTitle.trim()) return;

    // Parse date if selected, otherwise undefined (store handles default to today)
    const dueDate = newTaskDate ? new Date(newTaskDate).getTime() : undefined;

    addTask(newTaskTitle, newTaskPriority, dueDate);
    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setNewTaskDate(''); // Reset date
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

  const hasLists = lists.length > 0;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-sans">
      <Toaster position="bottom-center" theme="dark" />

      {!userName && <OnboardingModal onComplete={setUserName} />}

      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90 transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `url('${background}')` }}
      />

      {/* Greeting Widget - Higher Z-Index for dropdowns */}
      <div className="relative z-20 mb-6 w-full max-w-4xl px-4 flex justify-between items-end animate-in fade-in slide-in-from-top-4 duration-500">
        <Greeting />
        <QuickLinks links={links} onAdd={addLink} onDelete={deleteLink} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl backdrop-blur-2xl bg-black/40 rounded-[2rem] border border-white/10 shadow-2xl p-6 text-white transition-all duration-300 min-h-[600px] flex flex-col">
        <Header
          pktTime={formatTimeKey('Asia/Karachi')}
          sgtTime={formatTimeKey('Asia/Singapore')}
        />

        <Sidebar
          lists={lists}
          tasks={tasks}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          deleteList={deleteList}
          renameList={renameList}
          addList={addList}
        />

        <TaskBoard
          tasks={tasks}
          activeTab={activeTab}
          hasLists={hasLists}
          isAddingList={isAddingList}
          setIsAddingList={setIsAddingList}
          newListTitle={newListTitle}
          setNewListTitle={setNewListTitle}
          handleAddList={handleAddList}

          newTaskTitle={newTaskTitle}
          setNewTaskTitle={setNewTaskTitle}
          newTaskPriority={newTaskPriority}
          setNewTaskPriority={setNewTaskPriority}
          newTaskDate={newTaskDate}
          setNewTaskDate={setNewTaskDate}

          handleAddTask={handleAddTask}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          updateTask={updateTask}
          reorderTasks={reorderTasks}
        />
      </div>

      <Settings
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        background={background}
        setBackground={setBackground}
        customBgUrl={customBgUrl}
        setCustomBgUrl={setCustomBgUrl}
      />
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { useStore } from './store';
import { Toaster, toast } from 'sonner';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import type { Priority, Task } from './types';
import { createPortal } from 'react-dom';
import { TaskItem } from './components/TaskItem'; // We'll need this for DragOverlay

// Components
import { Greeting } from './components/Greeting';
import { QuickLinks } from './components/QuickLinks';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TaskBoard } from './components/TaskBoard';
import { Settings } from './components/Settings';
import { OnboardingModal } from './components/OnboardingModal';
import { CompletedTasksPanel } from './components/CompletedTasksPanel';

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
    moveTask,
    showCompleted,
    toggleShowCompleted,
  } = useStore();

  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // DND Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveDragTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Dropped on a Tab (List)
    if (lists.some(l => l.id === overId)) {
      if (activeDragTask && activeDragTask.listId !== overId) {
        moveTask(activeId as string, overId as string);
        toast.success("Task moved to " + lists.find(l => l.id === overId)?.name);
      }
      return;
    }

    // Dropped on another Task (Reorder)
    // We only reorder if it's in the same list (Visual reorder handled by SortableContext in TaskBoard)
    // Actually, we need to handle the reorder logic here if we want it to persist.
    // The visual order comes from filteredTasks in TaskBoard.

    // Find indices in the GLOBAL tasks array is tricky because they might not be adjacent.
    // Ideally we reorder the subset and then merge back.
    // Simpler approach: Let TaskBoard handle internal reordering via its own prop or 
    // we handle it here by finding the tasks in the current list, reordering them, and updating the global list.

    if (activeId !== overId) {
      // We need to find the old and new index relative to the CURRENT VIEW (filtered tasks)
      // Then map that back to the global state.

      // However, dnd-kit gives us IDs.
      // Let's get all tasks for the current list
      const currentListTasks = tasks.filter(t => t.listId === activeTab && !t.completed);
      const oldIndex = currentListTasks.findIndex(t => t.id === activeId);
      const newIndex = currentListTasks.findIndex(t => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrderedList = arrayMove(currentListTasks, oldIndex, newIndex);
        // Now we need to construct the full new global task list.
        // We keep tasks NOT in this list in their original places relative to each other? 
        // Or just pile them? Preserving order is best.

        // Easiest is to reconstruct:
        // 1. Filter out all current list tasks from global tasks
        // 2. Insert the new ordered list tasks? No, that messes up if we have mixed content?
        // Actually, `tasks` is just an array. We can just map the current list tasks to the new order
        // but we need to know WHERE they fit in the global array if we want to preserve that?
        // Since we only view by list, the global order of tasks across lists matters less, 
        // BUT the order WITHIN the list matters.

        // So:
        // Get all tasks (T)
        // Get tasks in current list (L_old)
        // Get tasks NOT in current list (Others)
        // Create L_new (reordered)
        // Result = ...Others, ...L_new ? This changes the interleaving of tasks in the DB but that doesn't matter for the UI since we filter by list.
        // So yes, we can just replace the global list with Others + L_new

        const otherTasks = tasks.filter(t => t.listId !== activeTab || t.completed);
        reorderTasks([...otherTasks, ...newOrderedList]);
      }
    }
  };

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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Sidebar
            lists={lists}
            tasks={tasks}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            deleteList={deleteList}
            renameList={renameList}
            addList={addList}
            showCompleted={showCompleted}
            toggleShowCompleted={toggleShowCompleted}
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
          />

          {createPortal(
            <DragOverlay>
              {activeDragTask ? (
                <div className="opacity-80 rotate-2 cursor-grabbing pointer-events-none">
                  <TaskItem
                    task={activeDragTask}
                    onToggle={() => { }}
                    onDelete={() => { }}
                    onUpdate={() => { }}
                    isOverlay // We likely need to add this prop to TaskItem for styling
                  />
                </div>
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>

      <CompletedTasksPanel
        isOpen={showCompleted}
        onClose={toggleShowCompleted}
        tasks={tasks.filter(t => t.listId === activeTab && t.completed)}
        onToggle={(id) => {
          toggleTask(id);
          toast.success("Task restored");
        }}
        onDelete={deleteTask}
      />

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

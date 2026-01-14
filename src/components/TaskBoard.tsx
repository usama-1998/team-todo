import { useState } from 'react';
import { Plus, CheckCircle2, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { TaskItem } from './TaskItem';
import { DatePicker } from './DatePicker';
import clsx from 'clsx';
import type { Task, Priority } from '../types';

interface TaskBoardProps {
    tasks: Task[];
    activeTab: string;
    hasLists: boolean;
    setIsAddingList: (adding: boolean) => void;
    isAddingList: boolean;
    newListTitle: string;
    setNewListTitle: (title: string) => void;
    handleAddList: (e?: React.FormEvent) => void;
    newTaskTitle: string;
    setNewTaskTitle: (title: string) => void;
    newTaskPriority: Priority;
    setNewTaskPriority: (priority: Priority) => void;
    newTaskDate: string;
    setNewTaskDate: (date: string) => void;
    handleAddTask: (e?: React.FormEvent) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    reorderTasks: (newOrder: Task[]) => void;
}

export function TaskBoard({
    tasks,
    activeTab,
    hasLists,
    setIsAddingList,
    isAddingList,
    newListTitle,
    setNewListTitle,
    handleAddList,
    newTaskTitle,
    setNewTaskTitle,
    newTaskPriority,
    setNewTaskPriority,
    newTaskDate,
    setNewTaskDate,
    handleAddTask,
    toggleTask,
    deleteTask,
    updateTask,
    reorderTasks
}: TaskBoardProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Data filtered by list, but NOT sorted automatically to preserve drag-and-drop order
    const filteredTasks = tasks.filter(task => task.listId === activeTab);

    // Handler for reordering
    const handleReorder = (newOrder: Task[]) => {
        // We need to merge the new order of *filtered* tasks back into the full *tasks* array
        // This is a bit tricky because 'tasks' contains tasks from ALL lists.
        // Strategy: Create a Map of the new order indices for the active list, 
        // then reconstruct the full list.
        // SIMPLER STRATEGY for local state: Just call reorderTasks with the full list constructed appropriately.
        // Actually, Reorder.Group expects the full array it renders.

        // For simplicity in this specific "per-list" view, relying on the 'filteredTasks' for the Reorder.Group
        // When 'onReorder' is called, it gives us the new order of 'filteredTasks'.
        // We need to update the global 'tasks' state.

        const otherTasks = tasks.filter(task => task.listId !== activeTab);
        reorderTasks([...newOrder, ...otherTasks]);
    };

    return (
        <>
            <div className="space-y-2 mb-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
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
                                className="flex flex-col items-center justify-center h-40 text-white/30 gap-3"
                            >
                                <CheckCircle2 size={48} className="text-white/10" />
                                <p className="font-light text-xl">All caught up</p>
                            </motion.div>
                        ) : (
                            <Reorder.Group axis="y" values={filteredTasks} onReorder={handleReorder} className="space-y-3">
                                {filteredTasks.map(task => (
                                    <Reorder.Item key={task.id} value={task} className="cursor-grab active:cursor-grabbing">
                                        <TaskItem task={task} onToggle={() => toggleTask(task.id)} onDelete={() => deleteTask(task.id)} onUpdate={(updates) => updateTask(task.id, updates)} />
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {activeTab && (
                <form onSubmit={handleAddTask} className="relative mt-auto pt-6 border-t border-white/5 flex gap-2">
                    <div className="flex-grow relative">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Add a new task..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-6 pr-28 py-4 text-base text-white placeholder-white/20 focus:outline-none focus:bg-white/[0.07] focus:border-white/20 transition-all font-light shadow-2xl"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            {/* Date Picker Trigger */}
                            {/* Date Picker Trigger */}
                            <div className="relative">
                                {showDatePicker ? (
                                    <div className="absolute bottom-full mb-2 right-0 z-50">
                                        <DatePicker
                                            selectedDate={newTaskDate}
                                            onChange={(date) => {
                                                setNewTaskDate(date);
                                                setShowDatePicker(false);
                                            }}
                                            onClose={() => setShowDatePicker(false)}
                                        />
                                    </div>
                                ) : null}

                                <button
                                    type="button"
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                    className={clsx(
                                        "p-2 rounded-lg transition-all flex items-center gap-2",
                                        newTaskDate ? "bg-purple-500/20 text-purple-300" : "hover:bg-white/5 text-white/40 hover:text-white"
                                    )}
                                >
                                    <Calendar size={18} />
                                    {newTaskDate && (
                                        <span className="text-xs font-medium">
                                            {new Date(newTaskDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    )}
                                </button>
                                {newTaskDate && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setNewTaskDate(''); }}
                                        className="absolute -top-1 -right-1 bg-red-500/80 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"
                                    >
                                        <X size={10} />
                                    </button>
                                )}
                            </div>

                            <div className="w-px h-4 bg-white/10" />

                            <div className="relative group flex items-center">
                                <select
                                    value={newTaskPriority}
                                    onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-all text-sm font-medium uppercase tracking-wider text-white/60 group-hover:text-white cursor-pointer select-none">
                                    <span className={clsx(
                                        "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
                                        newTaskPriority === 'high' ? 'bg-red-500 text-red-500' :
                                            newTaskPriority === 'medium' ? 'bg-amber-500 text-amber-500' : 'bg-blue-500 text-blue-500'
                                    )} />
                                    {newTaskPriority}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/5 hover:border-white/10 shadow-xl group">
                        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </form>
            )}
        </>
    );
}

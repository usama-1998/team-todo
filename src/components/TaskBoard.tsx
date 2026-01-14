import { Plus, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskItem } from './TaskItem';
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
    handleAddTask: (e?: React.FormEvent) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
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
    handleAddTask,
    toggleTask,
    deleteTask,
    updateTask
}: TaskBoardProps) {
    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'For Usama') {
            return task.listId === 'For Usama' || task.assignedTo === 'u2';
        }
        return task.listId === activeTab;
    });

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

            {activeTab && (
                <form onSubmit={handleAddTask} className="relative mt-auto pt-6 border-t border-white/5 flex gap-2">
                    <div className="flex-grow relative">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder={activeTab === 'For Usama' ? "Assign a task for Usama..." : "Add a new task..."}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-6 pr-12 py-4 text-base text-white placeholder-white/20 focus:outline-none focus:bg-white/[0.07] focus:border-white/20 transition-all font-light shadow-2xl"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <select
                                value={newTaskPriority}
                                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                                className="bg-transparent text-[10px] uppercase tracking-widest text-white/40 border-none focus:ring-0 cursor-pointer hover:text-white transition-colors appearance-none text-right pr-2 font-bold"
                            >
                                <option value="low" className="bg-black text-white">Low</option>
                                <option value="medium" className="bg-black text-white">Medium</option>
                                <option value="high" className="bg-black text-white">High</option>
                            </select>
                            <Flag size={14} className={clsx(
                                "transition-colors duration-300",
                                newTaskPriority === 'high' ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
                                    newTaskPriority === 'medium' ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                            )} />
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

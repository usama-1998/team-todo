import { X, CheckSquare, Trash2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../types';

interface CompletedTasksPanelProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export function CompletedTasksPanel({ isOpen, onClose, tasks, onToggle, onDelete }: CompletedTasksPanelProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 rounded-[2rem]"
                    />

                    {/* Side Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute right-0 top-0 bottom-0 w-96 bg-[#0a0a0a] border-l border-white/10 z-50 rounded-r-[2rem] overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-xl font-light text-white">History</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {tasks.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/30 gap-4">
                                    <CheckSquare size={48} className="opacity-20" />
                                    <p className="font-light">No completed tasks yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tasks.map(task => (
                                        <motion.div
                                            layout
                                            key={task.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="group bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
                                        >
                                            <div className="flex items-start gap-3">
                                                <button
                                                    onClick={() => onToggle(task.id)}
                                                    className="mt-1 text-purple-400 hover:text-purple-300 transition-colors"
                                                    title="Mark as incomplete"
                                                >
                                                    <CheckSquare size={18} />
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white/50 line-through text-sm">{task.title}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        {task.dueDate && (
                                                            <span className="text-[10px] text-white/30 flex items-center gap-1">
                                                                <Calendar size={10} />
                                                                {new Date(task.dueDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => onDelete(task.id)}
                                                    className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

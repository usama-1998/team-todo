import { useState, useRef } from 'react';
import { Trash2, CheckSquare, Square, X, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import clsx from 'clsx';
import type { Task } from '../types';
import { DatePicker } from './DatePicker';
import { Popover } from './Popover';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskItemProps {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
    onUpdate?: (updates: Partial<Task>) => void;
    isOverlay?: boolean;
}

export function TaskItem({ task, onToggle, onDelete, onUpdate, isOverlay }: TaskItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    const [isExpanded, setIsExpanded] = useState(false);
    const [notes, setNotes] = useState(task.notes || '');
    const [editingNotes, setEditingNotes] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerTriggerRef = useRef<HTMLDivElement>(null);

    // Title Editing State
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);

    // Toast logic wrapper
    const handleToggle = () => {
        if (!task.completed) {
            toast.success("Task completed! 🎉");
        }
        onToggle();
    };

    const handleTitleSave = () => {
        if (editedTitle.trim() !== task.title && onUpdate) {
            onUpdate({ title: editedTitle.trim() });
            toast.success("Task updated");
        }
        setIsEditingTitle(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleTitleSave();
        if (e.key === 'Escape') {
            setEditedTitle(task.title);
            setIsEditingTitle(false);
        }
    };

    // Priority styling
    const priorityConfig = {
        high: {
            badge: 'bg-red-500/10 text-red-400 border border-red-500/20',
            dot: 'bg-red-500',
            label: 'High'
        },
        medium: {
            badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
            dot: 'bg-amber-500',
            label: 'Medium'
        },
        low: {
            badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
            dot: 'bg-blue-500',
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



    const handleRemoveDueDate = () => {
        if (onUpdate) {
            onUpdate({ dueDate: undefined });
            toast.success('Due date removed');
        }
    };

    return (
        <div ref={setNodeRef} style={style} className={clsx("relative", isDragging && "z-50")}>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                }}
                className={clsx(
                    "group rounded-2xl transition-all duration-300 relative bg-white/5 hover:bg-white/10 border border-white/5 mb-3",
                    task.completed ? "opacity-50 grayscale bg-white/5 border-transparent" : "opacity-100 bg-white/10 border-white/10",
                    isDragging ? "opacity-30" : "opacity-100",
                    isOverlay ? "cursor-grabbing border-white/20 shadow-2xl bg-gray-900/90 backdrop-blur-xl scale-105" : ""
                )}
            >

                {/* Main Task Row */}
                <div
                    className="flex items-center gap-3 p-3 cursor-pointer"
                    onClick={handleToggle}
                >
                    {/* Drag Handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="p-1 px-2 rounded-md text-white/20 hover:text-white/60 hover:bg-white/10 cursor-grab active:cursor-grabbing transition-colors self-stretch flex items-center justify-center mr-1"
                    >
                        <svg width="6" height="18" viewBox="0 0 6 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="2" cy="2" r="1.5" />
                            <circle cx="2" cy="9" r="1.5" />
                            <circle cx="2" cy="16" r="1.5" />
                        </svg>
                    </div>

                    {/* Checkbox */}
                    <button
                        className="text-white/40 group-hover:text-purple-400 transition-colors shrink-0"
                        onClick={(e) => { e.stopPropagation(); handleToggle(); }}
                    >
                        {task.completed ? (
                            <div className="bg-purple-500/20 p-1 rounded-md">
                                <CheckSquare size={18} className="text-purple-400" />
                            </div>
                        ) : (
                            <Square size={20} strokeWidth={1.5} className="group-hover:stroke-white transition-colors" />
                        )}
                    </button>

                    {/* Task Content */}
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            {isEditingTitle ? (
                                <input
                                    autoFocus
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    onBlur={handleTitleSave}
                                    onKeyDown={handleKeyDown}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-transparent border-b border-white/20 text-[15px] font-light tracking-wide text-white focus:outline-none focus:border-white/50 w-full min-w-[200px]"
                                />
                            ) : (
                                <span
                                    onClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
                                    className={clsx(
                                        "text-[15px] font-light tracking-wide transition-all relative overflow-hidden inline-block cursor-text hover:text-white/80",
                                        task.completed ? "text-white/30 animate-strike font-medium" : "text-white/90"
                                    )}>
                                    {task.title}
                                </span>
                            )}

                            {/* Priority Dot/Badge */}
                            <div className={clsx(
                                "text-[9px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1.5",
                                config.badge
                            )}>
                                <div className={clsx("w-1 h-1 rounded-full animate-pulse", config.dot)} />
                                {config.label}
                            </div>
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
                            <div className="p-3 space-y-2">

                                {/* Priority Selection */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/50 flex items-center gap-2">
                                        <div className={clsx("w-3 h-3 rounded-full", config.dot)} />
                                        Priority
                                    </span>
                                    <div className="flex bg-white/5 rounded-lg p-0.5" onClick={(e) => e.stopPropagation()}>
                                        {(['low', 'medium', 'high'] as const).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => onUpdate && onUpdate({ priority: p })}
                                                className={clsx(
                                                    "px-3 py-1 text-xs uppercase tracking-wider font-medium rounded-md transition-all",
                                                    task.priority === p
                                                        ? (p === 'high' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' :
                                                            p === 'medium' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' :
                                                                'bg-blue-500 text-white shadow-lg shadow-blue-500/20')
                                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Due Date Section */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/50 flex items-center gap-2">
                                        <Calendar size={16} />
                                        Due Date
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="relative" ref={datePickerTriggerRef}>
                                            <Popover
                                                isOpen={showDatePicker}
                                                onClose={() => setShowDatePicker(false)}
                                                triggerRef={datePickerTriggerRef}
                                                align="end"
                                            >
                                                <DatePicker
                                                    selectedDate={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                                                    onChange={(dateStr) => {
                                                        if (onUpdate) {
                                                            const date = dateStr ? new Date(dateStr) : undefined;
                                                            onUpdate({ dueDate: date ? date.getTime() : undefined });
                                                            toast.success(date ? 'Due date set' : 'Due date removed');
                                                        }
                                                        setShowDatePicker(false);
                                                    }}
                                                    onClose={() => setShowDatePicker(false)}
                                                />
                                            </Popover>

                                            {task.dueDate ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setShowDatePicker(true); }}
                                                        className={clsx(
                                                            "text-sm px-3 py-1.5 rounded-lg transition-all hover:brightness-110",
                                                            formatDueDate(task.dueDate).color
                                                        )}
                                                        title="Click to change date"
                                                    >
                                                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveDueDate(); }}
                                                        className="text-white/30 hover:text-red-400 p-1"
                                                        title="Remove date"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
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
                                </div>

                                {/* Quick Note Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-white/50 flex items-center gap-2">
                                            <FileText size={16} />
                                            Quick Note
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
                                                placeholder="Add a quick note..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 resize-none min-h-[80px]"
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
                                            + Add quick note...
                                        </button>
                                    )}
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

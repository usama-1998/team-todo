import { useState } from 'react';
import { Trash2, CheckCircle2, Circle, X, Link as LinkIcon, Calendar, FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import clsx from 'clsx';
import type { Task } from '../types';

interface TaskItemProps {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
    onUpdate?: (updates: Partial<Task>) => void;
}

export function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
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
        const attachments = (task.attachments || []).filter((a) => a.id !== id);
        if (onUpdate) {
            onUpdate({ attachments });
            toast.success('Link removed');
        }
    };

    return (
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
                "group rounded-2xl transition-all duration-300 relative glass-morphism-premium mb-3 overflow-hidden",
                task.completed ? "opacity-60 saturate-50" : "opacity-100"
            )}
        >
            {/* Task Completion Progress Bar (subtle) */}
            {task.completed && (
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-purple-500/50 to-blue-500/50 z-10"
                />
            )}
            {/* Main Task Row */}
            <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={onToggle}
            >
                {/* Checkbox */}
                <button
                    className="text-white/40 group-hover:text-purple-400 transition-colors shrink-0"
                    onClick={(e) => { e.stopPropagation(); onToggle(); }}
                >
                    {task.completed ? (
                        <CheckCircle2 size={20} className="text-purple-400/80" />
                    ) : (
                        <Circle size={20} strokeWidth={1.5} className="group-hover:stroke-white transition-colors" />
                    )}
                </button>

                {/* Task Content */}
                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className={clsx(
                            "text-[15px] font-light tracking-wide transition-all relative overflow-hidden inline-block",
                            task.completed ? "text-white/20 animate-strike" : "text-white/90"
                        )}>
                            {task.title}
                        </span>

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
                        <div className="p-3 space-y-2">

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
                                        {task.attachments.map((attachment) => (
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
    );
}

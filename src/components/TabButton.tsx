import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

interface TabButtonProps {
    label: string;
    count?: number;
    active: boolean;
    onClick: () => void;
    onDelete?: () => void;
    onRename?: (name: string) => void;
}

export function TabButton({ label, count, active, onClick, onDelete, onRename }: TabButtonProps) {
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
                        "px-4 py-2 rounded-full text-[14px] font-medium transition-all duration-300 flex items-center gap-2",
                        active
                            ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] ring-1 ring-white/10 backdrop-blur-md"
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

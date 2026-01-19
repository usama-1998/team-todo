import { useState } from 'react';
import { Plus, History } from 'lucide-react';
import { TabButton } from './TabButton';
import { useDroppable } from '@dnd-kit/core';
import type { List, Task } from '../types';
interface SidebarProps {
    lists: List[];
    tasks: Task[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    deleteList: (id: string) => void;
    renameList: (id: string, name: string) => void;
    addList: (name: string) => void;
    showCompleted: boolean;
    toggleShowCompleted: () => void;
}

export function Sidebar({
    lists,
    tasks,
    activeTab,
    setActiveTab,
    deleteList,
    renameList,
    addList,
    showCompleted,
    toggleShowCompleted
}: SidebarProps) {
    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');

    const handleAddList = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newListTitle.trim()) return;
        addList(newListTitle);
        setNewListTitle('');
        setIsAddingList(false);
    };

    const hasLists = lists.length > 0;

    if (!hasLists) return null;

    return (
        <div className="flex items-start justify-between mb-4 w-full sticky top-0 z-20 gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
                {lists.map(list => (
                    <DroppableTab key={list.id} id={list.id}>
                        <TabButton
                            label={list.name}
                            count={tasks.filter(t => t.listId === list.id && !t.completed).length}
                            active={activeTab === list.id}
                            onClick={() => setActiveTab(list.id)}
                            onDelete={() => deleteList(list.id)}
                            onRename={(name) => renameList(list.id, name)}
                        />
                    </DroppableTab>
                ))}

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
            </div>

            {hasLists && (
                <button
                    onClick={toggleShowCompleted}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors group shrink-0"
                    title={showCompleted ? "Hide history" : "Show completed tasks"}
                >
                    <History size={20} className={showCompleted ? "text-purple-400" : "text-white/40 group-hover:text-white"} />
                </button>
            )}
        </div>
    );
}

function DroppableTab({ id, children }: { id: string, children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div
            ref={setNodeRef}
            className={`rounded-full transition-all duration-200 ${isOver ? 'ring-2 ring-white/50 scale-105 bg-white/10' : ''}`}
        >
            {children}
        </div>
    );
}

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Task, List, Link, Priority } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
    userName: string;
    tasks: Task[];
    lists: List[];
    links: Link[];
    activeTab: string;
    background: string;
    showCompleted: boolean;

    // Actions
    setUserName: (name: string) => void;
    toggleShowCompleted: () => void;
    setActiveTab: (tab: string) => void;
    addTask: (title: string, priority?: Priority, dueDate?: number) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    setBackground: (bg: string) => void;

    // List Logic
    addList: (name: string) => void;
    deleteList: (id: string) => void;
    renameList: (id: string, name: string) => void;

    // Link Logic
    addLink: (title: string, url: string) => void;
    deleteLink: (id: string) => void;
    reorderTasks: (newOrder: Task[]) => void;
}

// Custom storage wrapper for Chrome Storage Sync (with local fallback)
const storage = {
    getItem: async (name: string): Promise<string | null> => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            const result = await chrome.storage.sync.get(name);
            return (result[name] as string) || null;
        }
        return localStorage.getItem(name);
    },
    setItem: async (name: string, value: string): Promise<void> => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            await chrome.storage.sync.set({ [name]: value });
        } else {
            localStorage.setItem(name, value);
        }
    },
    removeItem: async (name: string): Promise<void> => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            await chrome.storage.sync.remove(name);
        } else {
            localStorage.removeItem(name);
        }
    },
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            userName: '',
            tasks: [],
            lists: [],
            links: [
                { id: 'l1', title: 'Google', url: 'https://google.com' },
                { id: 'l2', title: 'YouTube', url: 'https://youtube.com' },
            ],
            activeTab: '', // Start empty
            background: '/background.png',
            showCompleted: false, // Default hidden

            setUserName: (name) => set({ userName: name }),
            setActiveTab: (tab) => set({ activeTab: tab }),
            setBackground: (bg) => set({ background: bg }),
            toggleShowCompleted: () => set((state) => ({ showCompleted: !state.showCompleted })),

            addList: (name) => {
                const newList: List = {
                    id: uuidv4(),
                    name,
                };
                set((state) => ({
                    lists: [...state.lists, newList],
                    activeTab: newList.id
                }));
            },

            renameList: (id, name) => {
                set((state) => ({
                    lists: state.lists.map(l => l.id === id ? { ...l, name } : l)
                }));
            },

            deleteList: (id) => {
                set((state) => {
                    const newLists = state.lists.filter(l => l.id !== id);
                    const nextTab = newLists.length > 0 ? newLists[0].id : '';
                    return {
                        lists: newLists,
                        tasks: state.tasks.filter(t => t.listId !== id),
                        activeTab: state.activeTab === id ? nextTab : state.activeTab
                    };
                });
            },

            addLink: (title, url) => {
                const newLink = { id: uuidv4(), title, url };
                set(state => ({ links: [...state.links, newLink] }));
            },

            deleteLink: (id) => {
                set(state => ({ links: state.links.filter(l => l.id !== id) }));
            },

            addTask: (title, priority = 'medium', dueDate) => {
                const { activeTab } = get();
                const listId = activeTab;

                const newTask: Task = {
                    id: uuidv4(),
                    title,
                    completed: false,
                    listId,
                    createdAt: Date.now(),
                    priority,
                    dueDate: dueDate || Date.now(), // Default to today if not provided
                };

                set((state) => ({ tasks: [newTask, ...state.tasks] }));
            },

            updateTask: (id, updates) => {
                set((state) => ({
                    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
                }));
            },

            toggleTask: (id) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== id)
            })),

            reorderTasks: (newOrder) => set({ tasks: newOrder }),
        }),
        {
            name: 'team-todo-storage',
            storage: createJSONStorage(() => storage),
        }
    )
);

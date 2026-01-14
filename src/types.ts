export interface List {
    id: string;
    name: string;
}

export interface Link {
    id: string;
    title: string;
    url: string;
}

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    listId: string;
    createdAt: number;
    priority?: Priority;
    notes?: string;
    dueDate?: number; // timestamp
    attachments?: Link[]; // Reusing Link interface for attachments
}

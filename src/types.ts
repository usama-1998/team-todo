export type Role = 'HAMZA' | 'USAMA';

export interface User {
    id: string;
    name: string;
    role: Role;
}

export interface List {
    id: string;
    name: string;
    createdBy: string; // userId
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
    assignedTo?: string; // userId
    createdBy: string; // userId
    createdAt: number;
    priority?: Priority;
    notes?: string;
    dueDate?: number; // timestamp
    attachments?: Link[]; // Reusing Link interface for attachments
}

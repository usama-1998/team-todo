import { useState, useRef, useEffect } from 'react';
import { Flag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { Priority } from '../types';

interface CustomSelectProps {
    value: Priority;
    onChange: (value: Priority) => void;
}

export function CustomSelect({ value, onChange }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const options: { value: Priority; label: string; color: string }[] = [
        { value: 'high', label: 'High Priority', color: 'text-red-400' },
        { value: 'medium', label: 'Medium Priority', color: 'text-amber-400' },
        { value: 'low', label: 'Low Priority', color: 'text-blue-400' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value) || options[1];

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group"
            >
                <Flag size={18} className={clsx("transition-transform duration-300", isOpen ? "rotate-12 scale-110" : "", selectedOption.color)} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full right-0 mb-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 p-1"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => { onChange(option.value); setIsOpen(false); }}
                                className={clsx(
                                    "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors",
                                    value === option.value ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <Flag size={14} className={option.color} />
                                    <span>{option.label}</span>
                                </div>
                                {value === option.value && <Check size={14} className="text-white/80" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

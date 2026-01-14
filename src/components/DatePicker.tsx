import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import clsx from 'clsx';

interface DatePickerProps {
    selectedDate: string; // ISO string or similar
    onChange: (date: string) => void;
}

export function DatePicker({ selectedDate, onChange }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const handleSelectDate = (date: Date) => {
        // Format to YYYY-MM-DD for input compatibility
        onChange(format(date, 'yyyy-MM-dd'));
        setIsOpen(false);
    };

    const displayDate = selectedDate ? format(new Date(selectedDate), 'MMM d') : '';

    return (
        <div className="relative" ref={containerRef}>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                        "flex items-center gap-2 px-3 py-2 rounded-xl transition-all border",
                        isOpen || selectedDate ? "bg-white/10 border-white/20 text-white" : "bg-transparent border-transparent text-white/40 hover:text-white hover:bg-white/5"
                    )}
                >
                    <CalendarIcon size={18} className={clsx(selectedDate && "text-purple-400")} />
                    {selectedDate && <span className="text-sm font-medium text-purple-200">{displayDate}</span>}
                </button>

                {selectedDate && (
                    <button
                        onClick={() => onChange('')}
                        className="p-1.5 rounded-full hover:bg-white/10 text-white/30 hover:text-red-400 transition-colors"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full right-0 mb-4 w-72 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 p-4"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="font-medium text-white">{format(currentMonth, 'MMMM yyyy')}</span>
                            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                <div key={day} className="text-xs font-medium text-white/30 py-2">{day}</div>
                            ))}
                            {days.map((day, idx) => (
                                <button
                                    key={day.toString()}
                                    onClick={() => handleSelectDate(day)}
                                    className={clsx(
                                        "h-8 w-8 rounded-full text-sm flex items-center justify-center transition-all relative",
                                        !isSameMonth(day, currentMonth) && "text-white/20",
                                        isSameDay(day, new Date(selectedDate || '')) ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "text-white/80 hover:bg-white/10",
                                        isToday(day) && !selectedDate && "ring-1 ring-purple-500/50"
                                    )}
                                    style={{ gridColumnStart: idx === 0 ? day.getDay() + 1 : undefined }}
                                >
                                    {format(day, 'd')}
                                    {isToday(day) && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-purple-400" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

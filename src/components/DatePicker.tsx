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
                        "flex items-center gap-2 px-3 py-2 rounded-xl transition-all border shadow-lg",
                        isOpen || selectedDate ? "bg-purple-500/20 border-purple-500/30 text-purple-100 shadow-purple-500/10" : "bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10"
                    )}
                >
                    <CalendarIcon size={16} className={clsx(selectedDate && "text-purple-300")} />
                    <span className="text-sm font-medium">{selectedDate ? displayDate : <span className="text-white/40 font-normal">Pick Date</span>}</span>
                </button>

                {selectedDate && (
                    <button
                        onClick={() => onChange('')}
                        className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors border border-white/5"
                    >
                        <X size={12} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute bottom-full right-0 mb-4 w-80 bg-[#111111]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-50 p-5 overflow-hidden ring-1 ring-white/5"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

                        {/* Header */}
                        <div className="relative flex items-center justify-between mb-5">
                            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors border border-transparent hover:border-white/5">
                                <ChevronLeft size={18} />
                            </button>
                            <span className="font-semibold text-white/90 tracking-wide text-sm">{format(currentMonth, 'MMMM yyyy')}</span>
                            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors border border-transparent hover:border-white/5">
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="relative grid grid-cols-7 gap-y-2 gap-x-1 text-center">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                <div key={day} className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{day}</div>
                            ))}
                            {days.map((day, idx) => (
                                <button
                                    key={day.toString()}
                                    onClick={() => handleSelectDate(day)}
                                    className={clsx(
                                        "h-9 w-9 rounded-xl text-sm flex items-center justify-center transition-all relative group",
                                        !isSameMonth(day, currentMonth) && "text-white/5 opacity-0 pointer-events-none",
                                        isSameDay(day, new Date(selectedDate || ''))
                                            ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                                            : "text-white/60 hover:bg-white/5 hover:text-white",
                                        isToday(day) && !selectedDate && "bg-white/5 text-purple-300 ring-1 ring-purple-500/30"
                                    )}
                                    style={{ gridColumnStart: idx === 0 ? day.getDay() + 1 : undefined }}
                                >
                                    {format(day, 'd')}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

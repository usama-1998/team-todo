import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Sun, Sunrise, Coffee, CalendarRange } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addDays, nextSaturday, nextMonday, startOfWeek } from 'date-fns';
import clsx from 'clsx';

interface DatePickerProps {
    selectedDate: string; // ISO string 'yyyy-MM-dd' or empty
    onChange: (date: string) => void;
    onClose: () => void;
}

export function DatePicker({ selectedDate, onChange, onClose }: DatePickerProps) {
    const [currentMonth, setCurrentMonth] = useState(selectedDate ? new Date(selectedDate) : new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial focus on mount
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    // Handle outside clicks
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)), // Start from the beginning of the week
        end: endOfMonth(currentMonth),
    });

    // Ensure we fill the grid for the current month view (simple approach)
    // Actually, simple eachDayOfInterval from startOfMonth to endOfMonth is fine, 
    // but aligning correctly with weekdays is better. 
    // Let's stick to the previous simple grid or improve it? 
    // The previous grid just mapped days. Let's make sure it aligns with "S M T W T F S".
    // We need to pad the start.
    const startDay = startOfMonth(currentMonth).getDay(); // 0 is Sunday
    const emptyDays = Array(startDay).fill(null);


    const handleSelectDate = (date: Date) => {
        onChange(format(date, 'yyyy-MM-dd'));
        onClose();
    };

    const quickSelect = (option: 'today' | 'tomorrow' | 'weekend' | 'nextWeek') => {
        const today = new Date();
        let targetDate = today;

        switch (option) {
            case 'today':
                targetDate = today;
                break;
            case 'tomorrow':
                targetDate = addDays(today, 1);
                break;
            case 'weekend':
                targetDate = nextSaturday(today);
                break;
            case 'nextWeek':
                targetDate = nextMonday(today);
                break;
        }
        handleSelectDate(targetDate);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-[340px] bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-50 p-5 overflow-hidden ring-1 ring-white/5"
            ref={containerRef}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            {/* Quick Actions */}
            <div className="relative grid grid-cols-2 gap-2 mb-4">
                <button onClick={() => quickSelect('today')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/80 hover:text-white border border-white/5">
                    <Sun size={14} className="text-amber-400" /> Today
                </button>
                <button onClick={() => quickSelect('tomorrow')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/80 hover:text-white border border-white/5">
                    <Sunrise size={14} className="text-orange-400" /> Tomorrow
                </button>
                <button onClick={() => quickSelect('weekend')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/80 hover:text-white border border-white/5">
                    <Coffee size={14} className="text-pink-400" /> This Weekend
                </button>
                <button onClick={() => quickSelect('nextWeek')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/80 hover:text-white border border-white/5">
                    <CalendarRange size={14} className="text-blue-400" /> Next Week
                </button>
            </div>

            <div className="h-px w-full bg-white/5 mb-4" />

            {/* Calendar Header */}
            <div className="relative flex items-center justify-between mb-4 px-1">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                    <ChevronLeft size={16} />
                </button>
                <span className="font-semibold text-white/90 tracking-wide text-sm">{format(currentMonth, 'MMMM yyyy')}</span>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="relative grid grid-cols-7 gap-y-2 gap-x-1 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="text-[10px] font-bold text-white/20 uppercase tracking-widest py-1">{day}</div>
                ))}

                {/* Empty placeholders for start of month */}
                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}

                {/* Days */}
                {days.map((day) => (
                    <button
                        key={day.toString()}
                        onClick={() => handleSelectDate(day)}
                        className={clsx(
                            "h-8 w-8 rounded-lg text-xs flex items-center justify-center transition-all relative group mx-auto",
                            isSameDay(day, new Date(selectedDate || ''))
                                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30 font-medium"
                                : "text-white/60 hover:bg-white/10 hover:text-white",
                            isToday(day) && !selectedDate && "bg-white/5 text-purple-300 ring-1 ring-purple-500/30"
                        )}
                    >
                        {format(day, 'd')}
                    </button>
                ))}
            </div>

            {selectedDate && (
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-center">
                    <button onClick={() => { onChange(''); onClose(); }} className="text-xs text-white/40 hover:text-red-400 transition-colors flex items-center gap-1.5">
                        <X size={12} /> Clear Date
                    </button>
                </div>
            )}
        </motion.div>
    );
}

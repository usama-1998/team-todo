import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Sun, Sunrise, Coffee, CalendarRange, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addDays, nextSaturday, nextMonday } from 'date-fns';
import clsx from 'clsx';
import { TimePicker } from './TimePicker';

interface DatePickerProps {
    selectedDate: string; // ISO string 'yyyy-MM-dd' or 'yyyy-MM-ddTHH:mm'
    onChange: (date: string) => void;
    onClose: () => void;
}

export function DatePicker({ selectedDate, onChange, onClose }: DatePickerProps) {
    const [currentMonth, setCurrentMonth] = useState(selectedDate ? new Date(selectedDate) : new Date());
    const [mode, setMode] = useState<'date' | 'time'>('date');
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
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const startDay = startOfMonth(currentMonth).getDay(); // 0 is Sunday
    const emptyDays = Array(startDay).fill(null);

    const handleSelectDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        // Preserve time if it exists
        if (selectedDate && selectedDate.includes('T')) {
            const timePart = selectedDate.split('T')[1];
            onChange(`${dateStr}T${timePart}`);
        } else {
            onChange(dateStr);
        }
        // Switch to time mode automatically for better flow? 
        // No, user can click tab if they want time.
    };

    const handleTimeChange = (time: string) => {
        const datePart = selectedDate ? selectedDate.split('T')[0] : format(new Date(), 'yyyy-MM-dd');
        onChange(`${datePart}T${time}`);
    };

    const handleRemoveTime = () => {
        if (selectedDate && selectedDate.includes('T')) {
            onChange(selectedDate.split('T')[0]);
        }
    };

    const quickSelect = (option: 'today' | 'tomorrow' | 'weekend' | 'nextWeek') => {
        const today = new Date();
        let targetDate = today;

        switch (option) {
            case 'today': targetDate = today; break;
            case 'tomorrow': targetDate = addDays(today, 1); break;
            case 'weekend': targetDate = nextSaturday(today); break;
            case 'nextWeek': targetDate = nextMonday(today); break;
        }
        handleSelectDate(targetDate);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={clsx(
                "w-[340px] bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/5",
            )}
            ref={containerRef}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            {/* Header Tabs */}
            <div className="flex items-center border-b border-white/5 p-1 mx-2 mt-2 bg-white/5 rounded-xl text-xs font-medium relative">
                <button
                    onClick={() => setMode('date')}
                    className={clsx(
                        "flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all relative z-10",
                        mode === 'date' ? "text-white" : "text-white/40 hover:text-white/60"
                    )}
                >
                    <CalendarIcon size={14} /> Date
                </button>
                <div className="w-px h-4 bg-white/10" />
                <button
                    onClick={() => setMode('time')}
                    className={clsx(
                        "flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all relative z-10",
                        mode === 'time' ? "text-white" : "text-white/40 hover:text-white/60"
                    )}
                >
                    <Clock size={14} /> Time
                </button>

                {/* Animated Tab Background */}
                <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-y-1 bg-white/10 rounded-lg shadow-sm"
                    initial={false}
                    animate={{
                        right: mode === 'date' ? '50%' : '4px',
                        left: mode === 'date' ? '4px' : 'calc(50% + 2px)',
                        width: 'calc(50% - 6px)'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            </div>

            <div className="p-5">
                <AnimatePresence mode="wait">
                    {mode === 'date' ? (
                        <motion.div
                            key="date-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        >
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
                                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
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
                        </motion.div>
                    ) : (
                        <motion.div
                            key="time-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TimePicker
                                value={selectedDate && selectedDate.includes('T') ? selectedDate.split('T')[1] : ''}
                                onChange={handleTimeChange}
                            />

                            {selectedDate && selectedDate.includes('T') && (
                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-center">
                                    <button onClick={handleRemoveTime} className="text-xs text-red-300/80 hover:text-red-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10">
                                        Remove Time Only
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-center">
                    {selectedDate && (
                        <button onClick={() => { onChange(''); onClose(); }} className="text-xs text-white/40 hover:text-red-400 transition-colors flex items-center gap-1.5">
                            <X size={12} /> Clear Date & Time
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

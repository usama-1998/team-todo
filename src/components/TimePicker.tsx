import clsx from 'clsx';

interface TimePickerProps {
    value: string; // "HH:mm" (24h format) or empty
    onChange: (time: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
    // State derivation
    const hours24 = value ? parseInt(value.split(':')[0]) : 12;
    const minutes = value ? parseInt(value.split(':')[1]) : 0;

    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minuteSteps = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10... 55
    const periods = ['AM', 'PM'];

    const handleTimeChange = (h: number, m: number, p: string) => {
        let newHour24 = h;
        if (p === 'PM' && h !== 12) newHour24 += 12;
        if (p === 'AM' && h === 12) newHour24 = 0;

        const timeStr = `${newHour24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        onChange(timeStr);
    };

    return (
        <div className="h-[200px] flex gap-2 relative">
            {/* Hours */}
            <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar active:cursor-grabbing snap-y snap-mandatory py-[80px]">
                {hours.map(h => (
                    <button
                        key={`h-${h}`}
                        onClick={() => handleTimeChange(h, minutes, period)}
                        className={clsx(
                            "h-10 shrink-0 flex items-center justify-center rounded-lg transition-all snap-center",
                            h === hours12
                                ? "bg-white/20 text-white font-bold scale-110"
                                : "text-white/30 hover:text-white/60"
                        )}
                    >
                        {h}
                    </button>
                ))}
            </div>

            {/* Separator */}
            <div className="flex items-center justify-center text-white/20 font-bold text-xl pb-1">:</div>

            {/* Minutes */}
            <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar active:cursor-grabbing snap-y snap-mandatory py-[80px]">
                {minuteSteps.map(m => (
                    <button
                        key={`m-${m}`}
                        onClick={() => handleTimeChange(hours12, m, period)}
                        className={clsx(
                            "h-10 shrink-0 flex items-center justify-center rounded-lg transition-all snap-center",
                            m === minutes
                                ? "bg-white/20 text-white font-bold scale-110"
                                : "text-white/30 hover:text-white/60"
                        )}
                    >
                        {m.toString().padStart(2, '0')}
                    </button>
                ))}
            </div>

            {/* Separator */}
            <div className="w-px bg-white/5 my-4" />

            {/* Period */}
            <div className="flex-1 flex flex-col gap-1 items-center justify-center">
                {periods.map(p => (
                    <button
                        key={p}
                        onClick={() => handleTimeChange(hours12, minutes, p)}
                        className={clsx(
                            "h-12 w-full rounded-xl transition-all font-medium text-sm flex items-center justify-center",
                            p === period
                                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                                : "text-white/30 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        {p}
                    </button>
                ))}
            </div>

            {/* Selection Highlight Overlay (Visual only, maybe) */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-white/5 pointer-events-none rounded-lg border border-white/5" />
        </div>
    );
}

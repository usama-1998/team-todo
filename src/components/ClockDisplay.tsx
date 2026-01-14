export function ClockDisplay({ label, time }: { label: string, time: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase mb-0.5">{label}</span>
            <span className="text-2xl font-light tracking-wider font-mono">{time}</span>
        </div>
    );
}

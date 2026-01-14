import { ClockDisplay } from './ClockDisplay';
import { useStore } from '../store';
import { CheckCircle2 } from 'lucide-react';

interface HeaderProps {
    pktTime: string;
    sgtTime: string;
}

export function Header({ pktTime, sgtTime }: HeaderProps) {
    const { tasks } = useStore();
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="flex justify-between items-center mb-4 w-full border-b border-white/5 pb-4">
            <div className="flex gap-8 items-center">
                <ClockDisplay label="PKT" time={pktTime} />
                <div className="w-px h-10 bg-white/10"></div>
                <ClockDisplay label="SGT" time={sgtTime} />
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                    <CheckCircle2 size={20} className="text-green-400" />
                    <div className="text-right">
                        <div className="text-lg font-light leading-none">{percentage}%</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Daily Progress</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

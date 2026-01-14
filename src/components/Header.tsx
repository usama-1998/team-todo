import { Cloud } from 'lucide-react';
import { ClockDisplay } from './ClockDisplay';

interface HeaderProps {
    pktTime: string;
    sgtTime: string;
    weather: { temp: number; code: number } | null;
}

export function Header({ pktTime, sgtTime, weather }: HeaderProps) {
    return (
        <div className="flex justify-between items-center mb-4 w-full border-b border-white/5 pb-4">
            <div className="flex gap-8 items-center">
                <ClockDisplay label="PKT" time={pktTime} />
                <div className="w-px h-10 bg-white/10"></div>
                <ClockDisplay label="SGT" time={sgtTime} />
            </div>

            <div className="flex items-center gap-4">
                {weather ? (
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                        <Cloud size={20} className="text-blue-300" />
                        <div className="text-right">
                            <div className="text-lg font-light leading-none">{weather.temp}°C</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Rahim Yar Khan</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-xs text-white/30">Loading weather...</div>
                )}
            </div>
        </div>
    );
}

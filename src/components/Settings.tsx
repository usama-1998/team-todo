import { X, Settings as SettingsIcon, User as UserIcon, Link as LinkIcon } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import type { User, Role } from '../types';

interface SettingsProps {
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    currentUser: User;
    switchUser: (role: Role) => void;
    background: string;
    setBackground: (bg: string) => void;
    customBgUrl: string;
    setCustomBgUrl: (url: string) => void;
    handleSaveSettings: () => void;
}

export function Settings({
    showSettings,
    setShowSettings,
    currentUser,
    switchUser,
    background,
    setBackground,
    customBgUrl,
    setCustomBgUrl,
    handleSaveSettings
}: SettingsProps) {
    const backgrounds = [
        { name: 'Aurora', url: '/background.png' },
        { name: 'Sunset', url: '/bg-sunset.png' },
        { name: 'Forest', url: '/bg-forest.png' },
    ];

    return (
        <>
            <div className="fixed bottom-8 right-8 flex items-center gap-4 z-20">
                <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium hover:border-white/30"
                >
                    <SettingsIcon size={18} />
                    Settings
                </button>

                <div className="relative group">
                    <button className="bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium flex items-center gap-2 hover:border-white/30">
                        <UserIcon size={18} />
                        <span>{currentUser.name}</span>
                    </button>
                    <div className="absolute bottom-full right-0 mb-3 w-36 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100 shadow-xl">
                        <button onClick={() => switchUser('HAMZA')} className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors border-b border-white/5">
                            Hamza (Admin)
                        </button>
                        <button onClick={() => switchUser('USAMA')} className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors">
                            Usama
                        </button>
                    </div>
                </div>
            </div>

            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light">Settings</h2>
                            <button onClick={() => setShowSettings(false)}><X size={24} className="text-white/50 hover:text-white" /></button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Background Image</label>
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {backgrounds.map(bg => (
                                        <button
                                            key={bg.name}
                                            onClick={() => { setBackground(bg.url); toast.success("Background applied"); }}
                                            className={clsx("h-16 rounded-lg bg-cover bg-center border-2 transition-all", background === bg.url ? "border-purple-500" : "border-transparent opacity-60 hover:opacity-100")}
                                            style={{ backgroundImage: `url('${bg.url}')` }}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={customBgUrl}
                                        onChange={e => setCustomBgUrl(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 text-sm"
                                        placeholder="Or enter Image URL..."
                                    />
                                    <button onClick={handleSaveSettings} className="bg-white/10 hover:bg-white/20 px-4 rounded-xl">
                                        <LinkIcon size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

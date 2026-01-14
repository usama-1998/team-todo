import { X, Settings as SettingsIcon, Link as LinkIcon } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

interface SettingsProps {
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    background: string;
    setBackground: (bg: string) => void;
    customBgUrl: string;
    setCustomBgUrl: (url: string) => void;
}

export function Settings({
    showSettings,
    setShowSettings,
    background,
    setBackground,
    customBgUrl,
    setCustomBgUrl,
}: SettingsProps) {
    const backgrounds = [
        { name: 'Aurora', url: '/background.png' },
        { name: 'Forest', url: 'https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Sunset', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Ocean', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Mountain', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop' },
        { name: 'City', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Minimal', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Desert', url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Rain', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Cyberpunk', url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Neon', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Zen', url: 'https://images.unsplash.com/photo-1528360983277-13d9b152c6d4?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Snow', url: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Library', url: 'https://images.unsplash.com/photo-1507842217121-9e9f14733ee5?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Coffee', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Road', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2936&auto=format&fit=crop' },
        { name: 'Sky', url: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=2940&auto=format&fit=crop' },
        { name: 'Geometric', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop' }
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
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {backgrounds.map(bg => (
                                        <button
                                            key={bg.name}
                                            onClick={() => { setBackground(bg.url); toast.success("Background applied"); }}
                                            className={clsx("h-16 rounded-lg bg-cover bg-center border-2 transition-all", background === bg.url ? "border-purple-500" : "border-transparent opacity-60 hover:opacity-100")}
                                            style={{ backgroundImage: `url('${bg.url}')` }}
                                        />
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={customBgUrl}
                                            onChange={e => setCustomBgUrl(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 text-sm"
                                            placeholder="Image URL or Search Term..."
                                        />
                                        <button
                                            onClick={() => {
                                                if (customBgUrl.startsWith('http')) {
                                                    setBackground(customBgUrl);
                                                } else {
                                                    setBackground(`https://loremflickr.com/1920/1080/${customBgUrl}`);
                                                }
                                                toast.success("Background updated");
                                                setShowSettings(false);
                                            }}
                                            className="bg-white/10 hover:bg-white/20 px-4 rounded-xl"
                                        >
                                            <LinkIcon size={18} />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-white/30 ml-2">Enter an image URL or a keyword (e.g. 'nature', 'city') to search.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

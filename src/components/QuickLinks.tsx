import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface QuickLink {
    id: string;
    title: string;
    url: string;
}

interface QuickLinksProps {
    links: QuickLink[];
    onAdd: (title: string, url: string) => void;
    onDelete: (id: string) => void;
}

export function QuickLinks({ links, onAdd, onDelete }: QuickLinksProps) {
    const [showAdd, setShowAdd] = useState(false);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && url) {
            let finalUrl = url;
            if (!url.startsWith('http')) finalUrl = `https://${url}`;
            onAdd(title, finalUrl);
            setTitle(''); setUrl(''); setShowAdd(false);
            toast.success("Link added");
        }
    };

    return (
        <div className="flex items-center gap-3">
            {links.map(link => (
                <div key={link.id} className="group relative">
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-black/20 hover:bg-white/10 transition-all backdrop-blur-md border border-white/5 hover:border-white/20 w-16 h-16 justify-center"
                    >
                        <img
                            src={`https://www.google.com/s2/favicons?sz=64&domain=${link.url}`}
                            alt={link.title}
                            className="w-6 h-6 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <span className="text-[10px] text-white/50 group-hover:text-white transition-colors truncate w-full text-center">{link.title}</span>
                    </a>
                    <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(link.id); }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                    >
                        <X size={10} />
                    </button>
                </div>
            ))}

            <div className="relative">
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 border-dashed hover:border-white/30 text-white/30 hover:text-white"
                >
                    <Plus size={20} />
                    <span className="text-[10px]">Add</span>
                </button>

                {showAdd && (
                    <div className="absolute top-full right-0 mt-2 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl w-60 z-50 shadow-2xl animate-in fade-in zoom-in-95">
                        <form onSubmit={handleAdd} className="space-y-2">
                            <input className="w-full bg-white/10 rounded border border-white/10 px-2 py-1 text-sm text-white" placeholder="Title (e.g. Gmail)" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
                            <input className="w-full bg-white/10 rounded border border-white/10 px-2 py-1 text-sm text-white" placeholder="URL (e.g. mail.google.com)" value={url} onChange={e => setUrl(e.target.value)} />
                            <button type="submit" className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-1.5 rounded">Add Link</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

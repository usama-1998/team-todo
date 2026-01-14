import { useStore } from '../store';

export function Greeting() {
    const { userName } = useStore();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl font-light tracking-tight text-white">
                {greeting}, <span className="font-medium bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">{userName}</span>
            </h1>
        </div>
    );
}

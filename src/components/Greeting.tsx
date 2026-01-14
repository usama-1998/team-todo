import { useState } from 'react';

export function Greeting() {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    // Simple quotes
    const quotes = [
        "Focus on the step in front of you, not the whole staircase.",
        "Discipline is doing what needs to be done, even if you don't want to do it.",
        "Small progress is still progress."
    ];
    const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-light tracking-tight text-white mb-2">
                {greeting}
            </h1>
            <p className="text-white/60 text-sm font-light italic">"{quote}"</p>
        </div>
    );
}

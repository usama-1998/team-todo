import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PopoverProps {
    isOpen: boolean;
    onClose: () => void;
    triggerRef: React.RefObject<any>;
    children: React.ReactNode;
    className?: string;
    align?: 'start' | 'center' | 'end';
}

export function Popover({ isOpen, onClose, triggerRef, children, className = '', align = 'start' }: PopoverProps) {
    const [style, setStyle] = useState<React.CSSProperties>({});
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !triggerRef.current) return;

        const updatePosition = () => {
            if (!triggerRef.current) return;
            const rect = triggerRef.current.getBoundingClientRect();

            // STRICT REQUEST: "Left side of the date"

            // Vertical alignment: Align top of popover with top of trigger
            // (Optional: Center vertically? Usually "left side" means side-by-side top aligned or centered)
            // Let's go with Top-Aligned for stability, or slightly adjusted if needed.
            let top = rect.top;

            // Horizontal alignment: 
            // Trigger Left Edge - some gap
            let left = rect.left - 8;

            // Transform: Move it 100% of its own width to the left so it sits *before* the trigger
            let xTransform = '-100%';
            let yTransform = '0%';

            const transformOrigin = 'top right';

            // Collision check (Basic):
            // If it goes off the left edge (left < width?), we might simple stick to this for now as requested.
            // If screen is too narrow (mobile), "Left" might be bad.
            // However, user specifically asked for "Left side". 
            // Mobile consideration: If window.innerWidth < 768, maybe keep it centered/modal?
            // For this specific request, I will enforce Left.

            setStyle({
                top: `${top}px`,
                left: `${left}px`,
                transform: `translate(${xTransform}, ${yTransform})`,
                position: 'fixed',
                zIndex: 9999,
                transformOrigin,
            });
        };

        updatePosition();

        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, triggerRef, align]);

    if (!isOpen) return null;

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-[9998] bg-transparent"
                onClick={onClose}
            />
            <div
                ref={contentRef}
                className={className}
                style={style}
                onClick={(e) => e.stopPropagation()}
            // Start hidden until positioned to avoid flash? 
            // Or just performant enough.
            >
                {/* 
                  Wrapper for "Flip to top" logic if we wanted advanced positioning 
                  For now we just use the calculated top/left
                */}
                {/* Logic for flipping requires knowing height. 
                     Refined approach: Just check if (top > window.innerHeight / 2) flip?
                     For now, let's Stick to the simpler "render below" logic unless it goes off screen.
                     If we need to flip upwards, we can set `bottom` instead of `top`.
                  */}
                {children}
            </div>
        </>,
        document.body
    );
}

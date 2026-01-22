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

    // Use useLayoutEffect to measure and position before paint to avoid flickering
    useEffect(() => {
        if (!isOpen || !triggerRef.current) return;

        const updatePosition = () => {
            if (!triggerRef.current) return;
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const contentRect = contentRef.current?.getBoundingClientRect();

            // Standard "Left side" positioning
            // Default: Align top of popover with top of trigger (minus offset)
            let top = triggerRect.top - 40;
            let left = triggerRect.left - 8;

            // Transform: Move it 100% of its own width to the left
            const xTransform = '-100%';
            const yTransform = '0%';

            // Vertical Collision Detection
            if (contentRect) {
                const viewportHeight = window.innerHeight;
                const popoverHeight = contentRect.height;
                const bottomEdge = top + popoverHeight;

                // If popover goes below the viewport, shift it up
                if (bottomEdge > viewportHeight - 20) { // 20px padding
                    // Calculate new top to fit in viewport
                    // We try to align bottom of popover with bottom of viewport (minus padding)
                    top = Math.max(20, viewportHeight - popoverHeight - 20);
                }
            }

            setStyle({
                top: `${top}px`,
                left: `${left}px`,
                transform: `translate(${xTransform}, ${yTransform})`,
                position: 'fixed',
                zIndex: 9999,
                // transformOrigin: 'top right', // Removed to let standard flow work better with shifting
            });
        };

        // Run immediately
        updatePosition();

        // Also wait for next frame to ensure content is rendered/sized if it wasn't valid yet
        // (This helps if height wasn't available in first pass)
        const rafId = requestAnimationFrame(updatePosition);

        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            cancelAnimationFrame(rafId);
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

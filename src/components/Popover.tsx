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
            const viewportHeight = window.innerHeight;
            const popoverHeight = 350; // Estimated height

            // Default: Placement ABOVE the trigger
            // Start at the top of the trigger
            let top = rect.top - 8;
            // Move up by 100% of popover height
            let yTransform = '-100%';
            let transformOrigin = 'bottom';

            // Horizontal Alignment Logic
            let left = rect.left;
            let xTransform = '0%';
            let horizontalOrigin = 'left';

            if (align === 'center') {
                left = rect.left + rect.width / 2;
                xTransform = '-50%';
                horizontalOrigin = 'center';
            } else if (align === 'end') {
                left = rect.right;
                xTransform = '-100%';
                horizontalOrigin = 'right';
            }

            transformOrigin = `${transformOrigin} ${horizontalOrigin}`;

            // Collision Detection
            // If space above is insufficient (top - popoverHeight < 0 approx, or just check rect.top)
            // AND there is enough space below...
            const spaceAbove = rect.top;
            const spaceBelow = viewportHeight - rect.bottom;

            if (spaceAbove < popoverHeight && spaceBelow > popoverHeight) {
                // Flip to BELOW
                top = rect.bottom + 8;
                yTransform = '0%';
                transformOrigin = transformOrigin.replace('bottom', 'top');
            }

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

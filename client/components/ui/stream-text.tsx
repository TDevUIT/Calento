'use client';

import React, { useState, useEffect, useRef } from 'react';

interface StreamTextProps {
    content: string;
    speed?: number;
    onComplete?: () => void;
    children: (text: string) => React.ReactNode;
}

export const StreamText = ({
    content,
    speed = 15,
    onComplete,
    children
}: StreamTextProps) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const indexRef = useRef(0);
    const contentRef = useRef(content);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // If content changes significantly (e.g. new message), reset
        if (content !== contentRef.current) {
            contentRef.current = content;
            indexRef.current = 0;
            setDisplayedContent('');
        }
    }, [content]);

    useEffect(() => {
        // If we've displayed everything, trigger complete
        if (indexRef.current >= content.length) {
            if (onComplete) onComplete();
            return;
        }

        timerRef.current = setInterval(() => {
            if (indexRef.current >= content.length) {
                if (timerRef.current) clearInterval(timerRef.current);
                if (onComplete) onComplete();
                return;
            }

            // Add next character
            const nextChar = content.charAt(indexRef.current);
            setDisplayedContent((prev) => prev + nextChar);
            indexRef.current += 1;

            // Speed up for long content or specific characters if needed
            // but keeping it simple for now
        }, speed);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [content, speed, onComplete]);

    // If content is empty, just render empty
    if (!content) return <>{children('')}</>;

    return <>{children(displayedContent)}</>;
};

import React, { useState, useEffect } from 'react';
import './MotivationSentences.scss';

const MESSAGES = [
    'Unlock a world of possibilities.',
    "Discover what you've been missing.",
    'Ready to elevate your experience?',
    'Streamline your life, one click at a time.',
    'Experience perfect order.',
    'Bring clarity to your chaos.',
    'Your organized future starts here.',
    'Join us and transform your workflow.',
    'Sign up today and see the difference.',
    "Get started now, it's free and easy.",
];

const MotivationSentences = () => {
    // inside hte component itself
    const [index, setIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsVisible(false);
        }, 4000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (isVisible) return;

        const timeoutId = setTimeout(() => {
            setIndex((prevIndex) => (prevIndex + 1) % MESSAGES.length);
            setIsVisible(true);
        }, 600);

        return () => clearTimeout(timeoutId);
    }, [isVisible]);

    return (
        <div className={`Motivation-Sentences ${isVisible ? 'visible' : 'hidden'}`}>
            <h2 className="sentences">{MESSAGES[index]}</h2>
        </div>
    );
};

export default MotivationSentences;

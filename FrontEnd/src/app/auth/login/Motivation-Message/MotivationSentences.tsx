import React, { useState, useEffect } from 'react';

const MotivationSentences = () => {
    const messages = [
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

    const [index, setIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % messages.length);
                setIsVisible(true);
            }, 600);
        }, 4000);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className={`Motivation-Sentences ${isVisible ? 'visible' : 'hidden'}`}>
            <h2 className="sentences">{messages[index]}</h2>
        </div>
    );
};

export default MotivationSentences;

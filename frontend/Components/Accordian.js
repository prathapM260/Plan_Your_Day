import React, { useState } from 'react';

const Accordion = ({ data = [] }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="w-full mx-auto mt-8 border border-gray-300 rounded">
            {data.map((item, index) => (
                <div key={item.id} className="border-b border-gray-300">
                    <div
                        className="p-4 bg-gray-100 cursor-pointer font-bold"
                        onClick={() => handleToggle(index)}
                    >
                        {item.title}
                    </div>
                    {activeIndex === index && (
                        <div className="p-4 bg-white">
                            {item.body}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Accordion;

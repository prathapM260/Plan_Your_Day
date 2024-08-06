import React, { useState, useEffect } from 'react';
import Accordion from './Accordian'; // Ensure the correct path

const PreAccordian = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/posts");
                const result = await response.json();
                setData(result);
                console.log("Received data:", result);
            } catch (error) {
                console.error("Error fetching data:", error);
                console.log("Data not fetched");
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-center my-4">This is Accordion example</h1>
            <Accordion data={data} />
        </div>
    );
}

export default PreAccordian;

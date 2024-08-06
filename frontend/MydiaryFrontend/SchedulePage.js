import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedules, setSchedules] = useState({});
  const [newSchedule, setNewSchedule] = useState('');

  // Fetch schedules from backend
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('/api/goals', { params: { date: selectedDate } });
        setSchedules(prevSchedules => ({
          ...prevSchedules,
          [selectedDate]: response.data,
        }));
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleInputChange = (event) => {
    setNewSchedule(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page refresh

    try {
      const response = await axios.post('/api/goals', {
        date: selectedDate,
        content: { addtopic: newSchedule },
      });
      setSchedules(prevSchedules => ({
        ...prevSchedules,
        [selectedDate]: [...(prevSchedules[selectedDate] || []), response.data],
      }));
      setNewSchedule('');
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  return (
    <div>
      <h1>Schedule for {selectedDate}</h1>
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
      />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newSchedule}
          onChange={handleInputChange}
          placeholder="Add new schedule"
        />
        <button type="submit">Add Schedule</button>
      </form>
      <ul>
        {(schedules[selectedDate] || []).map((schedule, index) => (
          <li key={index}>{schedule.content.addtopic}</li>
        ))}
      </ul>
    </div>
  );
};

export default SchedulePage;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Calendar from './Calendar';
// import { useNavigate } from 'react-router-dom';

// const HomePage = () => {
//   const [schedules, setSchedules] = useState({});
//   const [message, setMessage] = useState({ text: '', id: '' });
//   const [date, setDate] = useState(new Date());
//   const [editingItem, setEditingItem] = useState({ id: '', isEditing: false });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSchedule = async (selectedDate) => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/goals?date=${selectedDate}`);
//         console.log('Fetched data:', response.data); // Debugging
//         setSchedules((prevSchedules) => ({
//           ...prevSchedules,
//           [selectedDate]: response.data
//         }));
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setSchedules((prevSchedules) => ({
//           ...prevSchedules,
//           [selectedDate]: []
//         }));
//       }
//     };
//     const formattedDate = date.toISOString().split('T')[0];
//     fetchSchedule(formattedDate);
//   }, [date]);

//   const changeMessage = (e) => {
//     setMessage({ ...message, text: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!message.text) return;

//     const formattedDate = date.toISOString().split('T')[0];

//     if (editingItem.isEditing) {
//       await handleEdit(formattedDate);
//     } else {
//       try {
//         const response = await axios.post('http://localhost:5000/api/goals', {
//           date: formattedDate,
//           content: { addtopic: message.text },
//         });
//         setSchedules((prevSchedules) => ({
//           ...prevSchedules,
//           [formattedDate]: [...(prevSchedules[formattedDate] || []), response.data]
//         }));
//         setMessage({ text: '', id: '' });
//       } catch (error) {
//         console.error('Error submitting data:', error);
//       }
//     }
//   };

//   const handleEdit = async (date) => {
//     try {
//       const response = await axios.put(`http://localhost:5000/api/goals/${editingItem.id}`, {
//         content: { addtopic: message.text },
//       });
//       setSchedules((prevSchedules) => ({
//         ...prevSchedules,
//         [date]: prevSchedules[date].map((item) => (item._id === editingItem.id ? response.data : item))
//       }));
//       setMessage({ text: '', id: '' });
//       setEditingItem({ id: '', isEditing: false });
//     } catch (error) {
//       console.error('Error editing data:', error);
//     }
//   };

//   const handleDelete = async (id, date) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/goals/${id}`);
//       setSchedules((prevSchedules) => ({
//         ...prevSchedules,
//         [date]: prevSchedules[date].filter((item) => item._id !== id)
//       }));
//     } catch (error) {
//       console.error('Error deleting data:', error);
//     }
//   };

//   const handleEditState = (id, date) => {
//     const itemToEdit = schedules[date].find((item) => item._id === id);
//     if (itemToEdit) {
//       setMessage({ text: itemToEdit.content?.addtopic || '', id: itemToEdit._id });
//       setEditingItem({ id: itemToEdit._id, isEditing: true });
//     }
//   };

//   const handleMonthChange = (direction) => {
//     const newDate = new Date(date);
//     newDate.setMonth(date.getMonth() + direction);
//     setDate(newDate);
//   };

//   const handleDayClick = (day) => {
//     const newDate = new Date(date);
//     newDate.setDate(day);
//     setDate(newDate);
//   };

//   const handleIncludeContent = (id) => {
//     navigate(`/include-content/${id}`);
//   };

//   const handleViewFullPage = (e) => {
//     e.preventDefault();
//     navigate('/detailed-page');
//   };

//   const formattedDate = date.toISOString().split('T')[0];
//   const list = schedules[formattedDate] || [];

//   console.log('List for today:', list); // Debugging

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex flex-col sm:flex-row">
//         <Calendar date={date} handleMonthChange={handleMonthChange} handleDayClick={handleDayClick} />
//         <div className="w-full sm:w-3/4 border p-4 bg-sky-200" style={{ borderTop: '10px solid orange' }}>
//           <h2 className="text-lg font-bold mb-4">Today's Schedule ({date.toDateString()})</h2>
//           <form className="mb-4" onSubmit={handleSubmit}>
//             <div className="flex items-center">
//               <input
//                 type="text"
//                 value={message.text}
//                 onChange={changeMessage}
//                 placeholder="Enter your schedule"
//                 className="border p-2 flex-1"
//               />
//               {editingItem.isEditing ? (
//                 <button
//                   onClick={handleEdit}
//                   className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
//                 >
//                   Edit
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
//                 >
//                   Add
//                 </button>
//               )}
//             </div>
//           </form>
//           <ul>
//             {list.map((item) => (
//               <li key={item._id} className="border p-2 mb-2">
//                 <div className="flex justify-between items-center">
//                   <span className="flex-1">{item.content?.addtopic || 'No topic'}</span>
//                   <button
//                     className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
//                     onClick={() => handleIncludeContent(item._id)}
//                   >
//                     Include Content
//                   </button>
//                   <button
//                     className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
//                     onClick={() => handleEditState(item._id, formattedDate)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="bg-red-500 text-white px-2 py-1 rounded ml-2"
//                     onClick={() => handleDelete(item._id, formattedDate)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded mt-4"
//             onClick={handleViewFullPage}
//           >
//             View Full Page
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;








import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from './Calendar'; // Assume this is the Calendar component
import backgroundImage from "../Components/OIP.jpeg" // Import the background image

const HomePage = () => {
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [message, setMessage] = useState({ text: '', id: '' });
  const [editingItem, setEditingItem] = useState({ id: '', isEditing: false });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const formattedDate = date.toISOString().split('T')[0];
        console.log("Fetching schedule for date:", formattedDate);
    
        const response = await axios.get(`http://localhost:5000/api/goals?date=${formattedDate}`);
        console.log("Data from backend:", response.data);
    
        if (response.data && response.data.length > 0) {
          setSchedules(response.data);
        } else {
          console.log("No schedules found for the specified date.");
          setSchedules([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setSchedules([]);
      }
    };

    fetchSchedule();
  }, [date]); // Fetch schedule when the date changes

  const changeMessage = (e) => {
    setMessage({ ...message, text: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.text.trim()) return; // Ensure there's text before submission

    const formattedDate = date.toISOString().split('T')[0];

    if (editingItem.isEditing) {
      await handleEdit(formattedDate);
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/goals', {
          date: formattedDate,
          addtopic: message.text.trim(), // Ensure addtopic is being sent correctly
        });

        if (response.status === 201) { // Check for successful creation
          setSchedules((prevSchedules) => [...prevSchedules, response.data]);
          setMessage({ text: '', id: '' });
        } else {
          console.error('Failed to add schedule:', response.statusText);
        }
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    }
  };

  const handleEdit = async (formattedDate) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/goals/${editingItem.id}`, {
        date: formattedDate,
        addtopic: message.text.trim(), // Ensure addtopic is updated correctly
      });
      setSchedules((prevSchedules) =>
        prevSchedules.map((item) => (item._id === editingItem.id ? response.data : item))
      );
      setMessage({ text: '', id: '' });
      setEditingItem({ id: '', isEditing: false });
    } catch (error) {
      console.error('Error editing data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/goals/${id}`);
      setSchedules((prevSchedules) => prevSchedules.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleEditState = (item) => {
    setMessage({ text: item.addtopic || '', id: item._id });
    setEditingItem({ id: item._id, isEditing: true });
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + direction);
    setDate(newDate);
  };

  const handleDayClick = (day) => {
    const newDate = new Date(date);
    newDate.setDate(day);
    setDate(newDate);
  };

  const handleIncludeContent = (id) => {
    navigate(`/include-content/${id}`);
  };

  const handleViewFullPage = () => {
    const formattedDate = date.toISOString().split('T')[0];
    navigate(`/detailed-page?date=${formattedDate}`);
  };

  return (
    <div className="container mx-auto p-4" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="text-center my-4">
        <h1 className="text-2xl font-bold">Make Your Schedule</h1>
      </div>
      <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg p-4" style={{ borderTop: '10px solid orange', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <Calendar date={date} handleMonthChange={handleMonthChange} handleDayClick={handleDayClick} />
        <div className="w-full sm:w-3/4 border p-4 bg-sky-200" style={{ borderTop: '10px solid orange' }}>
          <h2 className="text-lg font-bold mb-4">Today's Schedule ({date.toDateString()})</h2>
          <form className="mb-4" onSubmit={handleSubmit}>
            <div className="flex items-center">
              <input
                type="text"
                value={message.text}
                onChange={changeMessage}
                placeholder="Enter your schedule"
                className="border p-2 flex-1"
              />
              {editingItem.isEditing ? (
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                >
                  Edit
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                >
                  Add
                </button>
              )}
            </div>
          </form>
          <ul>
            {schedules.map((item) => (
              <li key={item._id} className="border p-2 mb-2">
                <div className="flex justify-between items-center">
                  <span className="flex-1">{item.addtopic || 'No topic'}</span>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() => handleIncludeContent(item._id)}
                  >
                    Include Content
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() => handleEditState(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            onClick={handleViewFullPage}
          >
            View Full Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

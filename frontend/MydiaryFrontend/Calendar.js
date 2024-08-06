import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Calendar = ({ date, handleMonthChange, handleDayClick }) => {
  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const renderCalendar = () => {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const days = daysInMonth(currentMonth + 1, currentYear);
    const currentDay = date.getDate();

    let daysArray = [];
    for (let day = 1; day <= days; day++) {
      daysArray.push(
        <div
          key={day}
          className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border border-gray-300 cursor-pointer transition duration-200 ease-in-out transform hover:-translate-y-1 ${
            day === currentDay ? 'bg-blue-600 text-white rounded-full shadow-lg' : 'hover:bg-blue-600'
          }`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      );
    }
    return daysArray;
  };

  return (
    <div className="w-full sm:w-1/3 md:w-1/4 lg:w-2/5 xl:w-1/3 p-4 bg-white shadow-lg rounded-lg overflow-hidden border-t-8 border-orange-500">
      <h2 className="text-xl font-bold mb-4 text-center">Calendar</h2>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleMonthChange(-1)}
          className="text-xl p-2 hover:bg-blue-300 rounded-full transition duration-200 ease-in-out"
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-md font-bold flex-1 text-center">
          {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
        </h2>
        <button
          onClick={() => handleMonthChange(1)}
          className="text-xl p-2 hover:bg-blue-300 rounded-full transition duration-200 ease-in-out"
        >
          <FaChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-blue-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">{renderCalendar()}</div>
      <h2 className="text-md text-center font-bold mt-4">Selected date: {date.toDateString()}</h2>
    </div>
  );
};

export default Calendar;

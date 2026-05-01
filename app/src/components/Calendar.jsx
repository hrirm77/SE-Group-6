import React, { useState } from 'react';
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO
} from 'date-fns';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';

const Calendar = ({ meals, onEdit, toggleForm }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  const handlePrevWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleHome = () => {
    navigate('/');
  };

  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(currentDate, { weekStartsOn: 0 });

  const days = [];
  let day = startDate;
  for (let i = 0; i < 7; i++) {
    days.push(day);
    day = addDays(day, 1);
  }

  const dateFormat = "MMM d"; 
  const yearFormat = "yyyy";
  const dateRangeString = `${format(startDate, dateFormat)} - ${format(endDate, dateFormat)}, ${format(endDate, yearFormat)}`;

  return (
    <>
      <div style={{ color: '#aaa', fontSize: '24px', margin: '0 0 20px 20px', textAlign: 'left', width: '100%', maxWidth: '1000px', margin: '0 auto 20px' }}>
        Calendar Page
      </div>
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="btn-home" onClick={handleHome}>Home</button>
        </div>

        <div className="calendar-nav-row">
          <div className="calendar-nav-left">
            <button className="nav-btn" onClick={handlePrevWeek}>&lt;</button>
            <button className="nav-btn" onClick={handleNextWeek}>&gt;</button>
            <button className="nav-btn" onClick={handleToday}>Today</button>
            <div className="nav-text">{dateRangeString}</div>
          </div>
          <div>
            <button className="btn-add-meal" onClick={toggleForm}>Add Meal</button>
          </div>
        </div>

        <div className="calendar-grid">
          {days.map((d, index) => {
            const dayMeals = meals.filter((meal) => {
              if (!meal.day) return false;
              // Ensure day parses properly. It's expected to be YYYY-MM-DD from type="date"
              try {
                // Also check if meal.day includes timezone which might shift it
                // type="date" saves as "YYYY-MM-DD". parseISO handles it as local midnight.
                // Wait, parseISO ("2026-03-29") gives midnight local time.
                const mealDate = parseISO(meal.day);
                return isSameDay(mealDate, d);
              } catch (e) {
                return false;
              }
            });

            return (
              <div className="calendar-col" key={index}>
                <div className="calendar-col-header">
                  <span>{format(d, 'EEE')}</span>
                  <span>{format(d, 'M/d')}</span>
                </div>
                {dayMeals.map((meal) => (
                  <div className="calendar-meal-item" key={meal._id} onClick={() => onEdit(meal)}>
                     <span className="meal-type">{meal.dishType || "Meal"}</span>
                     <span className="meal-name">{meal.name}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Calendar;

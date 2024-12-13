import React, { useState, useEffect } from "react";
import {
  createWorkDayWithFirstInterval,
  getWorkDaysForCurrentMonth,
} from "../api/api";

const Calendar = () => {
  const [workDays, setWorkDays] = useState([]);

  useEffect(() => {
    const fetchWorkDays = async () => {
      try {
        const data = await getWorkDaysForCurrentMonth();
        setWorkDays(data);
      } catch (error) {
        console.error("Error fetching workdays:", error);
      }
    };

    fetchWorkDays();
  }, []);

  const handleCreateWorkDay = async () => {
    try {
      const newWorkDay = await createWorkDayWithFirstInterval();
      setWorkDays([...workDays, newWorkDay]);
    } catch (error) {
      console.error("Error creating workday:", error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateWorkDay}>Check In</button>
      <div className="workday-cards">
        {workDays.map((workDay) => (
          <div key={workDay.id} className="workday-card">
            <h3>WorkDay: {workDay.day}</h3>
            <ul>
              {workDay.intervals.map((interval) => (
                <li key={interval.id}>
                  Start: {interval.startTime}, End: {interval.endTime}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;

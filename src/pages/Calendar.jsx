import React from "react";
import "./Calendar.css";
import { useNavigate } from "react-router-dom";
import {
  userDetails,
  createWorkDayWithFirstInterval,
  getWorkDaysForCurrentMonth,
} from "../api/api";
import { useState, useEffect } from "react";

const Calendar = () => {
  const navigate = useNavigate();

  const handleHomeButton = () => {
    navigate("/home");
  };

  const handleProfileButton = () => {
    navigate("/perfil");
  };

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
  const createAutoWorkdayCalendar = async () => {
    try {
      const user = await userDetails();
      const flexible = user.flexible;
      if (!flexible) {
        const response = await createWorkDayWithFirstInterval();
        return response;
      }
    } catch (error) {
      console.error("Workday creation error", error);
    }
  };

  return (
    <>
      <div>
        <nav className="navbar">
          <div className="navbar-links">
            <button className="nav-btn" onClick={handleHomeButton}>
              Home
            </button>
            <button className="nav-btn" onClick={handleProfileButton}>
              Profile
            </button>
          </div>
        </nav>
      </div>
      <div>
        <h1>Calendar</h1>
        <button onClick={createAutoWorkdayCalendar}>Create Auto Workday</button>

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
    </>
  );
};
export default Calendar;

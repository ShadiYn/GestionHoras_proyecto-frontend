import React from "react";
import "./Calendar.css";
import { useNavigate } from "react-router-dom";
import {
  createWorkDayWithFirstInterval,
  getWorkDaysForCurrentMonth,
  getCurrentInterval,
  handleCheckOut,
} from "../api/api";
import { useState, useEffect } from "react";

const Calendar = () => {
  const navigate = useNavigate();
  const [workDays, setWorkDays] = useState([]);
  const [interval, setIntervals] = useState(null);

  const handleHomeButton = () => {
    navigate("/home");
  };

  const handleProfileButton = () => {
    navigate("/perfil");
  };

  const getWorkDays = async () => {
    try {
      const data = await getWorkDaysForCurrentMonth();
      setWorkDays(data);
    } catch (error) {
      console.error("Error getting workdays:", error);
    }
  };

  useEffect(() => {
    getWorkDays();
  }, []);

  const handleCreateWorkDay = async () => {
    try {
      await createWorkDayWithFirstInterval();
      const interval = await getCurrentInterval();
      console.log("Last interval:", interval);
      setIntervals(interval);
      getWorkDays();
    } catch (error) {
      console.error("Error creating workday:", error);
    }
  };

  const checkOut = async (intervalId) => {
    try {
      const endInterval = await handleCheckOut(intervalId);
      console.log("End interval:", endInterval);
    } catch (error) {
      console.error("Error checking out:", error);
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
        <button onClick={handleCreateWorkDay}>Check In</button>
        <div className="workday-cards">
          {workDays && workDays.length > 0 ? (
            workDays.map((workDay) => (
              <div key={workDay.id} className="workday-card">
                <h3>WorkDay: {workDay.day}</h3>
                <ul>
                  <li>
                    {interval && (
                      <div className="interval-card">
                        <h3>Intervals</h3>
                        <p>Start: {interval.start_time}</p>
                        <p>End: {interval.end_time}</p>
                      </div>
                    )}
                  </li>
                </ul>
                <button
                  onClick={() => {
                    handleCheckOut(interval.id);
                  }}
                >
                  Check Out
                </button>
              </div>
            ))
          ) : (
            <p>No workdays available.</p>
          )}
        </div>
      </div>
    </>
  );
};
export default Calendar;

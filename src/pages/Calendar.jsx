import "./Calendar.css";
import { useNavigate } from "react-router-dom";
import {
  createWorkDayWithFirstInterval,
  getWorkDaysForCurrentMonth,
  getCurrentInterval,
  handleCheckOut,
  getIntervalsForWorkDay,
} from "../api/api";
import { useState, useEffect } from "react";

const Calendar = () => {
  const navigate = useNavigate();
  const [workDays, setWorkDays] = useState([]);
  const [interval, setInterval] = useState(null);
  const [selectedWorkDay, setSelectedWorkDay] = useState(null);
  const [workDayIntervals, setWorkDayIntervals] = useState([]);

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
    const fetchCurrentInterval = async () => {
      try {
        const currentInterval = await getCurrentInterval();
        setInterval(currentInterval);
      } catch (error) {
        console.error("Error fetching current interval:", error);
      }
    };
    fetchCurrentInterval();
  }, []);

  const handleCreateWorkDay = async () => {
    if (interval && !interval.end_time) {
      alert("You must check out before checking in again.");
      return;
    }
    try {
      const newWorkDay = await createWorkDayWithFirstInterval();
      const interval = await getCurrentInterval();
      console.log("Last interval:", interval);
      setInterval(interval);
      setSelectedWorkDay(newWorkDay.id); // Set the new workday as selected
      getWorkDays();
    } catch (error) {
      console.error("Error creating workday:", error);
    }
  };

  const handleCheckOutButton = async (intervalId) => {
    if (!interval || interval.end_time) {
      alert("You must check in before checking out.");
      return;
    }
    try {
      const updatedInterval = await handleCheckOut(intervalId);
      console.log("Updated interval:", updatedInterval);
      setInterval((prevInterval) => {
        if (prevInterval && prevInterval.id === intervalId) {
          return {
            ...prevInterval,
            end_time: updatedInterval.data,
          };
        }
        return prevInterval;
      });
      console.log("Updated interval end_time:", updatedInterval.data);
      getWorkDays(); // Refresh workdays to reflect the updated interval
    } catch (error) {
      console.error("Error checking out:", error);
    }
  };

  const handleWorkDayClick = async (workDayId) => {
    if (selectedWorkDay === workDayId) {
      setSelectedWorkDay(null);
      setWorkDayIntervals([]);
    } else {
      setSelectedWorkDay(workDayId);
      const intervals = await getIntervalsForWorkDay(workDayId);
      setWorkDayIntervals(intervals);
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
                <h3>{workDay.day}</h3>
                <ul>
                  {workDay.day === new Date().toISOString().split("T")[0] && (
                    <div className="interval-card">
                      <h3>Intervals</h3>
                      <p>Start: {interval ? interval.start_time : "N/A"}</p>
                      <p>End: {interval ? interval.end_time : "N/A"}</p>
                    </div>
                  )}
                </ul>

                {workDay.day === new Date().toISOString().split("T")[0] && (
                  <button
                    className="calendar-button"
                    onClick={async () => {
                      await handleCheckOutButton(interval.id);
                    }}
                  >
                    Check Out
                  </button>
                )}
                <button onClick={() => handleWorkDayClick(workDay.id)}>
                  {selectedWorkDay === workDay.id
                    ? "Hide Intervals"
                    : "Show Intervals"}
                </button>
                {selectedWorkDay === workDay.id && (
                  <div className="workday-intervals">
                    {workDayIntervals.length > 0 ? (
                      workDayIntervals.map((interval) => (
                        <div key={interval.id} className="interval-card">
                          <p>Start: {interval.start_time}</p>
                          <p>End: {interval.end_time}</p>
                        </div>
                      ))
                    ) : (
                      <p>No intervals available for this workday.</p>
                    )}
                  </div>
                )}
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

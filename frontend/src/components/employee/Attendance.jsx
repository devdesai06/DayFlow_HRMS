import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AttendanceCalendar = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchYearAttendance();
  }, []);

  const fetchYearAttendance = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/attendance/year",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (res.data.success) {
      const map = {};

      res.data.attendance.forEach((item) => {
        const date = new Date(item.date).toISOString().split("T")[0];
        map[date] = item.status;
      });

      setAttendanceData(map);
    }
  };

  const handleDayClick = (date) => {
    navigate(`/employee-dashboard/apply-for-leave?date=${date}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Attendance Calendar</h2>

      {[...Array(12)].map((_, month) => (
        <MonthGrid
          key={month}
          month={month}
          attendanceData={attendanceData}
          onDayClick={handleDayClick}
        />
      ))}
    </div>
  );
};

const MonthGrid = ({ month, attendanceData, onDayClick }) => {
  const year = new Date().getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getColor = (status) => {
    if (status === "Present") return "bg-green-400";
    if (status === "Absent") return "bg-red-400";
    if (status === "Half Day") return "bg-yellow-400";
    return "bg-gray-200";
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">
        {new Date(year, month).toLocaleString("default", { month: "long" })}
      </h3>

      <div className="grid grid-cols-7 gap-2">
        {[...Array(daysInMonth)].map((_, day) => {
          const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day + 1
          ).padStart(2, "0")}`;

          const status = attendanceData[date];

          return (
            <div
              key={day}
              onClick={() => onDayClick(date)}
              className={`p-2 text-center rounded cursor-pointer ${getColor(
                status
              )}`}
            >
              {day + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getSummary = () => {
  let present = 0;
  let absent = 0;

  Object.values(attendanceData).forEach((status) => {
    if (status === "Present") present++;
    else if (status === "Absent") absent++;
  });

  return { present, absent };
};

export default AttendanceCalendar;
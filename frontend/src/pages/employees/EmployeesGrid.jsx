import { useEffect, useState } from "react";
import EmployeeCard from "../../components/EmployeeCard";
import { fetchEmployees } from "../../services/employee.service";

export default function EmployeesGrid() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees().then((data) => {
      setEmployees(data);
    });
  }, []);

  return (
    <div>
      <h2>Employees</h2>

      <div style={gridStyle}>
        {employees.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "16px",
};

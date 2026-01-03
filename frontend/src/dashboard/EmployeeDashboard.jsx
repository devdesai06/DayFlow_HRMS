import DashboardLayout from "../layouts/DashboardLayout";
import EmployeesGrid from "../pages/employees/EmployeesGrid";

export default function EmployeeDashboard() {
  return (
    <DashboardLayout>
      <EmployeesGrid />
    </DashboardLayout>
  );
}

import React, { useState } from "react";
import { Users, UserPlus } from "lucide-react";
import AddEmployee from "./AddEmployee.jsx";
import EmployeeList from "./EmployeeList.jsx";

const EmployeeManagement = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setActiveTab("list");
    setRefreshKey(k => k + 1);
  };

  const tabs = [
    { id: "list", label: "Employee Directory", icon: Users },
    { id: "add", label: "Add Employee", icon: UserPlus },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
          Employee Management
        </h1>
        <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
          Manage your workforce — add new employees and view the full directory.
        </p>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: "flex", gap: "4px", background: "#f1f5f9", borderRadius: "12px",
        padding: "4px", marginBottom: "28px", width: "fit-content",
      }}>
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "9px 18px", borderRadius: "9px", border: "none",
                cursor: "pointer", fontSize: "13.5px", fontWeight: isActive ? 600 : 500,
                background: isActive ? "#ffffff" : "transparent",
                color: isActive ? "#4f46e5" : "#64748b",
                boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s", fontFamily: "'Inter', sans-serif",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "list" ? (
        <div style={{
          background: "#fff", borderRadius: "16px", padding: "24px",
          border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}>
          <EmployeeList refreshKey={refreshKey} />
        </div>
      ) : (
        <AddEmployee onSuccess={handleSuccess} />
      )}
    </div>
  );
};

export default EmployeeManagement;

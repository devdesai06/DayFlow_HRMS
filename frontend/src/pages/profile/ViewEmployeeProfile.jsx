import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchEmployeeById,
  fetchMyProfile,
} from "../../services/employee.service";

export default function ViewEmployeeProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = id
          ? await fetchEmployeeById(id)
          : await fetchMyProfile();

        setEmployee(data);
      } catch (err) {
        console.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [id]);

  if (!employee) return <p>Loading profile...</p>;

  return (
    <div style={containerStyle}>
      <h2>Employee Profile</h2>

      <img
        src={employee.avatar || "/avatar.png"}
        alt="avatar"
        style={avatarStyle}
      />

      <div style={formStyle}>
        <ProfileField label="Name" value={employee.name} />
        <ProfileField label="Email" value={employee.email} />
        <ProfileField label="Phone" value={employee.phone} />
        <ProfileField label="Role" value={employee.role} />
        <ProfileField label="Department" value={employee.department} />
        <ProfileField label="Status" value={employee.status} />
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div style={fieldStyle}>
      <label>{label}</label>
      <input value={value || "-"} disabled />
    </div>
  );
}

const containerStyle = {
  maxWidth: "500px",
  margin: "0 auto",
  background: "#111",
  padding: "20px",
  borderRadius: "8px",
};

const avatarStyle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  display: "block",
  margin: "10px auto",
};

const formStyle = {
  display: "grid",
  gap: "12px",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
};

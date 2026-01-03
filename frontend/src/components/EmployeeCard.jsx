import { useNavigate } from "react-router-dom";

export default function EmployeeCard({ employee }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/employee/profile/${employee.id}`);
  };

  return (
    <div style={cardStyle} onClick={handleClick}>
      <div style={statusDot(employee.status)} />

      <img
        src={employee.avatar || "/avatar.png"}
        alt="avatar"
        style={avatarStyle}
      />

      <p style={{ margin: "10px 0 0" }}>{employee.name}</p>
      <p style={{ fontSize: "12px", opacity: 0.7 }}>
        {employee.role}
      </p>
    </div>
  );
}

const statusDot = (status) => ({
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  background:
    status === "PRESENT"
      ? "green"
      : status === "LEAVE"
      ? "orange"
      : "red",
});

const cardStyle = {
  background: "#111",
  padding: "15px",
  borderRadius: "8px",
  textAlign: "center",
  position: "relative",
  cursor: "pointer",
};

const avatarStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  objectFit: "cover",
};

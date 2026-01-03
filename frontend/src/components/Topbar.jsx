import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfile = () => {
    setOpen(false);
    navigate("/employee/profile");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={topbarStyle}>
      <div></div>

      <div style={{ position: "relative" }}>
        <img
          src={user?.avatar || "/avatar.png"}
          alt="avatar"
          style={avatarStyle}
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div style={dropdownStyle}>
            <div style={itemStyle} onClick={handleProfile}>
              My Profile
            </div>
            <div style={itemStyle} onClick={handleLogout}>
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const topbarStyle = {
  height: "60px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
  borderBottom: "1px solid #333",
};

const avatarStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  cursor: "pointer",
};

const dropdownStyle = {
  position: "absolute",
  right: 0,
  top: "45px",
  background: "#111",
  border: "1px solid #333",
  borderRadius: "6px",
  width: "140px",
  zIndex: 10,
};

const itemStyle = {
  padding: "10px",
  cursor: "pointer",
  borderBottom: "1px solid #222",
};

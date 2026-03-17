import React, { useState } from "react";
import axios from "axios";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Vishvam Modi",
    role: "UI/UX Designer",
    bio: "Designing clean and user-friendly interfaces 🚀",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("https://via.placeholder.com/120");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return; // ✅ prevent crash

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("role", profile.role);
      formData.append("bio", profile.bio);

      if (image) {
        formData.append("profileImage", image);
      }

      await axios.put("http://localhost:5000/api/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Profile</h1>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>
          )}
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-6">

          {/* Image */}
          <div className="relative">
            <img
              src={preview}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border"
            />

            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-black text-white text-xs px-2 py-1 rounded cursor-pointer">
                Change
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Info */}
          <div className="w-full">

            {isEditing ? (
              <>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />

                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) =>
                    setProfile({ ...profile, role: e.target.value })
                  }
                  className="border p-2 rounded w-full mt-2"
                />

                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  className="border p-2 rounded w-full mt-2"
                />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-gray-500">{profile.role}</p>
                <p className="text-sm text-gray-400 mt-1">{profile.bio}</p>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
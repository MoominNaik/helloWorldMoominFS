import { useAppContext } from "../AppContext";
import { useAuth } from "../AuthContext";
import React, { useState, useEffect } from "react";

const Profile = () => {
  const { user, setUser } = useAuth();
  const { userPosts, fetchUserPosts } = useAppContext();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    designation: "",
    bio: "",
    emailAddress: "",
    profilePic: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user's posts when user is loaded
  useEffect(() => {
    if (user && user.id) {
      fetchUserPosts(user.id);
    }
  }, [user, fetchUserPosts]);

  // Fetch profile details once user is loaded
  useEffect(() => {
    if (!user || !user.username) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:9091/api/profile/${user.username}`, {
          headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          setForm(f => ({ ...f, ...data }));
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-black">
      {/* Profile Section */}
      <div className="w-full max-w-5xl mx-auto flex items-center space-x-8 mb-6">
        {/* Profile Picture */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-lg shadow-lg overflow-hidden">
          {form.profilePic ? (
            <img
              src={form.profilePic.startsWith("http") ? form.profilePic : `http://localhost:9091${form.profilePic}`}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            "Profile Pic"
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{user?.name || user?.username || "User"}</h1>
          <p className="text-gray-300">{user?.email}</p>
          <p className="text-gray-400 mt-2">{form.designation}</p>
          <p className="text-gray-400 mt-2">{form.bio}</p>

          {/* Stats */}
          <div className="flex space-x-6 mt-4">
            <div>
              <p className="text-xl font-bold text-green-400">{userPosts.length}</p>
              <p className="text-gray-400">Posts</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-400">-</p>
              <p className="text-gray-400">Followers</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-400">-</p>
              <p className="text-gray-400">Following</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => setEditOpen(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Profile Popup */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-4 right-4 text-white text-xl font-bold cursor-pointer"
              onClick={() => setEditOpen(false)}
              aria-label="Close"
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Edit Profile</h2>
            {error && <div className="text-green-500 mb-2 text-center">{error}</div>}
            <form
              onSubmit={async e => {
                e.preventDefault();
                setLoading(true);
                setError("");
                try {
                  const token = localStorage.getItem("token");
                  const res = await fetch("http://localhost:9091/api/profile/edit", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify(form)
                  });
                  if (!res.ok) throw new Error("Profile update failed");
                  const saved = await res.json();
                  setForm(f => ({ ...f, ...saved }));
                  setError("Profile updated");
                  setTimeout(() => {
                    setError("");
                    setEditOpen(false);
                  }, 1500);
                } catch (err) {
                  setError("Profile update failed");
                  console.error(err);
                } finally {
                  setLoading(false);
                }
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                required
              />
              <input
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={form.emailAddress}
                onChange={e => setForm(f => ({ ...f, emailAddress: e.target.value }))}
                className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                required
              />
              <input
                type="text"
                placeholder="Designation"
                value={form.designation}
                onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
              />
              <textarea
                placeholder="Bio"
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                rows={3}
              />
              <label className="text-gray-400 mb-1">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                onChange={async e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setLoading(true);
                  setError("");
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const token = localStorage.getItem("token");
                    const res = await fetch("http://localhost:9091/api/images/upload", {
                      method: "POST",
                      headers: {
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                      },
                      body: formData
                    });
                    if (!res.ok) throw new Error("Image upload failed");
                    const data = await res.json();
                    setForm(f => ({ ...f, profilePic: data.url || data.path || data.imageUrl || "" }));
                  } catch {
                    setError("Image upload failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              />
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div className="w-full max-w-5xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-white mb-6">Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPosts.length === 0 && (
            <div className="text-gray-400 col-span-full text-center text-lg">No posts yet.</div>
          )}
          {userPosts.map((post, idx) => (
            <div key={post.id || post.title + idx} className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg">
              <div className="w-full h-40 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                {post.pimage || post.image ? (
                  <img
                    src={`http://localhost:9091${post.pimage || post.image}`}
                    alt={post.pname || post.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span>Image</span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">{post.pname || post.title}</h3>
              <p className="text-gray-400 text-sm mb-1">{post.pdescription || post.description}</p>
              <div className="text-xs text-gray-500 mb-1">Stack: {post.pStack || post.stack}</div>
              <div className="text-xs text-green-400">Category: {post.pCategory || post.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
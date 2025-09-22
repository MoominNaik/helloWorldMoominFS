import { useAppContext } from "../AppContext";
import { useAuth } from "../AuthContext";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    email: "",
    profilePicUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user && user.id) {
      fetchUserPosts(user.id);
    }
  }, [user?.id]);

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
  }, [user?.username]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 md:p-10 bg-black font-mono text-green-400">
      
      {/* Profile Section */}
      <div className="w-full max-w-7xl mb-16 px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-start w-full space-y-10 md:space-y-0 pb-8 border-b-2 border-gray-900">
        
        {/* Profile Picture */}
        <div className="w-40 h-40 rounded bg-gradient-to-r from-green-500 to-teal-400 flex items-center justify-center text-white text-lg shadow-2xl overflow-hidden mr-12">
          {form.profilePicUrl ? (
            <img
              src={form.profilePicUrl.startsWith("http") ? form.profilePicUrl : `http://localhost:9091${form.profilePicUrl}`}
              alt="Profile"
              className="w-full h-full object-cover rounded"
            />
          ) : (
            "Profile Pic"
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col md:flex-row justify-between items-start w-full md:pl-12">
          <div className="flex flex-col items-start w-full max-w-3xl space-y-4">
            <h1 className="text-4xl font-bold">{user?.name || user?.username || "User"}</h1>
            <p className="text-gray-300">{form.email || user?.email}</p>
            <p className="text-gray-400">{form.designation}</p>
            <p className="text-gray-400">{form.bio}</p>

            {/* Posts Count */}
            <div className="flex space-x-8 mt-4">
              <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
                <p className="text-xl font-bold text-green-400">{userPosts.length}</p>
                <p className="text-gray-400">Posts</p>
              </motion.div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <motion.button
            className="mt-4 px-4 py-1 text-green-400 font-medium text-sm hover:text-green-300 transition-colors self-start md:mt-0"
            onClick={() => setEditOpen(true)}
            whileHover={{ scale: 1.03, textShadow: "0px 0px 8px #00FF7F" }}
          >
            Edit Profile
          </motion.button>
        </div>
        </div>
      </div>

      {/* Edit Profile Popup */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-md p-10 w-full max-w-md shadow-2xl relative">
            <button
              className="absolute top-4 right-4 text-green-400 text-xl font-bold cursor-pointer"
              onClick={() => {
                setEditOpen(false);
                setError("");
              }}
              aria-label="Close"
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Edit Profile</h2>
            {error && <div className="text-green-400 mb-4 text-center">{error}</div>}
            <form
              onSubmit={async e => {
                e.preventDefault();
                setLoading(true);
                setError("");
                try {
                  const token = localStorage.getItem("token");
                  const payload = {
                    username: form.username,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    designation: form.designation,
                    bio: form.bio,
                  };
                  const res = await fetch("http://localhost:9091/api/profile/edit", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify(payload)
                  });
                  if (!res.ok) throw new Error("Profile update failed");
                  const saved = await res.json();
                  setForm(f => ({ ...f, ...saved }));
                  // Keep AuthContext in sync for email shown elsewhere
                  setUser(prev => prev ? { ...prev, email: saved.email } : prev);
                  setError("");
                  setSuccess("Profile updated");
                  setTimeout(() => {
                    setSuccess("");
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
              <input type="text" placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="px-4 py-2 rounded-sm bg-gray-800 text-green-300 focus:outline-none focus:ring-1 focus:ring-green-400" required />
              <input type="text" placeholder="First Name" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="px-4 py-2 rounded-sm bg-gray-800 text-green-300 focus:outline-none focus:ring-1 focus:ring-green-400" required />
              <input type="text" placeholder="Last Name" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="px-4 py-2 rounded-sm bg-gray-800 text-green-300 focus:outline-none focus:ring-1 focus:ring-green-400" required />
              <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="px-4 py-2 rounded-sm bg-gray-800 text-green-300 focus:outline-none focus:ring-1 focus:ring-green-400" required />
              <input type="text" placeholder="Designation" value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} className="px-4 py-2 rounded-sm bg-gray-800 text-green-300 focus:outline-none focus:ring-1 focus:ring-green-400" />
              <textarea placeholder="Bio" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="px-4 py-2 rounded-sm bg-gray-800 text-green-300 focus:outline-none focus:ring-1 focus:ring-green-400" rows={3} />
              <label className="text-green-400 mb-1">Profile Image</label>
              <input type="file" accept="image/*" className="px-4 py-2 rounded-sm bg-gray-800 text-green-300 focus:outline-none focus:ring-1 focus:ring-green-400" onChange={async e => {
                const file = e.target.files[0];
                if (!file) return;
                setLoading(true);
                setError("");
                try {
                  const formData = new FormData();
                  formData.append("file", file);
                  const token = localStorage.getItem("token");
                  const res = await fetch("http://localhost:9091/api/profile/upload", {
                    method: "POST",
                    headers: { ...(token ? { "Authorization": `Bearer ${token}` } : {}) },
                    body: formData
                  });
                  if (!res.ok) throw new Error("Image upload failed");
                  const data = await res.json();
                  // Expecting ProfileDTO with profilePicUrl
                  setForm(f => ({ ...f, ...data }));
                  setSuccess("Image uploaded");
                  setTimeout(() => setSuccess(""), 1500);
                } catch {
                  setError("Image upload failed");
                } finally {
                  setLoading(false);
                }
              }} />
              <motion.button type="submit" className="mt-4 px-4 py-1 text-green-300 rounded-sm font-medium hover:text-green-100 transition-all border border-green-400 hover:border-green-300" whileHover={{ scale: 1.05, textShadow: "0px 0px 8px #00FF7F" }} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </motion.button>
            </form>
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div className="w-full max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-green-400 mb-8 text-center">Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {userPosts.length === 0 && (
            <div className="text-gray-400 col-span-full text-center text-lg">No posts yet.</div>
          )}
          {userPosts.map((post, idx) => (
            <motion.div key={post.id || post.title + idx} className="bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-700 hover:shadow-green-500/40 transition-all cursor-pointer w-full" whileHover={{ scale: 1.03, boxShadow: "0 0 20px #00FF7F" }}>
              <div className="w-full h-52 bg-gradient-to-r from-green-500/20 to-teal-400/20 rounded-lg mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
                {post.pimage || post.image ? (
                  <img src={`http://localhost:9091${post.pimage || post.image}`} alt={post.pname || post.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span>Image</span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-green-300 mb-1">{post.pname || post.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{post.pdescription || post.description}</p>
              <div className="text-xs text-green-400 mb-1">Stack: {post.pStack || post.stack}</div>
              <div className="text-xs text-green-400">Category: {post.pCategory || post.category}</div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Success Toast */}
      {success && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-black px-4 py-2 rounded-sm shadow-[0_0_10px_0_#00FF7F] font-mono z-50">
          {success}
        </div>
      )}
    </div>
  );
};

export default Profile;
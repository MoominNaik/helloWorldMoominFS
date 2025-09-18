import React, { useState } from "react";
import { useAppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CATEGORIES = [
  "Web Development",
  "AI / Machine Learning",
  "Cybersecurity",
  "Mobile Apps",
  "DevOps",
  "Game Development",
  "Data Science",
  "Blockchain",
  "IoT",
  "Cloud Computing",
  "AR / VR",
  "Other",
];

const PostProject = () => {
  const { CURRENT_USER } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    stack: "",
    image: null,
    category: "Web Development",
  });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((f) => ({ ...f, image: files[0] }));
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    // Prepare data for backend
    const postData = {
      title: form.name,
      description: form.description,
      stack: form.stack,
      category: form.category,
      image: form.image ? form.image.name : null,
    };
    try {
      // Send post to backend using CURRENT_USER from context
      await axios.post(`http://localhost:9091/api/posts?authorId=${CURRENT_USER.id}`, postData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 1200);
      setForm({ name: "", description: "", stack: "", image: null, category: "Web Development" });
      setPreview(null);
    } catch (err) {
      setError("Failed to post. Try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-8 w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-green-400 mb-2 text-center">Post a New Project</h2>
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.name}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Project Description"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="stack"
          placeholder="Project Stack (e.g. React, Node.js, MongoDB)"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.stack}
          onChange={handleChange}
        />
        <div>
          <label className="block text-gray-400 mb-1">Project Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full text-gray-300"
            onChange={handleChange}
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-3 rounded-lg max-h-40 mx-auto" />
          )}
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Project Category</label>
          <select
            name="category"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        {success && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-green-500 rounded-xl shadow-lg p-8 text-center">
              <div className="text-green-400 text-lg font-bold mb-2">Project posted successfully!</div>
              <div className="text-gray-300">Redirecting to your profile...</div>
            </div>
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 rounded-lg shadow-md transition text-white font-medium"
          disabled={submitting}
        >
          {submitting ? "Posting..." : "Post Project"}
        </button>
      </form>
    </div>
  );
};

export default PostProject;

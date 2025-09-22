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
      setForm((f) => ({ ...f, image: files?.[0] || null }));
      setPreview(files?.[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setForm((f) => ({ ...f, [name]: value ?? "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    let imagePath = null;
    try {
      if (form.image) {
        const fd = new FormData();
        fd.append("file", form.image);
        const uploadRes = await axios.post(
          "http://localhost:9091/api/uploads",
          fd
        );
        // Backend returns { imageUrl: "/uploads/<storedName>", filename: "<storedName>" }
        imagePath = uploadRes?.data?.imageUrl || null;
      }
    } catch (err) {
      console.error("Image upload failed", err);
      setError("Image upload failed. Try again.");
      setSubmitting(false);
      return;
    }

    const postData = {
      title: form.name,
      description: form.description,
      stack: form.stack,
      category: form.category,
      // Store a path or URL in the image field (backend model has only `image`)
      image: imagePath, // e.g. "/uploads/<name>" or null
    };

    try {
      await axios.post(`http://localhost:9091/api/posts?authorId=${CURRENT_USER.id}`, postData);
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1200);
      setForm({ name: "", description: "", stack: "", image: null, category: "Web Development" });
      setPreview(null);
    } catch (err) {
      console.error("Create post failed", err);
      setError("Failed to post. Try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 font-mono">
      <h2 className="text-3xl font-bold text-green-400 mb-10 text-center">
        Say Hello to the World
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 w-full max-w-3xl mx-auto space-y-6 font-mono text-green-400 transition-all duration-200 shadow-[0_0_15px_#00FF7F] hover:shadow-[0_0_30px_#00FF7F] rounded-lg"
      >
  
  <input
    type="text"
    name="name"
    placeholder="Project Name"
    className="w-full px-4 py-2 rounded-sm bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-green-400"
    value={form.name ?? ""}
    onChange={handleChange}
  />
  
  <textarea
    name="description"
    placeholder="Project Description"
    className="w-full px-4 py-2 rounded-sm bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-green-400 min-h-[100px]"
    value={form.description ?? ""}
    onChange={handleChange}
  />

  <input
    type="text"
    name="stack"
    placeholder="Project Stack (e.g. React, Node.js)"
    className="w-full px-4 py-2 rounded-sm bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-green-400"
    value={form.stack ?? ""}
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
    {preview && <img src={preview} alt="Preview" className="mt-3 rounded-sm max-h-40 mx-auto" />}
  </div>

  <div>
    <label className="block text-gray-400 mb-1">Project Category</label>
    <select
      name="category"
      className="w-full px-4 py-2 rounded-sm bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-green-400"
      value={form.category ?? "Web Development"}
      onChange={handleChange}
    >
      {CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  </div>

  <button
    type="submit"
    className="w-full py-3 font-mono text-xl font-bold text-black bg-green-500 shadow-none hover:shadow-[0_0_20px_#00FF7F] transition-all duration-200"
    disabled={submitting}
  >
  Post
</button>
</form>
    </div>
  );
};

export default PostProject;
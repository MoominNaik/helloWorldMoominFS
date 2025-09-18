import React, { useState } from "react";
import { Link } from "react-router-dom";

const PROFILES = [
  {
    id: 1,
    name: "Alice Johnson",
    title: "Frontend Developer",
    bio: "Passionate about building beautiful UIs with React and Tailwind.",
    posts: 12,
    followers: 320,
    following: 180,
    image: null,
  },
  {
    id: 2,
    name: "Bob Smith",
    title: "AI/ML Engineer",
    bio: "Loves deep learning, NLP, and open source.",
    posts: 8,
    followers: 210,
    following: 95,
    image: null,
  },
  {
    id: 3,
    name: "Charlie Lee",
    title: "Cybersecurity Specialist",
    bio: "Securing the web, one app at a time.",
    posts: 15,
    followers: 400,
    following: 220,
    image: null,
  },
  {
    id: 4,
    name: "Diana Patel",
    title: "Full Stack Developer",
    bio: "Building scalable apps with MERN stack.",
    posts: 20,
    followers: 500,
    following: 300,
    image: null,
  },
];

const ProfileCard = ({ profile }) => (
  <Link to={`/public-profile/${profile.id}`} className="block">
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg flex flex-col items-center hover:border-green-400 transition">
      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-lg shadow-lg mb-4">
        {profile.image ? (
          <img src={profile.image} alt={profile.name} className="w-full h-full object-cover rounded-full" />
        ) : (
          <span>{profile.name[0]}</span>
        )}
      </div>
      <h1 className="text-2xl font-bold text-white mb-1">{profile.name}</h1>
      <p className="text-green-400 font-medium mb-2">{profile.title}</p>
      <p className="text-gray-300 text-center mb-4">{profile.bio}</p>
      <div className="flex space-x-6 mb-4">
        <div className="text-center">
          <p className="text-xl font-bold text-green-400">{profile.posts}</p>
          <p className="text-gray-400 text-sm">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-green-400">{profile.followers}</p>
          <p className="text-gray-400 text-sm">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-green-400">{profile.following}</p>
          <p className="text-gray-400 text-sm">Following</p>
        </div>
      </div>
    </div>
  </Link>
);

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const filtered = PROFILES.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.title.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-black p-10">
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search users by name or title..."
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {filtered.length === 0 && (
          <div className="text-gray-400 col-span-full text-center text-lg">No profiles found.</div>
        )}
        {filtered.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;

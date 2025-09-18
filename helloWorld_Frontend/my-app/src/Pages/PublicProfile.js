import React from "react";
import { useParams } from "react-router-dom";

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

const PublicProfile = () => {
  const { id } = useParams();
  const profile = PROFILES.find((p) => p.id === Number(id));
  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400 text-xl">Profile not found.</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-black">
      <div className="w-full max-w-5xl mx-auto flex items-center space-x-8 mb-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-lg shadow-lg">
          {profile.image ? (
            <img src={profile.image} alt={profile.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span>{profile.name[0]}</span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
          <p className="text-green-400 font-medium">{profile.title}</p>
          <p className="text-gray-400 mt-2">{profile.bio}</p>
          <div className="flex space-x-6 mt-4">
            <div>
              <p className="text-xl font-bold text-green-400">{profile.posts}</p>
              <p className="text-gray-400">Posts</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-400">{profile.followers}</p>
              <p className="text-gray-400">Followers</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-400">{profile.following}</p>
              <p className="text-gray-400">Following</p>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 rounded-lg shadow-md transition text-white font-medium">
              Follow
            </button>
            <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg shadow-md transition text-white font-medium">
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;

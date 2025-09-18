
import { useAppContext } from "../AppContext";
import { useAuth } from "../AuthContext";
import { useEffect } from "react";

const Profile = () => {
  const { user } = useAuth();
  const { userPosts, fetchUserPosts } = useAppContext();

  useEffect(() => {
    if (user && user.id) {
      fetchUserPosts(user.id);
    }
  }, [user, fetchUserPosts]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-black">
      {/* Profile Section */}
      <div className="w-full max-w-5xl mx-auto flex items-center space-x-8 mb-6">
        {/* Profile Picture */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-lg shadow-lg">
          Profile Pic
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{user?.name || user?.username || "User"}</h1>
          <p className="text-gray-300">{user?.email}</p>
          {/* Optionally add more user details here */}

          {/* Stats */}
          <div className="flex space-x-6 mt-4">
            <div>
              <p className="text-xl font-bold text-green-400">{userPosts.length}</p>
              <p className="text-gray-400">Posts</p>
            </div>
            {/* Followers/Following can be dynamic if available in user context */}
            <div>
              <p className="text-xl font-bold text-green-400">-</p>
              <p className="text-gray-400">Followers</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-400">-</p>
              <p className="text-gray-400">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="w-full max-w-5xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-white mb-6">Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPosts.length === 0 && (
            <div className="text-gray-400 col-span-full text-center text-lg">No posts yet.</div>
          )}
          {userPosts.map((post, idx) => (
            <div key={post.title + idx} className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg">
              <div className="w-full h-40 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                {post.image ? (
                  <span>{post.image}</span>
                ) : (
                  <span>Image</span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">{post.title}</h3>
              <p className="text-gray-400 text-sm mb-1">{post.description}</p>
              <div className="text-xs text-gray-500 mb-1">Stack: {post.stack}</div>
              <div className="text-xs text-green-400">Category: {post.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
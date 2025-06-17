import React, { useEffect, useState } from 'react';
import { 
  Heart, ListChecks, History, User, Film, Tv, BookOpen, Book, 
  Mail, MapPin, Calendar, Clock, Edit3, Share2, Bell, 
  Settings, MoreHorizontal, MessageCircle, Award, Bookmark, Grid
} from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import { MediaStats } from '../components/MediaStats';
import { Header } from '../components/Header';
import FavouritePage from './FavouritePage';

// Custom Chart component since it's not available in lucide-react
const Chart = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
};

export default function Profile() {
  const [mediaItems, setMediaItems] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  let decoded;
  const token = localStorage.getItem("token");
  if (token) {
    decoded = jwtDecode(token);
  }
  
  useEffect(() => {
    // Fetch data on component mount
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchMediaItems(), fetchUserInfo()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const fetchMediaItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/media');
      const data = await response.json();
      const filteredData = data.filter(item => String(item.id) === String(decoded.id));
      setMediaItems(filteredData);
    } catch (error) {
      console.error('Error fetching media:', error);
    } 
  };
  
  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/`);
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    } 
  };

  const userData = userInfo.find(item => String(item.id) === String(decoded?.id)) || {};
  
  // Sample bio text if not available in userData
  const userBio = userData.bio || "Hi there! I'm a passionate media enthusiast who loves tracking and discovering new content. I enjoy discussing my favorite shows, movies, novels, and manga with fellow fans. Feel free to connect with me to share recommendations!";

  // Sample recent activity data
  const recentActivity = [
    { type: 'movie', title: 'Inception', action: 'watched', date: '2 days ago', rating: 4.5 },
    { type: 'show', title: 'Breaking Bad', action: 'added to favorites', date: '1 week ago', rating: 5 },
    { type: 'novel', title: 'The Alchemist', action: 'finished reading', date: '3 weeks ago', rating: 4 },
    { type: 'manga', title: 'One Piece', action: 'updated progress', date: '1 month ago', rating: 4.5 }
  ];

  // Sample media recommendations
  const recommendations = [
    { id: 1, type: 'movie', title: 'The Shawshank Redemption', image: '/api/placeholder/300/450', rating: 4.8 },
    { id: 2, type: 'show', title: 'Game of Thrones', image: '/api/placeholder/300/450', rating: 4.7 },
    { id: 3, type: 'novel', title: 'To Kill a Mockingbird', image: '/api/placeholder/300/450', rating: 4.6 },
    { id: 4, type: 'manga', title: 'Attack on Titan', image: '/api/placeholder/300/450', rating: 4.9 }
  ];

  // Render stars for ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  // Navigation helper for Link replacement
  const navigateTo = (path) => {
    console.log(`Navigating to: ${path}`);
    // This would be replaced with actual navigation in a real app
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Header />

      {/* Cover Photo Area */}
      <div className="relative h-80 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="absolute inset-0 opacity-20 bg-[url('/api/placeholder/1600/400')]"></div>
        <div className="container mx-auto px-6 h-full flex items-end pb-20">
          {/* Cover content is empty - profile info is in the next section */}
        </div>
      </div>

      {/* Profile Header - Positioned to overlap the cover photo */}
      <div className="container mx-auto px-6 -mt-16 mb-6 relative z-10">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={userData.profilePic || "/api/placeholder/200/200"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-800">{userData.firstname || "User"} {userData.lastname || ""}</h1>
              <p className="text-gray-600">@{userData.username || userData.firstname?.toLowerCase() || "user"}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">Media Enthusiast</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active Member</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button onClick={() => navigateTo('/messages')} className="bg-white text-indigo-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 shadow-sm border border-gray-200">
                <MessageCircle size={18} />
                <span>Message</span>
              </button>
              <button onClick={() => navigateTo('/edit-profile')} className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm">
                <Edit3 size={18} />
                <span>Edit Profile</span>
              </button>
              <button className="bg-white text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition shadow-sm border border-gray-200">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User size={18} className="mr-2 text-indigo-600" />
                About
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center">
                  <Calendar size={16} className="text-indigo-500 mr-3 flex-shrink-0" />
                  <span className="font-medium">Age:</span>
                  <span className="ml-auto">{userData.age || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <User size={16} className="text-indigo-500 mr-3 flex-shrink-0" />
                  <span className="font-medium">Gender:</span>
                  <span className="ml-auto">{userData.gender || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="text-indigo-500 mr-3 flex-shrink-0" />
                  <span className="font-medium">Location:</span>
                  <span className="ml-auto">{userData.Location || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="text-indigo-500 mr-3 flex-shrink-0" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-auto text-sm truncate">{userData.email || "user@example.com"}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="text-indigo-500 mr-3 flex-shrink-0" />
                  <span className="font-medium">Last Online:</span>
                  <span className="ml-auto text-green-600 font-medium">{userData.lastOnline || "Now"}</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Award size={16} className="mr-2 text-indigo-600" />
                  Badges
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Movie Buff</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Bookworm</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">TV Expert</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Manga Fan</span>
                </div>
              </div>
            </div>

            {/* Media Stats Card */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Chart size={18} className="mr-2 text-indigo-600" />
                Media Stats
              </h2>
              <MediaStats mediaItems={mediaItems} />
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Bookmark size={18} className="mr-2 text-indigo-600" />
                Quick Links
              </h2>
              <div className="space-y-2">
                <button onClick={() => navigateTo('/discover')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center text-gray-700">
                  <Film size={16} className="mr-3 text-indigo-500" />
                  Discover New Media
                </button>
                <button onClick={() => navigateTo('/friends')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center text-gray-700">
                  <User size={16} className="mr-3 text-indigo-500" />
                  Find Friends
                </button>
                <button onClick={() => navigateTo('/settings')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center text-gray-700">
                  <Settings size={16} className="mr-3 text-indigo-500" />
                  Account Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow mb-6">
              <div className="flex overflow-x-auto">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 font-medium whitespace-nowrap flex items-center ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid size={18} className="mr-2" />
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('activity')}
                  className={`px-6 py-4 font-medium whitespace-nowrap flex items-center ${activeTab === 'activity' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <History size={18} className="mr-2" />
                  Recent Activity
                </button>
                <button 
                  onClick={() => setActiveTab('collections')}
                  className={`px-6 py-4 font-medium whitespace-nowrap flex items-center ${activeTab === 'collections' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <ListChecks size={18} className="mr-2" />
                  Collections
                </button>
                <button 
                  onClick={() => setActiveTab('favourites')}
                  className={`px-6 py-4 font-medium whitespace-nowrap flex items-center ${activeTab === 'favourites' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Heart size={18} className="mr-2" />
                  Favourites
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'overview' && (
              <>
                {/* Bio Section */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <User size={18} className="mr-2 text-indigo-600" />
                      About Me
                    </h2>
                    <button className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50">
                      <Edit3 size={18} />
                    </button>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{userBio}</p>
                </div>

                {/* Track Section */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Bookmark size={18} className="mr-2 text-indigo-600" />
                    Track Media
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Movie */}
                    <div onClick={() => navigateTo('/track?type=movie')} className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-100 hover:shadow-md transition transform hover:translate-y-[-2px] h-full">
                        <div className="bg-red-100 p-3 rounded-full mb-3">
                          <Film size={28} className="text-red-500" />
                        </div>
                        <span className="font-medium text-gray-800">Movies</span>
                        <p className="text-gray-500 text-sm mt-2 text-center">Track your favorite films</p>
                      </div>
                    </div>

                    {/* Show */}
                    <div onClick={() => navigateTo('/track?type=show')} className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-md transition transform hover:translate-y-[-2px] h-full">
                        <div className="bg-blue-100 p-3 rounded-full mb-3">
                          <Tv size={28} className="text-blue-500" />
                        </div>
                        <span className="font-medium text-gray-800">TV Shows</span>
                        <p className="text-gray-500 text-sm mt-2 text-center">Keep up with TV series</p>
                      </div>
                    </div>

                    {/* Novel */}
                    <div onClick={() => navigateTo('/track?type=novel')} className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-white rounded-xl border border-yellow-100 hover:shadow-md transition transform hover:translate-y-[-2px] h-full">
                        <div className="bg-yellow-100 p-3 rounded-full mb-3">
                          <BookOpen size={28} className="text-yellow-500" />
                        </div>
                        <span className="font-medium text-gray-800">Novels</span>
                        <p className="text-gray-500 text-sm mt-2 text-center">Track your reading progress</p>
                      </div>
                    </div>

                    {/* Manga */}
                    <div onClick={() => navigateTo('/track?type=manga')} className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 hover:shadow-md transition transform hover:translate-y-[-2px] h-full">
                        <div className="bg-purple-100 p-3 rounded-full mb-3">
                          <Book size={28} className="text-purple-500" />
                        </div>
                        <span className="font-medium text-gray-800">Manga</span>
                        <p className="text-gray-500 text-sm mt-2 text-center">Follow your favorite manga</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Recommendations */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <Award size={18} className="mr-2 text-indigo-600" />
                      Recommended For You
                    </h2>
                    <button onClick={() => navigateTo('/recommendations')} className="text-indigo-600 hover:text-indigo-800 text-sm">View All</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recommendations.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition cursor-pointer" onClick={() => navigateTo(`/media/${item.id}`)}>
                        <div className="relative h-48 overflow-hidden">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full ${
                            item.type === 'movie' ? 'bg-red-500' : 
                            item.type === 'show' ? 'bg-blue-500' : 
                            item.type === 'manga' ? 'bg-purple-500' :
                            'bg-yellow-500'
                          } text-white`}>
                            {item.type}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-gray-800 truncate">{item.title}</h3>
                          <div className="flex justify-between items-center mt-2">
                            {renderStars(item.rating)}
                            <span className="text-sm text-gray-600 font-medium">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {/* Recent Activity Tab */}
            {activeTab === 'activity' && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <History size={18} className="mr-2 text-indigo-600" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className={`p-3 rounded-full mr-4 ${
                        activity.type === 'movie' ? 'bg-red-100' : 
                        activity.type === 'show' ? 'bg-blue-100' : 
                        activity.type === 'manga' ? 'bg-purple-100' :
                        'bg-yellow-100'
                      }`}>
                        {activity.type === 'movie' ? <Film size={20} className="text-red-500" /> : 
                         activity.type === 'show' ? <Tv size={20} className="text-blue-500" /> : 
                         activity.type === 'manga' ? <Book size={20} className="text-purple-500" /> :
                         <BookOpen size={20} className="text-yellow-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-gray-800 font-medium">
                            You <span className="text-indigo-600">{activity.action}</span> {activity.title}
                          </p>
                          <p className="text-gray-500 text-sm">{activity.date}</p>
                        </div>
                        <div className="mt-2">
                          {activity.rating && (
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 mr-2">Your rating:</span>
                              {renderStars(activity.rating)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Load More Activity
                  </button>
                </div>
              </div>
            )}
            
            {/* Collections Tab */}
            {activeTab === 'collections' && (
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <ListChecks size={18} className="mr-2 text-indigo-600" />
                    My Collections
                  </h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
                    <ListChecks size={16} />
                    Create Collection
                  </button>
                </div>
                
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <div className="p-4 rounded-full bg-indigo-100 mb-4">
                    <ListChecks size={36} className="text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Collections Yet</h3>
                  <p className="text-gray-600 text-center max-w-md mb-6">
                    Create your first collection to organize your favorite media into themed groups.
                  </p>
                  <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                    <ListChecks size={16} className="mr-2" />
                    Get Started with Collections
                  </button>
                </div>
              </div>
            )}
            
            {/* Favourites Tab */}
            {activeTab === 'favourites' && (
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Heart size={18} className="mr-2 text-indigo-600" />
                    My Favourites
                  </h2>
                </div>
                <FavouritePage id={decoded.id} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2025 Media Tracker. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">About</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Terms</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Help</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
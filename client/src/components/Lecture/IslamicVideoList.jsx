// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Play, ThumbsUp, Eye, Search, Filter } from 'lucide-react';
// import { videoService } from '../../api/videoApi';

// const IslamicVideoList = () => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'popular'

//   useEffect(() => {
//     fetchVideos();
//   }, [selectedCategory, sortBy]);

//   const fetchVideos = async () => {
//     try {
//       setLoading(true);
//       let fetchedVideos;
      
//       if (selectedCategory) {
//         fetchedVideos = await videoService.getVideosByCategory(selectedCategory);
//       } else if (sortBy === 'popular') {
//         fetchedVideos = await videoService.getMostPopular();
//       } else {
//         fetchedVideos = await videoService.getAllVideos();
//       }
      
//       setVideos(fetchedVideos);
//       setError('');
//     } catch (err) {
//       setError('Failed to load videos');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) {
//       fetchVideos();
//       return;
//     }

//     try {
//       setLoading(true);
//       const results = await videoService.searchVideos(searchTerm);
//       setVideos(results);
//     } catch (err) {
//       setError('Failed to search videos');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const VideoCard = ({ video }) => (
//     <Link 
//       to={`/islamic-videos/${video._id}`}
//       className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
//     >
//       <div className="relative">
//         <img
//           src={video.thumbnailUrl}
//           alt={video.title}
//           className="w-full h-48 object-cover"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
//           <Play className="w-12 h-12 text-white" />
//         </div>
//       </div>
//       <div className="p-4">
//         <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
//         <p className="text-gray-600 text-sm mb-2">{video.speaker}</p>
//         <div className="flex items-center text-sm text-gray-500 justify-between">
//           <span className="flex items-center">
//             <Eye className="w-4 h-4 mr-1" />
//             {video.views}
//           </span>
//           <span className="flex items-center">
//             <ThumbsUp className="w-4 h-4 mr-1" />
//             {video.likes}
//           </span>
//         </div>
//       </div>
//     </Link>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 ">
//       <div className="p-4 sm:p-6 lg:p-8">
//         <div className="max-w-[1400px] mx-auto">
//           {/* Header */}
//           <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
//             <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
//               Islamic Videos
//             </h1>
//             <Link
//               to="/islamic-videos/add"
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Add New Video
//             </Link>
//           </div>

//           {/* Search and Filters */}
//           <div className="bg-white rounded-lg shadow-md p-4 mb-8">
//             <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
//               <div className="flex-1">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search videos..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                   <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//                 </div>
//               </div>
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">All Categories</option>
//                 <option value="lecture">Lectures</option>
//                 <option value="quran">Quran</option>
//                 <option value="nasheed">Nasheed</option>
//                 <option value="documentary">Documentary</option>
//                 <option value="tutorial">Tutorial</option>
//               </select>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="recent">Most Recent</option>
//                 <option value="popular">Most Popular</option>
//               </select>
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Search
//               </button>
//             </form>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
//               {error}
//             </div>
//           )}

//           {/* Loading State */}
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//           ) : (
//             /* Video Grid */
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {videos.map((video) => (
//                 <VideoCard key={video._id} video={video} />
//               ))}
//             </div>
//           )}

//           {/* Empty State */}
//           {!loading && videos.length === 0 && (
//             <div className="text-center py-12">
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No videos found
//               </h3>
//               <p className="text-gray-500">
//                 Try adjusting your search or filter criteria
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IslamicVideoList;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, ThumbsUp } from 'lucide-react';
import { videoService } from '../../api/videoApi';

const IslamicVideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory, sortBy]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const fetchedVideos = await videoService.getAllVideos();
      setVideos(fetchedVideos);
      setError('');
    } catch (err) {
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Islamic Videos</h1>
        <p className="mt-2 text-gray-600">Explore our collection of Islamic educational videos</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          <option value="lecture">Lectures</option>
          <option value="quran">Quran</option>
          <option value="nasheed">Nasheed</option>
          <option value="documentary">Documentary</option>
          <option value="tutorial">Tutorial</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link 
            key={video._id}
            to={`/islamic-videos/${video._id}`}
            className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Video Thumbnail */}
            <div className="relative h-48">
              <img 
                src={video.thumbnailUrl || '/api/placeholder/400/300'}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Video Info */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {video.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {video.description}
              </p>

              {/* Video Details */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{video.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    <span>{video.views} views</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    <span>{video.likes} likes</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar (if needed) */}
              {video.progress && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${video.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 text-red-600">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && videos.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No videos found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default IslamicVideoList;
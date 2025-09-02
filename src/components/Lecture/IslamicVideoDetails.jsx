import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, User, Tag, Calendar } from 'lucide-react';
import { videoService } from '../../api/videoApi';
import SidebarNavigation from '../SideBar/SideNavBar';
import MainLayout from '../MainLayout';

const IslamicVideoDetails = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const videoData = await videoService.getVideoById(id);
        setVideo(videoData);
        console.log(videoData);
      } catch (err) {
        setError('Failed to load video details');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 md:ml-64 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 md:ml-64 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-100 md:ml-64 flex items-center justify-center">
        <div className="text-gray-600">Video not found</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (<>
  <SidebarNavigation/>
  <MainLayout>
  <div className="min-h-screen bg-gray-100">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Video Player Section */}
          <div className="w-full aspect-video bg-black">
            <video
              src={video.videoUrl}
              className="w-full h-full object-contain"
              controls
              poster={video.thumbnailUrl}
            />
          </div>

          {/* Video Details Section */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {video.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(video.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{video.speaker}</span>
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                <span className="capitalize">{video.category}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {video.description}
              </p>
            </div>

            {/* Additional Metadata */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{video.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Speaker/Artist</dt>
                  <dd className="mt-1 text-sm text-gray-900">{video.speaker}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Upload Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(video.createdAt)}</dd>
                </div>
                {video.updatedAt && video.updatedAt !== video.createdAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(video.updatedAt)}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

  </MainLayout>
  </>

  );
};

export default IslamicVideoDetails;
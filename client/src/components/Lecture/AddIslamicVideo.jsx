import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Upload, X } from "lucide-react";
import { videoService } from "../../api/videoApi";
import SidebarNavigation from '../SideBar/SideNavBar';
import MainLayout from '../MainLayout';


const IslamicVideoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get video ID from URL if editing
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "lecture",
    speaker: "",
    videoUrl: "",
    thumbnailUrl: "",
  });
  
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    video: 0,
    thumbnail: 0
  });

  // Fetch existing video data if editing
  useEffect(() => {
    const fetchVideo = async () => {
      if (isEditing) {
        setLoading(true);
        try {
          const video = await videoService.getVideo(id);
          setFormData({
            title: video.title,
            description: video.description,
            category: video.category,
            speaker: video.speaker,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl
          });
          if (video.videoUrl) {
            setVideoPreview(video.videoUrl);
          }
          if (video.thumbnailUrl) {
            setThumbnailPreview(video.thumbnailUrl);
          }
        } catch (err) {
          setError("Failed to load video data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchVideo();
  }, [id, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleProgress = (type, progress) => {
    setUploadProgress(prev => ({
      ...prev,
      [type]: Math.round(progress)
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    setUploadProgress({ video: 0, thumbnail: 0 });

        // Validate required fields according to schema
        if (!formData.title || !formData.description || !formData.speaker || !formData.category) {
          setError("Please fill in all required fields");
          setIsSubmitting(false);
          return;
        }

    if (!isEditing && (!videoFile || !thumbnailFile)) {
      setError("Please upload both video and thumbnail");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await videoService.updateVideo(
          id,
          formData,
          videoFile,
          thumbnailFile,
          handleProgress
        );
        setSuccess("Video updated successfully!");
      } else {
        await videoService.createVideo(
          formData,
          videoFile,
          thumbnailFile,
          handleProgress
        );
        setSuccess("Video added successfully!");
      }

      setTimeout(() => {
        navigate("/kuliyyah");
      }, 1500);
    } catch (err) {
      setError(err.message || `Error ${isEditing ? 'updating' : 'adding'} video`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderVideoPreview = () => {
    if (!videoPreview) return null;

    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Video Preview
        </h3>
        <div className="relative">
          <video
            src={videoPreview}
            className="w-full rounded-lg"
            controls
          />
          <button
            type="button"
            onClick={() => {
              setVideoFile(null);
              setVideoPreview(null);
              setUploadProgress(prev => ({ ...prev, video: 0 }));
            }}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
          {isSubmitting && uploadProgress.video > 0 && uploadProgress.video < 100 && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-white">
                      Uploading Video
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-white">
                      {uploadProgress.video}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${uploadProgress.video}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderThumbnailPreview = () => {
    if (!thumbnailPreview) return null;

    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Thumbnail Preview
        </h3>
        <div className="relative">
          <img
            src={thumbnailPreview}
            alt="Video thumbnail"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => {
              setThumbnailFile(null);
              setThumbnailPreview(null);
              setUploadProgress(prev => ({ ...prev, thumbnail: 0 }));
            }}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
          {isSubmitting && uploadProgress.thumbnail > 0 && uploadProgress.thumbnail < 100 && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-white">
                      Uploading Thumbnail
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-white">
                      {uploadProgress.thumbnail}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${uploadProgress.thumbnail}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 md:ml-64 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
    <SidebarNavigation/>
    <MainLayout>
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-900 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? 'Edit Islamic Video' : 'Add Islamic Video'}
            </h2>
            <p className="mt-2 text-gray-400">
              {isEditing ? 'Update video details and content' : 'Upload and share beneficial Islamic content'}
            </p>
          </div>

          {/* Alert Messages */}
          {(error || success) && (
            <div className={`px-6 py-4 ${error ? "bg-red-50" : "bg-green-50"}`}>
              <div className="flex items-center">
                <AlertCircle
                  className={`h-5 w-5 ${error ? "text-red-400" : "text-green-400"} mr-3`}
                />
                <p className={`text-sm ${error ? "text-red-600" : "text-green-600"}`}>
                  {error || success}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row">
            {/* Left Column - Form Fields */}
            <div className="flex-1 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="quran">Quran</option>
                    <option value="nasheed">Nasheed</option>
                    <option value="documentary">Documentary</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker/Artist *
                  </label>
                  <input
                    type="text"
                    name="speaker"
                    value={formData.speaker}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white text-sm font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? 'Uploading...' : isEditing ? 'Update Video' : 'Upload Video'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - Video Upload */}
            <div className="flex-1 p-6 bg-gray-50 border-l border-gray-200">
              <div className="sticky top-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File {isEditing && '(Optional)'}
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                  onDragEnter={handleDragIn}
                  onDragLeave={handleDragOut}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                        <span>Upload video</span>
                        <input
                          type="file"
                          onChange={handleVideoChange}
                          accept="video/*"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      MP4, WebM, or OGG files up to 500MB
                    </p>
                  </div>
                </div>

                {renderVideoPreview()}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image {isEditing && '(Optional)'}
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                      isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    }`}
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                      const file = e.dataTransfer.files[0];
                      if (file && file.type.startsWith('image/')) {
                        setThumbnailFile(file);
                        setThumbnailPreview(URL.createObjectURL(file));
                      }
                    }}
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                          <span>Upload thumbnail</span>
                          <input
                            type="file"
                            onChange={handleThumbnailChange}
                            accept="image/*"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>

                  {renderThumbnailPreview()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
    </>

  );
};

export default IslamicVideoForm;
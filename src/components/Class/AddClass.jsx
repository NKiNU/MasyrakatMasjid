import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imgDB } from "../../util/fireabseStorage";
import { AlertCircle, Upload, X } from "lucide-react";
import { classService } from "../../api/classApi";
import SidebarNavigation from "../SideBar/SideNavBar";
import MainLayout from "../MainLayout";

const AddClass = () => {
  const { id } = useParams(); // Get class ID from URL if editing
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [formData, setFormData] = useState({
    className: "",
    description: "",
    venue: "physical",
    venueDetails: "",
    isPaid: false,
    price: 0,
    startDate: "", // New field
    startTime: "", // New field
    capacity: 0,  // Add this line
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // For st
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  // Fetch existing class data if editing
  useEffect(() => {
    const fetchClassData = async () => {
      if (isEditing) {
        try {
          const response = await classService.getClassesById(id);
          const classData = response.class;
          
          // Update form data with existing class data
          setFormData({
            className: classData.className || "",
            description: classData.description || "",
            venue: classData.venue || "physical",
            venueDetails: classData.venueDetails || "",
            isPaid: classData.isPaid || false,
            capacity: classData.capacity || 0,
            price: classData.price || 0,
            startDate: classData.startDate ? new Date(classData.startDate).toISOString().split('T')[0] : "",
            startTime: classData.startTime || "",
          });
          
          // Set existing images
          setExistingImages(classData.images || []);
          setIsLoading(false);
        } catch (err) {
          setError("Failed to load class data");
          setIsLoading(false);
        }
      }
    };

    fetchClassData();
  }, [id, isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
      // Clear venueDetails when venue type changes
      ...(name === "venue" ? { venueDetails: "" } : {}),
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    handleNewFiles(files);
  };

  const handleNewFiles = (files) => {
    const newPreviews = [];
    const newFiles = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
      newFiles.push(file);
    });
    setImageFiles([...imageFiles, ...newFiles]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
    const files = [...e.dataTransfer.files];
    handleNewFiles(files);
  };

  const uploadFiles = async (files) => {
    const uploadPromises = files.map((file) => {
      const uniqueName = `${Date.now()}-${file.name}`;
      const storageRef = ref(imgDB, `classes/${uniqueName}`);
      return uploadBytes(storageRef, file).then((snapshot) =>
        getDownloadURL(snapshot.ref)
      );
    });
    return Promise.all(uploadPromises);
  };

  // Add handler for removing existing images
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Prepare class data
      const classData = {
        ...formData,
        price: formData.isPaid ? parseFloat(formData.price) : 0,
        images: existingImages, // Include existing images
      };

      if (isEditing) {
        // Handle update
        await classService.updateClass(id, classData, imageFiles);
        setSuccess("Class updated successfully!");
      } else {
        // Handle create
        await classService.createClass(classData, imageFiles);
        setSuccess("Class created successfully!");
      }

      // Navigate back after success
      setTimeout(() => {
        navigate("/kuliyyah");
      }, 1500);
    } catch (err) {
      setError(err.message || `Error ${isEditing ? "updating" : "creating"} class`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen md:ml-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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
              {isEditing ? "Edit Class" : "Create New Class"}
            </h2>
            <p className="mt-2 text-gray-400">
              {isEditing
                ? "Update the class details"
                : "Fill in the details to create a new class activity"}
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
                  Class Name
                </label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
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

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Type
                  </label>
                  <select
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="physical">Physical</option>
                    <option value="online">Online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.venue === "physical" ? "Location Details" : "Meeting Link"}
                  </label>
                  <input
                    type="text"
                    name="venueDetails"
                    value={formData.venueDetails}
                    onChange={handleInputChange}
                    placeholder={formData.venue === "physical" 
                      ? "Enter physical location (e.g., Room 101, Building A)"
                      : "Enter meeting link (e.g., Zoom/Google Meet URL)"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Date and Time Fields */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Start Date
    </label>
    <input
      type="date"
      name="startDate"
      value={formData.startDate}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Start Time
    </label>
    <input
      type="time"
      name="startTime"
      value={formData.startTime}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required
    />
  </div>
</div>

<div className="space-y-6">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Class Capacity
    </label>
    <input
      type="number"
      name="capacity"
      value={formData.capacity}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      min="1"
      placeholder="Enter maximum number of students"
      required
    />
  </div>
</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Class Type
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPaid"
                      checked={formData.isPaid}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {formData.isPaid ? "Paid" : "Free"} Class
                    </span>
                  </label>
                </div>

                {formData.isPaid && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-1 flex items-center text-gray-500">
                        RM 
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white text-sm font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                    ? "Update Class"
                    : "Create Class"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Image Upload */}
          <div className="flex-1 p-6 bg-gray-50 border-l border-gray-200">
          <div className="sticky top-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
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
                      <span>Upload files</span>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              </div>

              {existingImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Existing Images
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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

export default AddClass;

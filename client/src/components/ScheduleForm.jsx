import { imgDB } from "../util/fireabseStorage";// Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { createSchedule } from "../api/scheduleApi";

function ScheduleForm({ onAdd, mode = "add", initialData = {} }) {
  const [schedule, setSchedule] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    date: initialData.date || "",
    time: initialData.time || "",
    images: initialData.images || [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule({ ...schedule, [name]: value });
  };

  const handleImageChange = (event) => {
    const imgFile = Array.from(event.target.files);
    const updatedFiles = [...files, ...imgFile]; // Concatenate existing files with new ones
    setFiles(updatedFiles);

    const previewsPromises = updatedFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewsPromises).then((previews) => {
      setImageFiles(updatedFiles);
      setImagePreviews(previews);
    });
  };

  const handleImageRemove = (index) => {
    const updatedPreviews = [...imagePreviews];
    const updatedFiles = [...imageFiles];
    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);
    setImagePreviews(updatedPreviews);
    setImageFiles(updatedFiles);
  };

  const uploadFiles = async (files) => {
    const uploadPromises = [];
    for (const file of files) {
      const uniqueName = `${Date.now()}-${file.name}`;
      const storageRef = ref(imgDB, `schedules/${uniqueName}`);
      const uploadTask = uploadBytes(storageRef, file).then((snapshot) =>
        getDownloadURL(snapshot.ref)
      );
      uploadPromises.push(uploadTask);
    }
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      const imageUrls = await uploadFiles(imageFiles);
      const mediaUrls = [...imageUrls];
      schedule.images = mediaUrls;

      if (mode === "add") {
        await onAdd(schedule); // Calls the parent component's `onAdd` function
      } else {
        // Handle edit logic here if necessary
      }

      setLoading(false);
    } catch (error) {
      console.error("Error uploading images or saving schedule:", error);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h1 className="text-2xl font-semibold text-gray-700">
        {mode === "add" ? "Add New Schedule" : "Edit Schedule"}
      </h1>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={schedule.title}
          onChange={handleChange}
          placeholder="Enter title"
          className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={schedule.description}
          onChange={handleChange}
          placeholder="Enter description"
          rows="3"
          className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm p-2"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={schedule.date}
          onChange={handleChange}
          className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Time
        </label>
        <input
          type="time"
          name="time"
          value={schedule.time}
          onChange={handleChange}
          className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Upload Pictures
        </label>
        <div className="flex justify-center items-center">
          <label
            htmlFor="fileInput"
            className="flex justify-center items-center w-16 h-16 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700"
          >
            +
          </label>
          <input
            id="fileInput"
            type="file"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative">
            <button
              type="button"
              onClick={() => handleImageRemove(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              X
            </button>
            <img
              src={preview}
              alt={`Preview ${index}`}
              className="h-24 w-24 object-cover"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        {loading ? "Saving..." : mode === "add" ? "Add Schedule" : "Save Changes"}
      </button>
    </form>
  );
}

export default ScheduleForm;

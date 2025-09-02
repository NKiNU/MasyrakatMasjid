import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

const Event = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImage = (file) => {
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImage(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Navigation */}
      {/* <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 py-4">
            {["organization", "Iman", "Contact", "Event", "feedback"].map((item) => (
              <button
                key={item}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all
                         hover:bg-blue-50 hover:text-blue-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav> */}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-1">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
            Events
        </h1>
      </div>
    </div>
  );
};

export default Event;
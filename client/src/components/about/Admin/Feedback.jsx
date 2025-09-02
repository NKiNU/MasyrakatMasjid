import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Eye } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, CardHeader, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { imgDB } from "../../../util/fireabseStorage";

const Feedback = () => {
  const { currentUser } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super admin';

  // useEffect(() => {
  //   console.log(isAdmin)
  //   if (isAdmin) {
  //     fetchFeedbacks();
  //   }
  // }, [isAdmin]);
  // useEffect(() => {
  //   console.log('Component re-rendered');
  // }, [message]);

  useEffect(() => {
    fetchFeedbacks();
  }, []); 

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/feedback', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log(response)
      const feedbackData = response.data.data.feedbacks;
  
      // Check if response data is an array
      if (Array.isArray(feedbackData)) {
        setFeedbacks(feedbackData);
      } else {
        console.error('Expected an array, received:', feedbackData);
        setFeedbacks([]); // Reset to empty array if data is invalid
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setFeedbacks([]); // Ensure `feedbacks` is an array even on error
    }
  };
  

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

  const uploadImage = async (file) => {
    const uniqueName = `${Date.now()}-${file.name}`;
    const storageRef = ref(imgDB, `feedback/${uniqueName}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };
  const handleTextAreaChange = (e) => {
    setMessage(e.target.value);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      await axios.post('http://localhost:3001/api/feedback', {
        message,
        imageUrl,
        userId: currentUser.id
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setMessage('');
      setSelectedImage(null);
      setPreview(null);
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  const UserView = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Submit Feedback</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
<Textarea
  value={message}
  onChange={handleTextAreaChange}
  placeholder="Enter your feedback here..."
  className="w-full min-h-[150px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  required
/>

  
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="max-h-48 mx-auto" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <div className="space-y-2">
                  <Upload className="mx-auto" />
                  <p>Drag and drop an image or click to upload</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImage(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </label>
            )}
          </div>
  
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const AdminView = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Feedback List</h2>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {Array.isArray(feedbacks) && feedbacks.map((feedback)  => (
              <Card key={feedback._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">User: {feedback.userId.email}</p>
                    <p className="text-gray-600">{feedback.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {feedback.imageUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Image
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
            <img
              src={selectedFeedback.imageUrl}
              alt="Feedback"
              className="max-h-[80vh] mx-auto"
            />
            <Button
              onClick={() => setSelectedFeedback(null)}
              className="mt-4"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {console.log("current Role",currentUser?.role)}
      {currentUser?.role === 'admin' || currentUser?.role === 'super admin' ? (
        <UserView/>
      ) : (
        <AdminView />
      )}
    </div>
  );
};

export default Feedback;
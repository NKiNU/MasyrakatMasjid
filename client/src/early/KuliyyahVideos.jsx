import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoUpload = () => {
  const [videos, setVideos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/getvideos');
      setVideos(response.data.data); // Ensure the correct data path
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('title', title);
    formData.append('description', description);

    try {
      await axios.post('http://localhost:3001/uploadvideos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchVideos(); // Fetch videos again after uploading
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  return (
    <div>
      <h1>Video Upload</h1>
      <form onSubmit={onFormSubmit}>
        <input type="file" onChange={onFileChange} required />
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
        <button type="submit">Upload</button>
      </form>
      <h2>Uploaded Videos</h2>
      <div>
      {videos.length === 0 ? "No videos uploaded yet" : videos.map((video) => (
          <div key={video._id}>
            <h3>{video.title}</h3>
            <p>{video.description}</p>
            <img width="320" height="240" src={`http://localhost:3001/images/${video.filepath}`} alt={video.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoUpload;

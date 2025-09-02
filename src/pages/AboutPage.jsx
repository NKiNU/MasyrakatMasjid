// // import React from 'react';
// // import SidebarNavigation from '../components/SideBar/SideNavBar';
// // import { useState } from 'react';

// // import Contact from '../components/about/Admin/Contact';
// // import Imam from '../components/about/Admin/Imam';
// // import Organization from '../components/about/Admin/Organization'; 
// // import Event from '../components/about/Admin/Event';
// // import Feedback from '../components/about/Admin/Feedback';
// // import NewsList from '../components/News/NewsList';
// // const AboutPage = () => {
// //     const [activeComponent, setActiveComponent] = useState('Event');

// //     // Map for components
// //     const components = {
// //       Event: <NewsList/>,
// //       Organization: <Organization />,
// //       Imam: <Imam />,
// //       Contact: <Contact />,
// //       Feedback: <Feedback />,
// //     };
// //   return (
// //     <div className='flex h-screen'>
// //       <div className='w-64 bg-gray-100 dark:bg-gray-800'>
// //         {<SidebarNavigation/>}
// //       </div>

// //     <div className='flex-1 p-6'>
// //     <nav className="bg-white shadow-lg">
// //         <div className="max-w-7xl mx-auto px-4">
// //           <div className="flex space-x-4 py-4">
// //             {Object.keys(components).map((key) => (
// //               <button
// //                 key={key}
// //                 onClick={() => setActiveComponent(key)}
// //                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all
// //                             ${activeComponent === key ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'}
// //                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
// //               >
// //                 {key}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </nav>
// //       <div className="max-w-7xl mx-auto p-8">
// //         {components[activeComponent]}
// //       </div>
// //       {/* {<Organization/>}
// //       {<Imam/>}
// //       {<Contact/>}
// //       {<Event/>}
// //       {<Feedback/>} */}
      
// //     </div>
// //     </div>
// //   );
// // };

// // export default AboutPage;
// import React, { useState, useEffect } from 'react';
// import SidebarNavigation from '../components/SideBar/SideNavBar';
// import { Upload, Trash2 } from 'lucide-react';
// import { Button } from '../components/ui/button';
// import { Textarea } from '../components/ui/textarea';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import { imgDB } from '../util/fireabseStorage';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import Organization from '../components/about/Admin/Organization'; 
// import Event from '../components/about/Admin/Event';
// import Feedback from '../components/about/Admin/Feedback';
// import NewsList from '../components/News/NewsList';
// import Imam from '../components/about/Admin/Imam';
// import Contact from '../components/about/Admin/Contact';

// const AboutPage = () => {
//   const { currentUser } = useAuth();
//   const [activeTab, setActiveTab] = useState('Event'); // Active tab state
//   const [message, setMessage] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Event Component Logic
//   const renderEventComponent = () => (
//     <>
//       {/* <h2 className="text-2xl font-bold mb-4">Event Management</h2>
//       <p>Here you can manage your events.</p>
//       Add your event-specific functionality */}
//       <NewsList/></>
    
//   );

//   // Organization Component Logic
//   const renderOrganizationComponent = () => (
//     // <div>
//     //   <h2 className="text-2xl font-bold mb-4">Organization Information</h2>
//     //   <p>Details about the organization go here.</p>
//     //   {/* Add organization-specific functionality */}
//     // </div>
//     <>
//     <Organization/>
//     </>
//   );

//     // Organization Component Logic
//     const renderContactComponent = () => (
//       // <div>
//       //   <h2 className="text-2xl font-bold mb-4">Organization Information</h2>
//       //   <p>Details about the organization go here.</p>
//       //   {/* Add organization-specific functionality */}
//       // </div>
//       <>
//       <Contact/>
//       </>
//     );

//   // Imam Component Logic
//   const renderImamComponent = () => (
//     // <div>
//     //   <h2 className="text-2xl font-bold mb-4">Imam Information</h2>
//     //   <p>Details about the imams go here.</p>
//     //   {/* Add imam-specific functionality */}
//     // </div>
//     <>
//     <Imam/>
//     </>
//   );

//   // Feedback Component Logic
//   const renderFeedbackComponent = () => (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
//       <form onSubmit={handleFeedbackSubmit} className="space-y-4">
//         <Textarea
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Enter your feedback here..."
//           className="w-full min-h-[150px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//         <div
//           className="border-2 border-dashed rounded-lg p-4 text-center"
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={handleDrop}
//         >
//           {preview ? (
//             <div className="relative">
//               <img src={preview} alt="Preview" className="max-h-48 mx-auto" />
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSelectedImage(null);
//                   setPreview(null);
//                 }}
//                 className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           ) : (
//             <label className="cursor-pointer block">
//               <div className="space-y-2">
//                 <Upload className="mx-auto" />
//                 <p>Drag and drop an image or click to upload</p>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleImage(e.target.files[0])}
//                   className="hidden"
//                 />
//               </div>
//             </label>
//           )}
//         </div>
//         <Button type="submit" disabled={loading}>
//           {loading ? 'Submitting...' : 'Submit Feedback'}
//         </Button>
//       </form>
//     </div>
//   );

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     handleImage(file);
//   };

//   const handleImage = (file) => {
//     if (file) {
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const uploadImage = async (file) => {
//     const uniqueName = `${Date.now()}-${file.name}`;
//     const storageRef = ref(imgDB, `feedback/${uniqueName}`);
//     const snapshot = await uploadBytes(storageRef, file);
//     return getDownloadURL(snapshot.ref);
//   };

//   const handleFeedbackSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let imageUrl = '';
//       if (selectedImage) {
//         imageUrl = await uploadImage(selectedImage);
//       }

//       await axios.post(
//         'http://localhost:3001/api/feedback',
//         {
//           message,
//           imageUrl,
//           userId: currentUser.id,
//         },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }
//       );

//       setMessage('');
//       setSelectedImage(null);
//       setPreview(null);
//       alert('Feedback submitted successfully!');
//     } catch (error) {
//       console.error('Error submitting feedback:', error);
//       alert('Error submitting feedback');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="w-64 bg-gray-100 dark:bg-gray-800">
//         <SidebarNavigation />
//       </div>
//       <div className="flex-1 p-6">
//         <nav className="bg-white shadow-lg mb-4">
//           <div className="max-w-7xl mx-auto px-4">
//             <div className="flex space-x-4 py-4">
//               {['Event', 'Organization', 'Imam','Contact', 'Feedback'].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                     activeTab === tab
//                       ? 'bg-blue-50 text-blue-600'
//                       : 'hover:bg-blue-50 hover:text-blue-600'
//                   } focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </nav>
//         <div className="max-w-7xl mx-auto">
//           {activeTab === 'Event' && renderEventComponent()}
//           {activeTab === 'Organization' && renderOrganizationComponent()}
//           {activeTab === 'Imam' && renderImamComponent()}
//           {activeTab === 'Contact' && renderContactComponent()}
//           {activeTab === 'Feedback' && renderFeedbackComponent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutPage;
import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../components/SideBar/SideNavBar';
import { Upload, Trash2, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { imgDB } from '../util/fireabseStorage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Organization from '../components/about/Admin/Organization';
import Event from '../components/about/Admin/Event';
import NewsList from '../components/News/NewsList';
import Imam from '../components/about/Admin/Imam';
import Contact from '../components/about/Admin/Contact';

const AboutPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Event'); // Active tab state
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super admin';

  // Fetch feedbacks for admin
  useEffect(() => {
    if (isAdmin && activeTab === 'Feedback') {
      fetchFeedbacks();
    }
  }, [isAdmin, activeTab]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/feedback', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const feedbackData = response.data.data.feedbacks;
      if (Array.isArray(feedbackData)) {
        setFeedbacks(feedbackData);
      } else {
        console.error('Expected an array, received:', feedbackData);
        setFeedbacks([]);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setFeedbacks([]);
    }
  };

  // Handle image upload
  const handleImage = (file) => {
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle image drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImage(file);
  };

  // Upload image to Firebase
  const uploadImage = async (file) => {
    const uniqueName = `${Date.now()}-${file.name}`;
    const storageRef = ref(imgDB, `feedback/${uniqueName}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      await axios.post(
        'http://localhost:3001/api/feedback',
        {
          message,
          imageUrl,
          userId: currentUser.id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

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

  // Render feedback form for non-admin users
  const renderFeedbackForm = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Submit Feedback</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your feedback here..."
            className="w-full min-h-[150px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div
            className="border-2 border-dashed rounded-lg p-4 text-center"
            onDragOver={(e) => e.preventDefault()}
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

  // Render feedback list for admin users
  const renderFeedbackList = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Feedback List</h2>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {feedbacks.map((feedback) => (
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
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 dark:bg-gray-800">
        <SidebarNavigation />
      </div>
      <div className="flex-1 p-6">
        <nav className="bg-white shadow-lg mb-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-4 py-4">
              {['Event', 'Organization', 'Imam', 'Contact', 'Feedback'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-blue-50 hover:text-blue-600'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto">
          {activeTab === 'Event' && <NewsList />}
          {activeTab === 'Organization' && <Organization />}
          {activeTab === 'Imam' && <Imam />}
          {activeTab === 'Contact' && <Contact />}
          {activeTab === 'Feedback' && (
            isAdmin ? renderFeedbackList() : renderFeedbackForm()
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
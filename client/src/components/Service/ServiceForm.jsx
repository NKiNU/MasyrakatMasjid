import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imgDB } from "../../util/fireabseStorage";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import serviceApi from '../../api/serviceApi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import MainLayout from '../MainLayout';
import SidebarNavigation from '../SideBar/SideNavBar';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [service, setService] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    duration: '',
    timeSlots: [], // Added for time slots  
});

const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '' });


useEffect(() => {
  // console.log(currentUser?.id)
  if (!currentUser || !['admin', 'super admin'].includes(currentUser?.role)) {
    navigate('/service');
  }
},[]);

  useEffect(() => {
    if (id) fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const data = await serviceApi.getServiceById(id);
      setService({
        ...data,
        timeSlots: data.timeSlots || [], // Ensure timeSlots is always an array
      });
      setImagePreview(data.image);
    } catch (error) {
      toast.error('Failed to fetch service');
      navigate('/service');
    }
  };
  

  const handleAddTimeSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast.error('Start time and end time are required');
      return;
    }
    setService((prev) => ({
      ...prev,
      timeSlots: [...(prev.timeSlots || []), newSlot], // Ensure prev.timeSlots is an array
    }));
    setNewSlot({ startTime: '', endTime: '' });
  };
  
  const handleRemoveTimeSlot = (index) => {
    setService((prev) => ({
      ...prev,
      timeSlots: (prev.timeSlots || []).filter((_, i) => i !== index), // Ensure prev.timeSlots is an array
    }));
  };
  



  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setService(prev => ({ ...prev, image: '' }));
  };

  const uploadImage = async (file) => {
    const uniqueName = `${Date.now()}-${file.name}`;
    const storageRef = ref(imgDB, `services/${uniqueName}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = service.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const serviceData = { ...service, image: imageUrl };

      if (id) {
        await serviceApi.updateService(id, serviceData);
        navigate('/service/services')
      } else {

        const createdService = await serviceApi.createService(serviceData);
      toast.success('Service created successfully');
      console.log(createdService)
      console.log(createdService.service._id)

      // Navigate to the Availability Management page after service is created
      navigate(`/service/availability/${createdService.service._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <SidebarNavigation />
      <MainLayout>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">
            {id ? 'Edit Service' : 'Create New Service'}
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <Input
                        type="text"
                        name="name"
                        value={service.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        name="description"
                        value={service.description}
                        onChange={handleChange}
                        required
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Service Details</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price ($)</label>
                      <Input
                        type="number"
                        name="price"
                        value={service.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Duration (min)</label>
                      <Input
                        type="number"
                        name="duration"
                        value={service.duration}
                        onChange={handleChange}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Service Image</h2>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <label className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-gray-500">Click to add image</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : (id ? 'Update Service' : 'Create Service')}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/service')}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </MainLayout>
    </>
  );
};

export default ServiceForm;
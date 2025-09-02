import React, { useState, useEffect } from "react";
import {
  Search,
  Flag,
  Edit,
  Trash2,
  ChevronRight,
  Plus,
  Loader2,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import MainLayout from "../MainLayout";
import SidebarNavigation from "../SideBar/SideNavBar";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';


// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    console.error("API Error:", message);
    return Promise.reject(message);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ContentList = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [content, setContent] = useState({
    classes: [],
    donations: [],
    islamicVideos: [],
    news: [],
    products: [],
    services: [],
  });

  const addNewOptions = [
    { label: "New Class", path: "/kuliyyah/addClass" },
    { label: "New Donation", path: "/donationAdmin" },
    { label: "New Islamic Video", path: "/addVideo" },
    { label: "New News", path: "/news/add" },
    { label: "New Product", path: "/products/add" },
    { label: "New Service", path: "/service/new" },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        classesRes,
        donationsRes,
        videosRes,
        newsRes,
        productsRes,
        servicesRes,
      ] = await Promise.all([
        api.get("/classes"),
        api.get("/donations"),
        api.get("/videos"),
        api.get("/news"),
        api.get("/products"),
        api.get("/services"),
      ]);

      setContent({
        classes: classesRes.data.classes || [],
        donations: donationsRes.data || [],
        islamicVideos: videosRes.data || [],
        news: newsRes.data || [],
        products: productsRes.data || [],
        services: servicesRes.data || [],
      });
    } catch (error) {
      setError(
        typeof error === "string"
          ? error
          : "Failed to fetch content. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    console.log(content?.classes);
    console.log(currentUser)
  }, []);

  const handleFlagContent = async (item) => {
    console.log(item)
    const result = await Swal.fire({
      title: "Flag Content",
      input: "textarea",
      inputLabel: "Reason for flagging",
      inputPlaceholder: "Enter reason for flagging content...",
      showCancelButton: true,
      confirmButtonText: "Flag",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      inputValidator: (value) => {
        if (!value) {
          return "You need to provide a reason!";
        }
      },
    });

    if (result.isConfirmed) {
      console.log(result.value)
      console.log(item.type)
      try {
        
        if (item.type === "classes") {
        await api.post(`/fr/classes/${item._id}/flag`, {
          message: result.value,
          flaggedBy: currentUser._id,
        });
      } 
      
      else if (item.type === "donations") {
        await api.post(`/fr/donations/${item._id}/flag`, {
          message: result.value,
          flaggedBy: currentUser._id,
        });
      }
      
      else if (item.type === "islamic-videos") {
        await axios.post(`/api/${item.type}/${item._id}/flag`, {
          message: result.value,
          flaggedBy: currentUser._id,
        });
      }
      
      else if (item.type === "news") {
        await axios.post(`/api/${item.type}/${item._id}/flag`, {
          message: result.value,
          flaggedBy: currentUser._id,
        });
      }
      
      else if (item.type === "products") {
        await axios.post(`/api/${item.type}/${item._id}/flag`, {
          message: result.value,
          flaggedBy: currentUser._id,
        });
      }
      
      else if (item.type === "services") {
        await axios.post(`/api/${item.type}/${item._id}/flag`, {
          message: result.value,
          flaggedBy: currentUser._id,
        });
      }
      
      else {
        console.log(error)
      }

      await api.post('/fr/notifications/flag', {
        contentId: item._id,
        contentType: item.type,
        contentName: item.displayTitle,
        reason: result.value,
        user:currentUser,
        userId: currentUser?._id
      });

        await fetchContent();
        Swal.fire("Success", "Content has been flagged", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to flag content", "error");
      }
    }
  };

  const handleUnflagContent = async (item) => {
    const result = await Swal.fire({
      title: "Remove Flag",
      text: "Are you sure you want to remove the flag from this content?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove flag",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#059669",
    });

    if (result.isConfirmed) {
      try {        
        if (item.type === "classes") {
          await api.post(`/fr/classes/${item._id}/unflag`);
      } 
      
      else if (item.type === "donations") {
        await api.post(`/fr/donations/${item._id}/unflag`, {
          message: result.value,
          flaggedBy: currentUser._id,
        });
      }
      
      else if (item.type === "islamic-videos") {
        await axios.post(`/api/${item.type}/${item._id}/flag`, {
          message: result.value,
          flaggedBy: currentUser._id,
        });
      }
      
      else if (item.type === "news") {
        await axios.post(`/api/${item.type}/${item._id}/flag`, {
          message: result.value,
          flaggedBy: currentUser._id,
        });
      }
      
      else if (item.type === "products") {
        await axios.post(`/api/${item.type}/${item._id}/flag`, {
          message: result.value,
          flaggedBy: currentUser._id,
        });
      }
      
      else if (item.type === "services") {
        await axios.post(`/api/${item.type}/${item._id}/flag`, {
          message: result.value,
          flaggedBy: currentUser._id,
        });
      }
      
      else {
        console.log(error)
      }

      await api.post('/fr/notifications/unflag', {
        contentId: item._id,
        contentType: item.type,
        contentName: item.displayTitle,
        reason: result.value,
        user:currentUser,
        userId: currentUser?._id
      });
        
        await fetchContent();
        Swal.fire("Success", "Flag has been removed", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to remove flag", "error");
      }
    }
  };

  // Delete content handler
  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      if (type === "classes") {
        await api.delete(`/classes/${id}`);
      } 
      
      else if (type === "donations") {
        await api.delete(`/donations/${id}`);
      }
      
      else if (type === "islamic-videos") {
        await api.delete(`/videos/${id}`);
      }
      
      else if (type === "news") {
        await api.delete(`/news/${id}`);
      }
      
      else if (type === "products") {
        await api.delete(`/products/${id}`);
      }
      
      else if (type === "services") {
        await api.delete(`/services/${id}`);
      }
      
      else {
        console.log(error)
      }
      await fetchContent(); // Refresh content after deletion
    } catch (error) {
      setError(
        typeof error === "string"
          ? error
          : "Failed to delete item. Please try again."
      );
    }
  };

  // Flag content handler
  const handleFlag = async (type, id) => {
    try {
      await api.post(`/${type}/${id}/flag`, {
        message: "Content flagged for review",
      });
      await fetchContent(); // Refresh content after flagging
    } catch (error) {
      setError(
        typeof error === "string"
          ? error
          : "Failed to flag item. Please try again."
      );
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // Combine all content types
  const getAllContent = () => {
    const allContent = [
      ...content.classes.map((item) => ({
        ...item,
        type: "classes",
        displayTitle: item.className || "Untitled Class",
        details: `${item.venue} | ${item.venueDetails} | ${formatDate(
          item.startDate
        )}`,
      })),
      ...content.donations.map((item) => ({
        ...item,
        type: "donations",
        displayTitle: item.title,
        details: `Target: RM ${item.targetAmount} | Current: RM ${item.currentAmount}`,
      })),
      ...content.islamicVideos.map((item) => ({
        ...item,
        type: "islamic-videos",
        displayTitle: item.title,
        details: `${item.category} | Views: ${item.views} | Likes: ${item.likes}`,
      })),
      ...content.news.map((item) => ({
        ...item,
        type: "news",
        displayTitle: item.title,
        details: `By ${item.author} | ${formatDate(item.eventDate)}`,
      })),
      ...content.products.map((item) => ({
        ...item,
        type: "products",
        displayTitle: item.name,
        details: `RM ${item.price} | Stock: ${item.stock}`,
      })),
      ...content.services.map((item) => ({
        ...item,
        type: "services",
        displayTitle: item.name,
        details: `Rm ${item.price} | Duration: ${item.duration}min`,
      })),
    ];

    return allContent.filter((item) => {
      const matchesSearch = item.displayTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || item.type === selectedType;
      return matchesSearch && matchesType;
    });
  };

  const getCategoryColor = (type) => {
    const colors = {
      classes: "bg-blue-100 text-blue-800",
      donations: "bg-green-100 text-green-800",
      "islamic-videos": "bg-purple-100 text-purple-800",
      news: "bg-yellow-100 text-yellow-800",
      products: "bg-pink-100 text-pink-800",
      services: "bg-indigo-100 text-indigo-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  //   const getTypeColor = (type) => {
  //     const colors = {
  //       classes: 'bg-blue-100 text-blue-800',
  //       donations: 'bg-green-100 text-green-800',
  //       'islamic-videos': 'bg-purple-100 text-purple-800',
  //       news: 'bg-yellow-100 text-yellow-800',
  //       products: 'bg-red-100 text-red-800',
  //       services: 'bg-indigo-100 text-indigo-800'
  //     };
  //     return colors[type] || 'bg-gray-100 text-gray-800';
  //   };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  //   const filteredItems = items.filter(item =>
  //     item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.category.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  // const getCategoryColor = (category) => {
  //   const colors = {
  //     kuliyyah: "bg-purple-100 text-purple-800",
  //     class: "bg-blue-100 text-blue-800",
  //   };
  //   return colors[category] || "bg-gray-100 text-gray-800";
  // };

  return (
    <>
      <SidebarNavigation />
      <MainLayout>
        <div className="p-4 md:p-6">
          <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Content Management
              </h1>
              {/* <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
              <Plus className="h-4 w-4" />
              Add New
            </button> */}

              {/* Add New Dropdown */}
              <div className="relative">
                <button
                  className="bg-blue-600 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Plus className="h-4 w-4" />
                  Add New
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      {addNewOptions.map((option) => (
                        <a
                          key={option.path}
                          href={option.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {option.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Types</option>
                <option value="classes">Classes</option>
                <option value="donations">Donations</option>
                <option value="islamic-videos">Islamic Videos</option>
                <option value="news">News</option>
                <option value="products">Products</option>
                <option value="services">Services</option>
              </select>
            </div>

            <div className="space-y-4">
              {getAllContent().map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200"
                  // onClick={() =>
                  //   (window.location.href = `/${item.type}/${item._id}`)
                  // }
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                          
                          {item.displayTitle}
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${item.type}`}
                          >
                            {item.type
                              .split("-")
                              .join(" ")
                              .charAt(0)
                              .toUpperCase() + item.type.slice(1)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {item.details}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {
                        (currentUser?.role === "admin" || currentUser?.role === "super admin")  &&
                        <>
      {currentUser?.role === "super admin" &&
        (item.isHidden ? (
          <button
            className="p-4 bg-gray-200 hover:bg-green-50 rounded-md transition-colors"
            onClick={() => handleUnflagContent(item)}
          >
            <X className="h-4 w-8 text-green-600" />
          </button>
        ) : (
          <button
            className="p-4 bg-gray-200 hover:bg-yellow-50 rounded-md transition-colors"
            onClick={() => handleFlagContent(item)}
          >
            <Flag className="h-4 w-8 text-yellow-600" />
          </button>
        ))}
              {currentUser?.role === "admin" && item.isHidden && (
        <button
          className="p-4 bg-gray-200 hover:bg-purple-50 rounded-md transition-colors"
          onClick={() => navigate("/chat")} // Navigate to chat page
        >
          Contact Super Admin
        </button>
      )}
                              <button
                                className="p-4 bg-gray-200 hover:bg-blue-50 rounded-md transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log(item.type);
                                  if (item.type === "classes") {
                                    window.location.href = `/kuliyyah/classes/${item._id}`;
                                  } else if (item.type === "donations") {
                                    window.location.href = `/donationAdmin`;
                                  } else if (item.type === "islamic-videos") {
                                    window.location.href = `/Islamic-videos/${item._id}`;
                                  } else if (item.type === "news") {
                                    window.location.href = `/news/edit/${item._id}`;
                                  } else if (item.type === "products") {
                                    window.location.href = `/products/edit/${item._id}`;
                                  } else if (item.type === "services") {
                                    navigate(`/service/edit/${item._id}`);
                                  } else {
                                    window.location.href = `/${item.type}/${item._id}/edit`;
                                  }
                                }}
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                              </button>
                              <button
                                className="p-4 bg-gray-200 hover:bg-red-50 rounded-md transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item.type, item._id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </button>
                            </>
}
                        <ChevronRight className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default ContentList;

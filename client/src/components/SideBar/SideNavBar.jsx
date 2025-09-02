import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, Home, GraduationCap, ShoppingBag, 
  Heart, Info, MessageSquare, User, Menu, X, LogOut,
  ChevronDown, ChevronRight, Store, Wrench
} from 'lucide-react';
import { cn } from "../../lib/utils";
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const SidebarNavigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const { currentUser } = useAuth();
  const [current, setCurrent] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get('http://localhost:3001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrent(userResponse.data);
      } catch (err) {
        
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to log out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
      background: '#fff',
      customClass: {
        title: 'text-gray-800',
        content: 'text-gray-600',
        popup: 'rounded-lg shadow-xl border-2'
      }
    });

    if (result.isConfirmed) {
      try {
        // Show loading state
        Swal.fire({
          title: 'Logging Out',
          text: 'Please wait...',
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          }
        });

        localStorage.removeItem('token');
        await logout();
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Logged Out Successfully',
          text: 'You have been logged out of your account.',
          timer: 1500,
          showConfirmButton: false,
          background: '#fff',
          customClass: {
            popup: 'rounded-lg shadow-xl'
          }
        });
        
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: 'There was an error logging out. Please try again.',
          confirmButtonColor: '#3085d6',
          background: '#fff',
          customClass: {
            popup: 'rounded-lg shadow-xl'
          }
        });
      }
    }
  };

  const serviceSubItems = [
    { path: '/service/shop', label: 'Shop', icon: Store,keyword:'products' },
    { path: '/service/services', label: 'Services', icon: Wrench },
  ];

  const navigationItems = [
    { path: '/activity', label: 'Activity', icon: Activity, hideForUser: true },
    { path: '/homeMM', label: 'Home', icon: Home },
    { path: '/kuliyyah', label: 'Class', icon: GraduationCap, keyword: ['addVideo','islamic-videos','kuliyyah','classes']},
    { 
      path: '/service', 
      label: 'Service & Shop', 
      icon: ShoppingBag,
      hasSubmenu: true,
      subItems: serviceSubItems
    },
    { path: '/donation', label: 'Donation', icon: Heart },
    { path: '/about', label: 'About', icon: Info, keyword:'about' },
    { path: '/chat', label: 'Inbox', icon: MessageSquare, keyword:'chat' },
    { path: '/profile', label:  currentUser?.role === 'super admin' ? 'Add User' : 'Profile', icon: User,keyword:"calendar" },
  ];

  const filteredNavigationItems = navigationItems.filter((item) => {
    if (item.hideForUser && currentUser?.role === "user") {
      return false;
    }
    return true;
  });

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = item.keyword
  ? Array.isArray(item.keyword)
    ? item.keyword.some(keyword => location.pathname.includes(keyword))
    : location.pathname.includes(item.keyword)
  : location.pathname.startsWith(item.path) ||
    (item.hasSubmenu &&
      item.subItems.some(subItem =>
        subItem.keyword
          ? Array.isArray(subItem.keyword)
            ? subItem.keyword.some(keyword => location.pathname.includes(keyword))
            : location.pathname.includes(subItem.keyword)
          : location.pathname.startsWith(subItem.path)
      ));
  

    if (item.hasSubmenu) {
      return (
        <div className="space-y-1">
          <button
            onClick={() => setServiceOpen(!serviceOpen)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
              "text-sm font-medium",
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-400 bg-transparent hover:bg-gray-800 hover:text-white"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon size={18} />
              {item.label}
            </div>
            {serviceOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {serviceOpen && (
            <div className="pl-4">
              {item.subItems.map((subItem) => {
                const SubIcon = subItem.icon;
                const isSubActive = location.pathname === subItem.path;
                
                return (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                      "text-sm font-medium",
                      isSubActive
                        ? "bg-blue-600/50 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    <SubIcon size={16} />
                    {subItem.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
          "text-sm font-medium",
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        )}
      >
        <Icon size={18} />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Masyarakat Masjid
          </h1>
          <button
            className="text-gray-400 hover:text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="bg-gray-900 shadow-lg">
            <ul className="px-2 py-3">
              {filteredNavigationItems.map((item) => (
                <li key={item.path}>
                  <NavItem item={item} />
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-lg
                    text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white
                    transition-colors duration-200"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <nav
        className={cn(
          "bg-gray-900 text-white h-screen fixed z-40",
          "hidden md:flex md:w-64",
          "flex flex-col"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Masyarakat Masjid
          </h1>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {filteredNavigationItems.map((item) => (
              <li key={item.path}>
                <NavItem item={item} />
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
              bg-gray-800 hover:bg-gray-700 transition-colors duration-200
              text-sm font-semibold text-white shadow-lg"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Content Spacer for Mobile Header */}
      <div className="h-14 md:h-0 w-full" />
    </>
  );
};

export default SidebarNavigation;
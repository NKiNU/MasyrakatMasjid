import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../../api/newsApi';
import { Calendar, Star, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../context/AuthContext';

const NewsList = () => {
  const { currentUser } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is admin or super admin
  const isAdminOrSuperAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await newsService.getAllNews();
      setNews(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch news');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await newsService.deleteNews(id);
        fetchNews();
      } catch (err) {
        setError('Failed to delete news');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen md:ml-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-4 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">News & Updates</h1>
          {isAdminOrSuperAdmin && (
            <Link
              to="/news/add"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add News
            </Link>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {item.images && item.images[0] && (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                {item.isHighlighted && (
                  <div className="absolute top-2 right-2">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  </div>
                )}
              </div>
              
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
                    {item.title}
                  </h2>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(item.eventDate).toLocaleDateString()}
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <p className="text-gray-600 line-clamp-2 mb-4">{item.content}</p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <Link
                      to={`/news/${item._id}`}
                      className="flex items-center text-green-600 hover:text-green-700"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    {isAdminOrSuperAdmin && (
                      <>
                        <Link
                          to={`/news/edit/${item._id}`}
                          className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{item.author}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsList;
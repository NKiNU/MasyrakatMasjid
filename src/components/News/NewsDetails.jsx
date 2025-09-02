import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { newsService } from '../../api/newsApi';
import { Calendar, Star, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import MainLayout from '../MainLayout';
import SidebarNavigation from '../SideBar/SideNavBar';

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNewsDetails();
  }, [id]);

  const fetchNewsDetails = async () => {
    try {
      const data = await newsService.getNews(id);
      setNews(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch news details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await newsService.deleteNews(id);
        navigate('/news');
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

  if (!news) {
    return (
      <div className="min-h-screen md:ml-64 p-4">
        <Alert variant="destructive">
          <AlertDescription>News not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
    <SidebarNavigation/>
    <MainLayout>
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 max-w-[1000px] mx-auto">
        <div className="mb-6">
          <Link
            to="/about"
            className="flex items-center text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="overflow-hidden">
          {news.images && news.images.length > 0 && (
            <div className="relative w-full h-96">
              <img
                src={news.images[0]}
                alt={news.title}
                className="w-full h-full object-cover"
              />
              {news.isHighlighted && (
                <div className="absolute top-4 right-4">
                  <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                </div>
              )}
            </div>
          )}

          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{news.title}</h1>
              <div className="flex items-center space-x-4">
                <Link
                  to={`/news/edit/${id}`}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-5 w-5 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5 mr-1" />
                  Delete
                </button>
              </div>
            </div>
            
            <div className="flex items-center mt-4 text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              {new Date(news.eventDate).toLocaleDateString()}
              <span className="mx-4">|</span>
              <span>By {news.author}</span>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            <div className="prose max-w-none">
              {news.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>

            {news.images && news.images.length > 1 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Image Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {news.images.slice(1).map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={image}
                        alt={`${news.title} - ${index + 2}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </MainLayout>
    </>

  );
};

export default NewsDetails;
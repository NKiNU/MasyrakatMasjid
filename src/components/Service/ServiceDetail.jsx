import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Flag, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import serviceApi from '../../services/serviceApi';

const ServiceDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [service, setService] = useState(null);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagMessage, setFlagMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFlag = async () => {
    if (!flagMessage.trim()) {
      toast.error('Please enter a flag message');
      return;
    }

    setLoading(true);
    try {
      await serviceApi.flagService(id, flagMessage);
      toast.success('Service flagged successfully');
      setShowFlagDialog(false);
      // Refresh service details
      const updatedService = await serviceApi.getServiceById(id);
      setService(updatedService);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to flag service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Existing service detail content */}
      
      {currentUser?.role === 'super admin' && (
        <>
          <Button
            variant="outline"
            className="absolute top-4 right-4"
            onClick={() => setShowFlagDialog(true)}
          >
            <Flag className="w-4 h-4 mr-2" />
            Flag Service
          </Button>

          {service?.isFlagged && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full">
              <AlertTriangle className="w-4 h-4" />
              Flagged
            </div>
          )}

          <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Flag Service</DialogTitle>
              </DialogHeader>

              <div className="py-4">
                <label className="block text-sm font-medium mb-2">
                  Please enter the reason for flagging this service:
                </label>
                <Textarea
                  value={flagMessage}
                  onChange={(e) => setFlagMessage(e.target.value)}
                  placeholder="Enter your message here..."
                  rows={4}
                  className="w-full"
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowFlagDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleFlag}
                  disabled={loading}
                >
                  {loading ? 'Flagging...' : 'Flag Service'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ServiceDetail;


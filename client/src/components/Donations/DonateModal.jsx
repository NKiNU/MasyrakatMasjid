import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent } from '../ui/card';
import { Loader2 } from 'lucide-react';
import {formatPaymentDetails} from '../Checkout/paymentUtils';
import { useParams, useNavigate } from 'react-router-dom';






const DonationModal = ({ donationId, onClose }) => {
    
      const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [donationInfo, setDonationInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDonationInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/donations/${donationId}`);
        const data = await response.json();
        setDonationInfo(data);
        console.log(data)
      } catch (error) {
        console.error('Failed to fetch donation info:', error);
        setMessage('Failed to load donation information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonationInfo();
  }, [donationId]);

  const handleDonate = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    const remainingAmount = donationInfo.targetAmount - donationInfo.currentAmount;
    if (parsedAmount > remainingAmount) {
      setMessage(`Amount exceeds remaining target of RM ${remainingAmount}`);
      return;
    }

    // Format payment details using the utility function
    const paymentData = formatPaymentDetails('donation', {
        amount: parsedAmount,
        donationInfo: {
            _id: donationInfo._id,
          title: donationInfo.title,
          description: donationInfo.description
        }
      });

      console.log("This is payment data",paymentData)
  
      navigate('/checkout', { state: paymentData });
    };

  if (isLoading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white">
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Donate to {donationInfo?.title}
            
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card>
            <CardContent className="pt-6">
            <p className="text-gray-600 mb-2">{donationInfo?.description}</p>
              <div className="flex justify-between text-sm text-gray-600">
                
                <span>Target Amount</span>
                <span className="font-medium">RM {donationInfo?.targetAmount}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-600">
                <span>Collected</span>
                <span className="font-medium">RM {donationInfo?.currentAmount}</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{
                    width: `${(donationInfo?.currentAmount / donationInfo?.targetAmount) * 100}%`
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Donation Amount (RM)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full"
              min="0"
              step="0.01"
            />
          </div>

          {message && (
            <Alert variant="destructive">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleDonate}>
            Confirm Donation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
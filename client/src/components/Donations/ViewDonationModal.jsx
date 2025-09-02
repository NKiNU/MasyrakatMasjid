import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Edit2 } from 'lucide-react';

const ViewDonationModal = ({ isOpen, onClose, donation, onEdit, donationLog }) => {
  if (!donation) return null;

  const progress = (donation?.currentAmount / donation?.targetAmount) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl bg-white shadow-xl rounded-lg p-6"
        style={{
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Custom shadow
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex justify-between items-center">
            <span>{donation?.title}</span>
            <Button variant="ghost" size="icon" onClick={() => onEdit(donation)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Campaign Details</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Description:</span><br />
                  {donation?.description}
                </p>
                <div>
                  <span className="font-medium">Progress:</span>
                  <div className="mt-2 space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span >RM{donation?.currentAmount.toLocaleString()} raised</span>
                      <span>RM{donation?.targetAmount.toLocaleString()} goal</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Campaign Period:</span><br />
                  {new Date(donation?.startDate).toLocaleDateString()} - {new Date(donation?.endDate).toLocaleDateString()}
                  {console.log(donation?.startDate)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Donation History</h3>
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Donor</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donationLog?.map((log, index) => (
                      <tr key={index} className="text-sm">
                        <td className="px-4 py-2">{log.userId?.username || 'Anonymous'}</td>
                        <td className="px-4 py-2 text-right">${log?.amount.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">
                          {new Date(log?.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDonationModal;

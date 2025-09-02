// import React, { useState } from 'react';
// import axios from 'axios';

// const AddDonationModal = ({ onClose, onAdd }) => {
//     const [form, setForm] = useState({ title: '', description: '', targetAmount: 0, startDate: '', endDate: '' });

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = () => {
//         axios.post('http://localhost:3001/api/donations', form)
//             .then(response => {
//                 onAdd(response.data); // Add the new donation to the list
//                 onClose(); // Close the modal
//             })
//             .catch(error => console.error(error));
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//                 <h2 className="text-xl font-medium mb-4">Add New Donation</h2>
//                 <div className="grid grid-cols-1 gap-4">
//                     <input
//                         name="title"
//                         placeholder="Title"
//                         className="p-2 border rounded"
//                         onChange={handleChange}
//                     />
//                     <input
//                         name="targetAmount"
//                         type="number"
//                         placeholder="Target Amount"
//                         className="p-2 border rounded"
//                         onChange={handleChange}
//                     />
//                     <textarea
//                         name="description"
//                         placeholder="Description"
//                         className="p-2 border rounded"
//                         rows="3"
//                         onChange={handleChange}
//                     ></textarea>
//                     <input
//                         name="startDate"
//                         type="date"
//                         className="p-2 border rounded"
//                         onChange={handleChange}
//                     />
//                     <input
//                         name="endDate"
//                         type="date"
//                         className="p-2 border rounded"
//                         onChange={handleChange}
//                     />
//                 </div>
//                 <div className="mt-4 flex justify-end">
//                     <button
//                         className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
//                         onClick={onClose}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                         onClick={handleSubmit}
//                     >
//                         Save
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddDonationModal;
import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

const AddDonationModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    targetAmount: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formattedData = {
        ...form,
        targetAmount: parseFloat(form.targetAmount),
        currentAmount: 0,
        donations: []
      };

      const response = await axios.post('http://localhost:3001/api/donations', formattedData);
      onAdd(response.data);
      handleClose();
    } catch (error) {
      console.error('Error adding donation:', error);
    }
  };

  const handleClose = () => {
    setForm({
      title: '',
      description: '',
      targetAmount: '',
      startDate: '',
      endDate: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className=" bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Donation Campaign</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter campaign title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter campaign description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount (RM)</Label>
            <Input
              id="targetAmount"
              name="targetAmount"
              type="number"
              min="0"
              step="0.01"
              value={form.targetAmount}
              onChange={handleChange}
              placeholder="Enter target amount"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDonationModal;
import React from 'react';
import { Dialog, DialogContent } from "../components/ui/dialog";
import { X } from 'lucide-react';

const ImageViewer = ({ image, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-0">
        {/* <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button> */}
        <div className="w-full h-full overflow-y-auto">
          <img
            src={image}
            alt="Full size"
            className="w-full h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;

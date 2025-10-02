import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImagePopupProps {
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

export const ImagePopup = ({ imageUrl, alt, onClose }: ImagePopupProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Close"
      >
        <X className="h-6 w-6 text-white" />
      </button>
      
      <div 
        className="max-w-7xl max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

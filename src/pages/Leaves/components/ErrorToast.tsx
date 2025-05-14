import { useState, useEffect } from 'react';

type ErrorToastProps = {
  message: string;
  onClose: () => void;
};

export default function ErrorToast({ message, onClose }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  function handleClose() {
    setIsVisible(false);
    onClose();
  }

  // Reset visibility when message changes
  useEffect(() => {
    setIsVisible(true);
  }, [message]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                bg-red-100 border border-red-400 text-red-800
                px-4 py-2 rounded shadow-md
                animate-slide-down w-[280px] p-3
                flex flex-col items-center justify-center">
      {message}
      <button
        className="bg-red-500 text-white px-4 py-2 rounded mt-2
                hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        onClick={handleClose}
      >
        Close
      </button>
    </div>
  );
}
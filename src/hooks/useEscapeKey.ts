import { useEffect } from 'react';

const useEscapeKey = (onEscape: () => void, isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onEscape, isActive]);
};

export default useEscapeKey;

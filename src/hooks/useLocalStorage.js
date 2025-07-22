import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  // State initialization with localStorage data
  const [value, setValue] = useState(() => {
    try {
      // Only run this on client-side (avoid SSR issues)
      if (typeof window !== 'undefined') {
        const storedValue = window.localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  // Debounce save to localStorage
  useEffect(() => {
    let timer;
    const saveToStorage = () => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    };

    // Debounce the save operation (300ms delay)
    timer = setTimeout(saveToStorage, 300);
    
    // Cleanup timeout on unmount or value change
    return () => clearTimeout(timer);
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
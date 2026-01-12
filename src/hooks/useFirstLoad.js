import { useEffect, useState } from 'react';

// Custom hook to detect if this is the first load from loading screen
export const useFirstLoad = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(() => {
    // Check if we've ever loaded the app before in this session
    return !sessionStorage.getItem('hasLoadedOnce');
  });

  useEffect(() => {
    if (isFirstLoad) {
      // Mark that we've loaded once in this session
      sessionStorage.setItem('hasLoadedOnce', 'true');
      
      // After the animation runs once, set to false
      const timer = setTimeout(() => {
        setIsFirstLoad(false);
      }, 100); // Small delay to ensure the component has mounted

      return () => clearTimeout(timer);
    }
  }, [isFirstLoad]);

  return isFirstLoad;
};
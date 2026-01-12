import { createContext } from "react";
import { useState } from "react";

const TransitionContext = createContext({ 
  completed: false,
  previousRoute: null,
  currentRoute: null,
  isFromLoading: false
});

export const TransitionProvider = ({ children }) => {
  const [completed, setCompleted] = useState(false);
  const [previousRoute, setPreviousRoute] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [isFromLoading, setIsFromLoading] = useState(false);

  const toggleCompleted = (value) => {
    setCompleted(value);
  };

  const updateRoute = (newRoute) => {
    setPreviousRoute(currentRoute);
    setCurrentRoute(newRoute);
    
    // Check if this is the first navigation from loading to home
    if (previousRoute === null && newRoute === "/" && !currentRoute) {
      setIsFromLoading(true);
    } else {
      setIsFromLoading(false);
    }
  };

  const resetFromLoading = () => {
    setIsFromLoading(false);
  };

  return (
    <TransitionContext.Provider
      value={{
        toggleCompleted,
        completed,
        previousRoute,
        currentRoute,
        isFromLoading,
        updateRoute,
        resetFromLoading,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

export default TransitionContext;

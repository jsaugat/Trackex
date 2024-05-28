import React, { createContext, useContext, useState } from "react";

//? Create a Context for the sidebar
const SidebarContext = createContext();

//? Create a custom provider component
export const SidebarProvider = ({ children }) => {
  // State
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Toggle handler
  const toggleSidebar = () => setIsCollapsed((prevState) => !prevState);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

//? Create a custom hook to use the Sidebar context
export const useSidebar = () => {
  return useContext(SidebarContext);
};

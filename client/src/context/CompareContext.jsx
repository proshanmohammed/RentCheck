import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareListings, setCompareListings] = useState(() => {
    try {
      const saved = localStorage.getItem('rentcheck_compare');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('rentcheck_compare', JSON.stringify(compareListings));
    } catch (e) {
      console.warn('Failed to persist comparison listings:', e);
    }
  }, [compareListings]);

  const addToCompare = (listing) => {
    setCompareListings((prev) => {
      if (prev.some((item) => item.id === listing.id)) {
        return prev;
      }
      if (prev.length >= 3) {
        // Keep max 3 listings
        const updated = [...prev.slice(1), listing];
        return updated;
      }
      return [...prev, listing];
    });
    setIsDrawerOpen(true);
  };

  const removeFromCompare = (id) => {
    setCompareListings((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompare = () => {
    setCompareListings([]);
    setIsDrawerOpen(false);
  };

  const isComparing = (id) => {
    return compareListings.some((item) => item.id === id);
  };

  const toggleCompare = (listing) => {
    if (isComparing(listing.id)) {
      removeFromCompare(listing.id);
    } else {
      addToCompare(listing);
    }
  };

  return (
    <CompareContext.Provider
      value={{
        compareListings,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        toggleCompare,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}

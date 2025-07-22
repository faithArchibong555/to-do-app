import { useState } from 'react';

const FilterTabs = ({ activeTab, onTabChange }) => {
  const tabs = ['All', 'Active', 'Completed'];

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`text-sm sm:text-base px-2 py-1 relative transition-all duration-200 ${
            activeTab === tab 
              ? 'font-bold text-blue-500' 
              : 'text-black hover:text-gray-600'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
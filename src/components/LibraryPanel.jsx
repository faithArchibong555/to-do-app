import { useState, useEffect } from 'react';

const LibraryPanel = ({ isOpen, onClose, currentTasks, setCurrentTasks }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [taskHistory, setTaskHistory] = useState([]);

  // Load task history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('task-history');
    if (savedHistory) {
      try {
        setTaskHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing task history:', error);
        setTaskHistory([]);
      }
    }
  }, []);

  // Save to history when tasks are completed or deleted
  useEffect(() => {
    if (taskHistory.length > 0) {
      localStorage.setItem('task-history', JSON.stringify(taskHistory));
    }
  }, [taskHistory]);

  // Add current tasks to history when they change
  useEffect(() => {
    const now = new Date().toISOString();
    const newHistory = [...taskHistory];
    
    currentTasks.forEach(task => {
      const existingIndex = newHistory.findIndex(t => t.id === task.id);
      
      if (existingIndex === -1) {
        // New task
        newHistory.push({
          ...task,
          addedToHistoryAt: now,
          originalCreatedAt: task.createdAt || now
        });
      } else {
        // Update existing task
        newHistory[existingIndex] = {
          ...newHistory[existingIndex],
          ...task,
          lastUpdated: now
        };
      }
    });

    setTaskHistory(newHistory);
  }, [currentTasks]);

  // Filter and group tasks
  const filteredTasks = taskHistory.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || 
                         (activeFilter === 'Completed' && task.completed) ||
                         (activeFilter === 'Active' && !task.completed);
    return matchesSearch && matchesFilter;
  });

  // Group tasks by date
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = new Date(task.addedToHistoryAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  // Re-add task to current tasks
  const reAddTask = (task) => {
    const newTask = {
      id: Date.now(),
      text: task.text,
      completed: false,
      createdAt: new Date().toISOString(),
      originalFromHistory: task.id
    };
    
    setCurrentTasks(prev => [...prev, newTask]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 translate-x-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Task History
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-4 space-y-4 border-b border-gray-200 dark:border-gray-700">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search past tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4">
              {['All', 'Completed', 'Active'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeFilter === filter
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto">
            {Object.keys(groupedTasks).length === 0 ? (
              // Empty State
              <div className="text-center py-12 px-4">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No task history yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No tasks match your search' : 'Completed and deleted tasks will appear here'}
                </p>
              </div>
            ) : (
              // Grouped Tasks
              <div className="p-4 space-y-6">
                {Object.entries(groupedTasks)
                  .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                  .map(([date, tasks]) => (
                    <div key={date}>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                        {date}
                      </h3>
                      <div className="space-y-2">
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              {/* Status Icon */}
                              {task.completed ? (
                                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              )}
                              
                              {/* Task Text */}
                              <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                {task.text}
                              </span>
                            </div>
                            
                            {/* Re-add Button */}
                            <button
                              onClick={() => reAddTask(task)}
                              className="p-2 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              aria-label="Re-add task"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryPanel;
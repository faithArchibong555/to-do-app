import { useState, useEffect, useRef } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import Navbar from "./components/Navbar";
import LibraryPanel from "./components/LibraryPanel";

export default function TodoLanding() {
  const [tasks, setTasks] = useLocalStorage("todo-tasks", []);
  const [taskHistory, setTaskHistory] = useLocalStorage("task-history", []);
  const [filter, setFilter] = useState('All');
  const [showLibrary, setShowLibrary] = useState(false);
  const previousTasksRef = useRef([]);

  // ---- PWA Install Button State ----
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  // 1. Listen for beforeinstallprompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

 // ---- Auto-Cleanup Logic: Daily Refresh (Archiving) ----
useEffect(() => {
  const archiveOldCompletedTasks = () => {
    const today = new Date().setHours(0, 0, 0, 0);

    setTasks(prevTasks => {
      return prevTasks.filter(task => {
        // 1. Keep all Active tasks
        if (!task.completed) return true;

        // 2. Keep tasks completed TODAY
        const completionDate = task.completedAt ? new Date(task.completedAt).setHours(0, 0, 0, 0) : today;
        const isFromPreviousDay = completionDate < today;

        // 3. If it's old, it will be removed from main list. 
        // Because 'completed' is true, your History Effect will keep it in 'Completed'.
        return !isFromPreviousDay;
      });
    });
  };

  archiveOldCompletedTasks();
  const interval = setInterval(archiveOldCompletedTasks, 3600000); 
  return () => clearInterval(interval);
}, [setTasks]);

  // 3. Update task history whenever tasks change
  useEffect(() => {
    const now = new Date().toISOString();
    let updatedHistory = [...taskHistory];
    let hasChanges = false;

// Check for deleted tasks
previousTasksRef.current.forEach(prevTask => {
  const stillExists = tasks.some(currentTask => currentTask.id === prevTask.id);
  
  if (!stillExists) {
    const existingInHistory = updatedHistory.find(t => t.id === prevTask.id);
    
    // MODIFIED LOGIC: 
    // If the task was COMPLETED when it disappeared, DO NOT mark it as deleted.
    // This keeps it in the "Completed" tab of your LibraryPanel.
    if (prevTask.completed) {
      hasChanges = false; // It stays in history exactly as it was: completed.
    } else if (existingInHistory && !existingInHistory.deleted) {
      // It was an active task that was manually deleted
      updatedHistory = updatedHistory.map(t => 
        t.id === prevTask.id 
          ? { ...t, deleted: true, deletedAt: now }
          : t
      );
      hasChanges = true;
    }
  }
});

    // Check for new or modified tasks
    tasks.forEach(currentTask => {
      const existingInHistory = updatedHistory.find(t => t.id === currentTask.id);
      
      if (!existingInHistory) {
        updatedHistory.push({
          ...currentTask,
          addedToHistoryAt: now,
          deleted: false
        });
        hasChanges = true;
      } else {
        if (existingInHistory.completed !== currentTask.completed ||
            existingInHistory.text !== currentTask.text) {
          updatedHistory = updatedHistory.map(t => 
            t.id === currentTask.id 
              ? { 
                  ...t, 
                  completed: currentTask.completed,
                  text: currentTask.text,
                  completedAt: currentTask.completed ? now : t.completedAt,
                  deleted: false 
                }
              : t
          );
          hasChanges = true;
        }
        
        if (existingInHistory.deleted) {
          updatedHistory = updatedHistory.map(t => 
            t.id === currentTask.id ? { ...t, deleted: false, deletedAt: null } : t
          );
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setTaskHistory(updatedHistory);
    }
    
    previousTasksRef.current = tasks;
  }, [tasks, taskHistory, setTaskHistory]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Navbar tasks={tasks} onOpenLibrary={() => setShowLibrary(true)} />
      
      <div className="max-w-md mx-auto p-4 pt-24">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <AddTask tasks={tasks} setTasks={setTasks} />
            
            <div className="flex gap-4 mb-6">
              {['All', 'Active', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`pb-1 ${filter === tab 
                    ? 'font-bold text-blue-500 dark:text-blue-300 border-b-2 border-blue-500 dark:border-blue-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-5xl mb-4">📋</div>
                <p>
                  {filter === 'All' 
                    ? "No tasks yet. Add one above!" 
                    : `No ${filter.toLowerCase()} tasks`
                  }
                </p>
              </div>
            ) : (
              <TaskList tasks={filteredTasks} allTasks={tasks} setTasks={setTasks} />
            )}

            {showInstall && (
              <button
                onClick={handleInstallClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mt-6"
              >
                📥 Install App
              </button>
            )}
          </div>
        </div>
      </div>

      {showLibrary && (
        <LibraryPanel
          isOpen={showLibrary}
          onClose={() => setShowLibrary(false)}
          taskHistory={taskHistory}
          setTaskHistory={setTaskHistory}
          setCurrentTasks={setTasks}
        />
      )}
    </div>
  );
}
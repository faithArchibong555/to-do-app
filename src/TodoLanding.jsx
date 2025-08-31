import { useState } from "react";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import DarkModeToggle from "./components/DarkModeToggle";
import useLocalStorage from "./hooks/useLocalStorage";
import Navbar from "./components/Navbar";

export default function TodoLanding() {
  const [tasks, setTasks] = useLocalStorage("todo-tasks", []);
  const [filter, setFilter] = useState('All');
  const [showLibrary, setShowLibrary] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
      <Navbar tasks={tasks} onOpenLibrary={() => setShowLibrary(true)} />

        <div className="max-w-md mx-auto p-4 pt-24"></div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
       
        <div className="p-6">
          <AddTask tasks={tasks} setTasks={setTasks} />
          
          {/* Filter tabs */}
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

          {/* Task list - NOW WITH allTasks PROP */}
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
            <TaskList 
              tasks={filteredTasks} 
              allTasks={tasks}  /* Critical fix added here */
              setTasks={setTasks} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
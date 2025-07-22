import { useState } from "react";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import DarkModeToggle from "./components/DarkModeToggle";
import useLocalStorage from "./hooks/useLocalStorage";

export default function TodoLanding() {
  const [tasks, setTasks] = useLocalStorage("todo-tasks", []);
  const [filter, setFilter] = useState('All');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Header with toggle */}
        <div className="p-6 bg-blue-500 dark:bg-blue-600 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <DarkModeToggle />
        </div>

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
import { useState } from 'react'

const TaskList = ({ tasks, allTasks, setTasks }) => {
 const toggleTask = (id) => {
  setTasks(allTasks.map(task => 
    task.id === id 
      ? { 
          ...task, 
          completed: !task.completed, 
          completedAt: !task.completed ? new Date().toISOString() : null 
        } 
      : task
  ))
}

  const deleteTask = (id) => {
    setTasks(allTasks.filter(task => task.id !== id))
  }

  

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-500"
            />
            <div className="flex flex-col">
            <span
            className={`${
            task.completed
            ? 'line-through text-gray-400'
            : 'text-gray-800 dark:text-gray-200'
            }`}
            >
             {task.text}
           </span>

           {task.deadline && (
             <span className="text-xs text-gray-500">
             ⏰ {new Date(task.deadline).toLocaleString()}
           </span>
            )}
           </div>

          </div>
          
          <button 
            onClick={() => deleteTask(task.id)}
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1"
            aria-label="Delete task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export default TaskList
import { useState, useRef } from "react";

export default function AddTask({ tasks, setTasks }) {
  const [input, setInput] = useState("");
  const [deadline, setDeadline] = useState("");

  // Ref to hidden datetime input
  const deadlineRef = useRef(null);

  const handleAddTask = () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      alert("Task cannot be empty!");
      return;
    }

    if (tasks.some(task => task.text.toLowerCase() === trimmedInput.toLowerCase())) {
      alert("Task already exists!");
      return;
    }

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: trimmedInput,
        completed: false,
        deadline: deadline || null,
        notified: false,
      },
    ]);

    setInput("");
    setDeadline("");
  };

  return (
 <div className="flex gap-2 mb-6 w-full items-center">
  {/* Task input */}
  <input
    type="text"
    placeholder="What needs to be done?"
    className="flex-1 min-w-0 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
  />

  {/* Deadline icon */}
  <div className="relative w-10 h-10 flex items-center justify-center border border-gray-300 rounded">
    {/* Icon */}
    <span className="text-lg pointer-events-none">⏰</span>

    {/* Invisible but clickable input */}
    <input
      type="datetime-local"
      value={deadline}
      onChange={(e) => setDeadline(e.target.value)}
      className="absolute inset-0 opacity-0 w-full h-full"
    />
  </div>

  {/* Add button */}
  <button
    onClick={handleAddTask}
    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-10 h-10 flex items-center justify-center"
  >
    +
  </button>
</div>

  );
}

import { useState } from "react";

export default function AddTask({ tasks, setTasks }) {
  const [input, setInput] = useState("");
  const [deadline, setDeadline] = useState("");


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

  setDeadline("");


    setInput("");
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="What needs to be done?"
        className="flex-1 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
      />

      <input
      type="datetime-local"
      value={deadline}
      onChange={(e) => setDeadline(e.target.value)}
      className="p-2 border border-gray-300 rounded text-sm max-w-[135px]"
      />


      <button
        onClick={handleAddTask}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        +
      </button>
    </div>
  );
}
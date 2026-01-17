import React from 'react';
import ReactDOM from 'react-dom/client';
import TodoLanding from './TodoLanding'; // Directly import TodoLanding
import './index.css'

// Add dark mode class if previously selected
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TodoLanding />  {/* No App.jsx wrapper needed */}
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })
}
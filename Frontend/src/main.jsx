// Handles the main entry point for the React application
// Imports the necessary libraries and components
// Sets the root for the react application

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

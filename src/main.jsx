import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import TodoPage from './page/TodoPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/ToDo-app-Frontend-React">
      <Routes>
        <Route path="/signin" element={<TodoPage />} />
        <Route path="/signup" element={<TodoPage />} />
        <Route path="/tasks" element={<TodoPage />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

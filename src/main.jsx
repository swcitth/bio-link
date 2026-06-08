import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 1. นำเข้า BrowserRouter ตรงนี้
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 👈 2. เอามาครอบ App แบบนี้ */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
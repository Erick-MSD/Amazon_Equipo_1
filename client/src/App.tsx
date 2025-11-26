import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import EchoDot from './pages/EchoDot'
import logoSvg from './assets/img/Amazon_logo.svg'

export default function App() {
  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/echo-dot" element={<EchoDot/>} />
      </Routes>
    </div>
  )
}

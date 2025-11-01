import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

function App(): JSX.Element {
  return (
    <div>
      <h1>App</h1>
    </div>
  )
}

const container = document.getElementById('root')!
createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

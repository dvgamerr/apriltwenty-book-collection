import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import GreenCorner from './components/corner-background.jsx'
import HomePage from './pages/Home.jsx'
import HeaderNavBar from './components/header-nav-bar.jsx';

function App() {

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <GreenCorner />

      <BrowserRouter>
        <HeaderNavBar />
        <Routes>
          <Route path='/' element={ <HomePage /> } /> 
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import GreenCorner from './components/corner-background.jsx'
import HomePage from './pages/Home.jsx'
import HeaderNavBar from './components/header-nav-bar.jsx';
import BookInfoPage from './pages/BookInfoPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

function App() {

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <GreenCorner />

      <BrowserRouter>
        <HeaderNavBar />
        <Routes>
          <Route path='/' element={ <HomePage /> } /> 
          <Route path='/books/:id' element={ <BookInfoPage /> } />
          <Route path='/auth/register' element={ <RegisterPage /> } /> 
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

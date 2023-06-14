import { Route, Routes } from 'react-router-dom';
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import Information from './pages/Information'
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import Update from './pages/Update'


function App() {


  return (
    <div className='App'>
      <Toaster />
      <Header />
      <div className='pt-16 bg-slate-100 min-h-screen'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/information' element={<Information />} />
          <Route path='/update' element={<Update />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}


export default App;

import { Route, Routes } from 'react-router-dom';
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import Information from './pages/Information'
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import Update from './pages/Update'
import Auth from './pages/Auth'
import Logout from './pages/Logout'
import Login from './pages/Login'
import bigInt from "big-integer";
import axios from 'axios';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import forge from 'node-forge';
import { decryptAES } from './utility';

function App() {

  const location = useLocation()
  useEffect(() => {
    // const p = bigInt('112233445566778899');
    // const g = bigInt('2'); 

    axios.get('http://localhost:8080/getSubKey')
      .then(res => {
        const subKey = bigInt(res.data.key)
        const bigPrime = bigInt(res.data.prime)
        const privateKey = bigInt(process.env.REACT_APP_PRIVATE_KEY)

        const sharedKey = subKey.modPow(privateKey, bigPrime);
        sessionStorage.setItem('sharedKey', sharedKey.value)
      })


  }, [])



  const dataCookies = document.cookie.split(';').filter(cookie => cookie.trim().startsWith('data='));
  const isData = dataCookies.length
  if (isData) {
    const data = dataCookies[0].split("data=")[1]
    const sharedKey = sessionStorage.getItem('sharedKey')

    if (sharedKey) {
      const dataJson = JSON.parse(decryptAES(data, sharedKey))
      const { name, sex, birth, phone, email, signature } = dataJson

      // Xác thực chữ kí số 
      const publicKey = forge.pki.publicKeyFromPem(process.env.REACT_APP_PUBLIC_KEY_SIGNATURE);
      const md2 = forge.md.sha256.create();
      md2.update(name + sex + birth + phone + email, 'utf8');
      const verified = publicKey.verify(md2.digest().bytes(), signature);

      if (verified) {
        sessionStorage.setItem('user', JSON.stringify(dataJson))
      }
    }
  }


  return (
    <div className='App'>
      <Toaster />
      {!(location.pathname === '/auth' || location.pathname === '/login' || location.pathname === '/logout') && <Header />}
      <div className='pt-16 bg-slate-100 min-h-screen'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/information' element={<Information />} />
          <Route path='/update' element={<Update />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
      {!(location.pathname === '/auth' || location.pathname === '/login' || location.pathname === '/logout') && <Footer />}
    </div>
  );
}


export default App;

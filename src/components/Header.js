import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Update from './Update'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import forge from 'node-forge';
import { useLocation } from "react-router-dom";


const SERVER_URL = 'http://localhost:8080'

export default function Header() {

    const location = useLocation().pathname

    const storageUser = JSON.parse(sessionStorage.getItem('user'))
    const [user, setUser] = useState(storageUser ?? null)

    const storageRegister = JSON.parse(sessionStorage.getItem('register'))
    const [isRegister, setIsRegister] = useState(storageRegister ?? null)

    useEffect(() => {
        const usernameCookies = document.cookie.split(';').filter(cookie => cookie.trim().startsWith('token='));
        if (usernameCookies.length) {
            const token = usernameCookies[0].split("token=")[1]
            axios.get(`${SERVER_URL}/user-info`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    const { name, sex, birth, phone, email, signature } = res.data.info
                    // Xác thực chữ kí số 
                    const publicKey = forge.pki.publicKeyFromPem(res.data.info.publickey);
                    const md2 = forge.md.sha256.create();
                    md2.update(name + sex + birth + phone + email, 'utf8');
                    const verified = publicKey.verify(md2.digest().bytes(), signature);

                    if (verified) {
                        setUser(res.data.info)
                        sessionStorage.setItem('user', JSON.stringify(res.data.info))
                    }
                    else toast("Xác thực chữ kí không thành công.")
                })
                .catch()
        }

    }, [])


    const handleLogin = () => {
        const popup = window.open(`${SERVER_URL}/parent-login-popup`, 'Login');
        const timer = setInterval(() => {
            if (popup.closed) {
                clearInterval(timer);
            }
        }, 500);
    }

    const handleLogout = () => {
        const popup = window.open(`${SERVER_URL}/parent-logout-popup`, 'Logout');
        const timer = setInterval(() => {
            if (popup.closed) {
                clearInterval(timer);
            }
        }, 500);
    }

    // Lắng nghe sự kiện message từ cửa sổ popup
    window.addEventListener('message', (event) => {
        if (event.origin !== `${SERVER_URL}`) {
            return;
        }

        // Xử lý token nhận được từ cửa sổ popup
        if (event.data && event.data.type === "LOGOUT") {
            //Xóa token trong cookie
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

            sessionStorage.removeItem('user')
            sessionStorage.removeItem('userupdate')

            window.location.href = '/'

        }
        else if (event.data) {
            axios.get(`${SERVER_URL}/user-info`, { headers: { Authorization: `Bearer ${event.data.token}` } })
                .then(res => {
                    if (res.data.info.name) {
                        const { name, sex, birth, phone, email, signature } = res.data.info
                        // Xác thực chữ kí số 
                        const publicKey = forge.pki.publicKeyFromPem(res.data.info.publickey);
                        const md2 = forge.md.sha256.create();
                        md2.update(name + sex + birth + phone + email, 'utf8');
                        const verified = publicKey.verify(md2.digest().bytes(), signature);

                        if (verified) {
                            setUser(res.data.info)
                            sessionStorage.setItem('user', JSON.stringify(res.data.info))
                            document.cookie = `token=${event.data.token}; path=/`
                        }
                        else {
                            toast('Xác thực chữ kí không thành công.')
                        }


                    }
                    else {
                        toast("Bạn chưa có thông tin, hãy đăng kí.")
                        setUser(res.data.info)
                        sessionStorage.setItem('user', JSON.stringify(res.data.info))
                        document.cookie = `token=${event.data.token}; path=/`
                        setIsRegister(true)
                        sessionStorage.setItem('register', 'true')
                    }
                })
                .catch()
        }


    });

    return (
        <div className='flex fixed shadow-md w-full h-16 bg-blue-300 justify-between items-center md:px-20 px-2'>
            <div className='flex h-full'>
                <Link to='/' className='h-full'>
                    <img alt='' src='/img/logo.png' className='h-full'></img>
                </Link>
                <div className='flex gap-6 ml-40 items-center'>
                    <Link to='/' className={location !== '/information' && location !== '/update' ? 'text-red-600' : ''} >Trang chủ</Link>
                    {user && <Link to='/information' className={location === '/information' ? 'text-red-600' : ''}>Thông tin</Link>}
                    {user && <Link to='/update' className={location === '/update' ? 'text-red-600' : ''}>Cập nhật</Link>}
                </div>
            </div>
            <div className='flex gap-6'>
                {user && <p>{user.username}</p>}
                {!user && <p className='cursor-pointer' onClick={handleLogin}>Đăng nhập</p>}
                {user && <p className='cursor-pointer' onClick={handleLogout}>Đăng xuất</p>}
            </div>

            {/* Phần đăng kí  */}
            {isRegister &&
                <div className='fixed top-0 right-0 left-0 bottom-0 bg-slate-400'>
                    <Update props={'Đăng kí'} />
                </div>
            }
        </div>
    )
}

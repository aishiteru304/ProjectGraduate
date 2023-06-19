import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from "react-router-dom";



export default function Header() {

    const location = useLocation().pathname

    const user = JSON.parse(sessionStorage.getItem('user'))





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
                {!user && <Link to='/login'>Đăng nhập</Link>}
                {user && <Link to='/logout' >Đăng xuất</Link>}
            </div>


        </div>
    )
}

import React, { useRef } from 'react'

export default function Information() {

    // const storageUser = JSON.parse(localStorage.getItem('user'))
    const storageUser = JSON.parse(sessionStorage.getItem('user'))
    const storageUserUpdate = JSON.parse(sessionStorage.getItem('userupdate'))
    const userRef = useRef(storageUserUpdate ?? storageUser)
    const user = userRef.current

    return (
        <div className='mt-20 '>
            {user &&
                <div>
                    <div className='mx-auto max-w-max text-xl bg-white p-10 rounded-md'>
                        <h1 className='flex mt-2'><p className='min-w-[200px] font-medium'>Tên:</p> {user.name}</h1>
                        <h1 className='flex mt-2'><p className='min-w-[200px] font-medium'>Giới tính:</p> {user.sex}</h1>
                        <h1 className='flex mt-2'><p className='min-w-[200px] font-medium'>Ngày Sinh:</p> {user.birth}</h1>
                        <h1 className='flex mt-2'><p className='min-w-[200px] font-medium'>Số điện thoại:</p> {user.phone}</h1>
                        <h1 className='flex mt-2'><p className='min-w-[200px] font-medium'>Email:</p> {user.email}</h1>

                    </div>
                </div>
            }
        </div>
    )
}

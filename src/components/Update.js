import React, { useRef, useState } from 'react'
import { toast } from 'react-hot-toast';
// import { encryptAES } from '../utility'
import axios from 'axios';

export default function UpdateComponent({ props }) {

    // const storageUser = JSON.parse(localStorage.getItem('user'))
    const storageUser = JSON.parse(sessionStorage.getItem('user'))
    const storageUserUpdate = JSON.parse(sessionStorage.getItem('userupdate'))
    const userRef = useRef(storageUserUpdate ?? storageUser)
    const { username, key, ...rest } = userRef.current

    const [info, setInfo] = useState(rest)


    const handleOnchange = (e) => {
        const { name, value } = e.target
        setInfo(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const checkEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleUpdate = () => {
        if (info.name && info.sex && info.birth && info.phone && info.email) {
            if (checkEmail(info.email) && !isNaN(info.phone) && info.phone[0] === '0' && info.phone.length === 10) {

                axios.post('http://localhost:8080/update', { username, key, name: info.name, sex: info.sex, birth: info.birth, phone: info.phone, email: info.email })
                    .then(() => {
                        sessionStorage.removeItem('register')
                        sessionStorage.setItem('userupdate', JSON.stringify({ username, key, name: info.name, sex: info.sex, birth: info.birth, phone: info.phone, email: info.email }))
                        // const sharedKey = sessionStorage.getItem('sharedKey')
                        // if (sharedKey) {
                        //     const infoData = encryptAES(JSON.stringify({ username, key, name: info.name, sex: info.sex, birth: info.birth, phone: info.phone, email: info.email }), sharedKey)
                        //     document.cookie = `data=${infoData}; path=/`
                        //     // localStorage.setItem('data', infoData)
                        // }
                        toast(`${props} thành công.`)
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 1000)
                    })
                    .catch((err) => {
                        toast(`${props} thất bại.`)
                        console.log(err)
                    })

            }
            else
                toast("Định dạng email hoặc số điện thoại không hợp lệ")
        }
        else {
            toast('Vui lòng điền đầy đủ các trường.')
        }
    }

    return (
        <div className='container mt-5 mx-auto max-w-max bg-white p-8 rounded-md'>
            {info &&
                <div>

                    <div >
                        <label className='block'>Name:</label>
                        <input placeholder='name' name='name' className='mt-1 mb-4 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300 max-w-[200px]' value={info.name} onChange={handleOnchange}></input>
                    </div>

                    <div className='flex flex-wrap mb-2'>
                        <label className='block w-full'>Sex:</label>
                        <input placeholder='sex' className='mt-1 mb-2 h-[34px] w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300 max-w-[200px]' readOnly value={info.sex}></input>
                        <select id="gender" name="sex" className='bg-slate-200 rounded-md ml-4 mt-[4px] h-[34px]' onChange={handleOnchange}>
                            <option value="">Sex</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    </div>

                    <div>
                        <label className='block'>Birth day:</label>
                        <input placeholder='birthday' type='date' pattern="\d{2}/\d{2}/\d{4}" name='birth' className='mt-1 mb-4 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300 max-w-[200px]' value={info.birth} onChange={handleOnchange}></input>
                    </div>

                    <div >
                        <label className='block'>Phone Number:</label>
                        <input placeholder='phoneNumber' name='phone' className='mt-1 mb-4 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300 max-w-[200px]' value={info.phone} onChange={handleOnchange}></input>
                    </div>

                    <div >
                        <label className='block'>Email:</label>
                        <input placeholder='email' name='email' className='mt-1 mb-4 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300 max-w-[200px]' value={info.email} onChange={handleOnchange}></input>
                    </div>

                    <button className='bg-green-800 px-4 py-2 rounded-md text-white' onClick={handleUpdate}>{props}</button>
                </div>
            }
        </div>
    )
}

import React, { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import forge from 'node-forge';
import { encryptAES } from '../utility';
import Update from './Update';

export default function Login() {

    const [isShowKey, setIsShowKey] = useState(false)
    const [account, setAccount] = useState()
    const inputRef = useRef()
    const storageRegister = sessionStorage.getItem('register')
    const [isRegister, setIsRegister] = useState(storageRegister ?? false)

    function handleLogin() {
        if (window.ethereum) {

            window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{
                    eth_accounts: {},
                }],
            })
        }
        else {
            alert('Bạn chưa tải metamask')
        }
    }

    //Lắng nghe sự thay đổi account trên metamask
    window.ethereum.on('accountsChanged', function (newAccount) {
        //Nếu tồn tại account mới
        if (newAccount[0]) {
            // Tạo 1 thẻ input yêu cầu đăng nhập key tại đây 
            setIsShowKey(true)
            setAccount(newAccount[0])
        }
        else {
            //Nếu không tồn tại account mới => đăng xuất
            window.close()
        }
    })


    const handleContinue = () => {
        if (account) {
            if (inputRef.current.value === '123456') {
                axios.post(`http://localhost:8080/login`, { username: account, key: inputRef.current.value })
                    .then((result) => {
                        axios.get(`http://localhost:8080/user-info`, { headers: { Authorization: `Bearer ${result.data.token}` } })
                            .then(res => {
                                if (res.data.info.name) {
                                    const { name, sex, birth, phone, email, signature } = res.data.info

                                    // Xác thực chữ kí số 
                                    const publicKey = forge.pki.publicKeyFromPem(process.env.REACT_APP_PUBLIC_KEY_SIGNATURE);
                                    const md2 = forge.md.sha256.create();
                                    md2.update(name + sex + birth + phone + email, 'utf8');
                                    const verified = publicKey.verify(md2.digest().bytes(), signature);

                                    if (verified) {
                                        sessionStorage.setItem('user', JSON.stringify(res.data.info))
                                        sessionStorage.setItem('token', result.data.token)
                                        // Mới thêm vào
                                        const sharedKey = sessionStorage.getItem('sharedKey')
                                        if (sharedKey) {
                                            const infoData = encryptAES(JSON.stringify(res.data.info), sharedKey)
                                            document.cookie = `data=${infoData}; path=/`
                                            toast("Đăng nhập thành công")
                                            setTimeout(() => {
                                                window.location.href = '/'
                                            }, 1000)
                                        }
                                    }
                                    else {
                                        toast('Xác thực chữ kí không thành công.')
                                    }

                                }
                                else {
                                    toast("Bạn chưa có thông tin, hãy đăng kí.")
                                    sessionStorage.setItem('user', JSON.stringify(res.data.info))
                                    setIsRegister(true)
                                    sessionStorage.setItem('register', 'true')

                                }
                            })
                            .catch()
                    })
                    .catch(err => {
                        alert('Tên đăng nhập hoặc mật khẩu không đúng')
                        console.log('Lỗi đăng nhập', err);
                    });

            }
            else {
                toast("Invalid key")
            }
        }
    }

    return (
        <div className='flex flex-col'>
            <button className='mx-auto p-4 bg-slate-800 rounded-md text-white' onClick={handleLogin}>Đăng nhập bằng tài khoản metamask</button>
            {isShowKey && <div className='flex flex-col'>
                <input placeholder='enter your key' className='w-max p-2 mx-auto mt-4 rounded-md bg-blue-200' ref={inputRef}></input>
                <button onClick={handleContinue} className='mx-auto p-2 mt-4 bg-slate-800 rounded-md text-white' >Tiếp tục</button>
            </div>}

            {/* Phần đăng kí  */}
            {isRegister &&
                <div className='fixed top-0 right-0 left-0 bottom-0 bg-slate-400'>
                    <Update props={'Đăng kí'} />
                </div>
            }

        </div>
    )
}

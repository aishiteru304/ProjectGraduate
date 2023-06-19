import React, { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { encryptAES } from '../utility'
import forge from 'node-forge';

export default function Auth() {

    const [isShowKey, setIsShowKey] = useState(false)
    const [account, setAccount] = useState()
    const inputRef = useRef()

    // const data = localStorage.getItem('data')
    const dataCookies = document.cookie.split(';').filter(cookie => cookie.trim().startsWith('data='));
    const isData = dataCookies.length


    if (isData) {
        const data = dataCookies[0].split("data=")[1]
        window.opener.postMessage(data, 'http://localhost:4000');
        setTimeout(() => {
            window.close()
        }, 500)
    }

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

                                        // Mới thêm vào
                                        const sharedKey = sessionStorage.getItem('sharedKey')
                                        if (sharedKey) {
                                            const infoData = encryptAES(JSON.stringify(res.data.info), sharedKey)
                                            document.cookie = `data=${infoData}; path=/`
                                            window.opener.postMessage(infoData, 'http://localhost:4000');

                                            setTimeout(() => {
                                                window.close()
                                            }, 500)
                                        }
                                    }
                                    else {
                                        toast('Xác thực chữ kí không thành công.')
                                    }

                                }
                                else {
                                    toast("Bạn chưa có đăng kí.")
                                    window.opener.postMessage('null', 'http://localhost:4000');

                                    setTimeout(() => {
                                        window.close()
                                    }, 500)
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

    return (
        <div>
            {
                !isData &&
                <div className='flex flex-col'>
                    <button className='mx-auto p-4 bg-slate-800 rounded-md text-white' onClick={handleLogin}>Đăng nhập bằng tài khoản metamask</button>
                    {isShowKey && <div className='flex flex-col'>
                        <input placeholder='enter your key' className='w-max p-2 mx-auto mt-4 rounded-md bg-blue-200' ref={inputRef}></input>
                        <button onClick={handleContinue} className='mx-auto p-2 mt-4 bg-slate-800 rounded-md text-white' >Tiếp tục</button>
                    </div>}
                </div>
            }
        </div>
    )
}

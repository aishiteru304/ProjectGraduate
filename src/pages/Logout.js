import React from 'react'
import { toast } from 'react-hot-toast'

export default function Logout() {
    //Lắng nghe sự thay đổi account trên metamask
    window.ethereum.on('accountsChanged', function (newAccount) {
        //Nếu tồn tại account mới
        if (newAccount[0]) {
            // Tạo 1 thẻ input yêu cầu đăng nhập key tại đây 

        }
        else {
            //Nếu không tồn tại account mới => đăng xuất
            document.cookie = 'data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('userupdate')
            sessionStorage.removeItem('register')
            toast("Đăng xuất thành công")
            setTimeout(() => {
                window.location.href = '/'
            }, 1000)
        }
    })
    return (
        <div className='text-center text-3xl'>Đăng xuất metamask</div>
    )
}

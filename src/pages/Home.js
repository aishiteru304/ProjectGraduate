import React from 'react'


export default function Home() {

    return (
        <div className='flex md:px-20 px-2 flex-wrap mt-5 pb-[50px] bg-slate-100'>
            <div className='md:w-2/3 w-full'>
                <div className='flex flex-wrap w-full'>
                    <div className='min-h-[300px] lg:w-1/2 p-2 w-full'>
                        <a className='' href='https://www.digicert.com/blog/what-is-a-certificate-authority' target="_blank" rel="noreferrer">
                            <img alt='' src='/img/CA.png' className='w-full h-[300px] cursor-pointer'></img>
                            <h2 className='text-3xl font-bold mt-2'>Cetificate authority (CA) là gì? Những điều cơ bản cần biết từ CA.</h2>
                        </a>
                    </div>

                    <div className='min-h-[300px] lg:w-1/2 p-2 w-full'>
                        <a className='' href='https://auth0.com/blog/why-identity-federation-matters/' target="_blank" rel="noreferrer">
                            <img alt='' src='/img/federatedidentity.png' className='w-full h-[300px] cursor-pointer'></img>
                            <h2 className='text-3xl font-bold mt-2'>Tầm quan trọng của Federated Identity Management (FIM).</h2>
                        </a>
                    </div>
                </div>

                <div className='ml-2 mt-[50px]'>
                    <div className='flex'>
                        <a className='w-2/5' href='https://www.globalsign.com/en/document-signing' target="_blank" rel="noreferrer">
                            <img alt='' src='/img/digitalSignature.png' className='w-full max-h-[200px] cursor-pointer'></img>
                        </a>
                        <div className='w-3/5'>
                            <a className='flex w-full' href='https://www.globalsign.com/en/document-signing' target="_blank" rel="noreferrer">
                                <h2 className='text-4xl font-bold px-4'>Chữ kí số là gì và tầm quan trọng của chúng.</h2>
                            </a>
                            <h4 className='px-4 mt-2'>Chữ ký số (digital signature) là một phương pháp mã hóa số học được sử dụng để xác thực tính toàn vẹn, nguồn gốc và không sửa đổi của một tài liệu điện tử, thông điệp hoặc dữ liệu khác.</h4>
                        </div>
                    </div>

                    <div className='flex my-[50px]'>
                        <a className='w-2/5' href='https://www.coindesk.com/learn/what-is-blockchain-technology/' target="_blank" rel="noreferrer">
                            <img alt='' src='/img/blockchain.jpg' className='w-full max-h-[200px] cursor-pointer'></img>
                        </a>
                        <div className='w-3/5'>
                            <a className='flex w-full' href='https://www.coindesk.com/learn/what-is-blockchain-technology/' target="_blank" rel="noreferrer">
                                <h2 className='text-4xl font-bold px-4'>Công nghệ blockchain là gì?</h2>
                            </a>
                            <h4 className='px-4 mt-2'> Blockchain là một cơ sở dữ liệu phân cấp, được lưu trữ trên nhiều máy tính, mà mỗi giao dịch mới sẽ được thêm vào một khối mới và liên kết với các khối trước đó. Do đó, không thể chỉnh sửa dữ liệu trong blockchain một khi đã được xác nhận.</h4>
                        </div>
                    </div>

                    <div className='flex'>
                        <a className='w-2/5' href='https://www.dnse.com.vn/hoc/smart-contract-la-gi' target="_blank" rel="noreferrer">
                            <img alt='' src='/img/smartcontract.png' className='w-full max-h-[200px] cursor-pointer'></img>
                        </a>
                        <div className='w-3/5'>
                            <a className='flex w-full' href='https://www.dnse.com.vn/hoc/smart-contract-la-gi' target="_blank" rel="noreferrer">
                                <h2 className='text-4xl font-bold px-4'> Cách thức hoạt động và ứng dụng của Smart Contract.</h2>
                            </a>
                            <h4 className='px-4 mt-2'> Smart Contract (Hợp đồng thông minh) là một giao thức giao dịch dựa trên công nghệ Blockchain. Mục đích của hợp đồng này là thực hiện các điều khoản của hợp đồng mà không cần thông qua bên thứ ba.</h4>
                        </div>
                    </div>

                </div>

            </div>

            <div className='md:w-1/3 w-full p-2'>
                <img alt='' src='/img/poster.png' className='w-full min-h-[400px] cursor-pointer'></img>
                <div className='flex h-5 mt-4 mb-4'>
                    <div className='w-2 h-full bg-slate-900'></div>
                    <h2 className='h-full uppercase text-lg text-slate-800 leading-5 ml-2'>Tin tức mới</h2>
                </div>

                <div>
                    <a href='https://www.coindesk.com/learn/crypto-risk-management-how-to-get-your-wealth-off-an-exchange/' target="_blank" rel="noreferrer">
                        <img alt='' src='/img/cryptoManagement.avif' className='w-full cursor-pointer'></img>
                        <h2 className='mt-4 mb-2 text-4xl font-bold'>Quản lý rủi ro tiền điện tử</h2>
                    </a>
                    <h4>Biết cách di chuyển tiền điện tử của bạn là điều cơ bản để quản lý rủi ro và ngăn ngừa tổn thất tiền điện tử khi điều tồi tệ xảy ra trên các sàn giao dịch.</h4>
                </div>

            </div>
        </div>
    )
}

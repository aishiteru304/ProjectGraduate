const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Web3 = require('web3')
const Faucet = require('../public/contracts/Faucet.json')
const dotenv = require('dotenv').config()
const CryptoJS = require('crypto-js');
const forge = require('node-forge')


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Middleware kiểm tra tên miền
// const allowOnlyFromDomain = (allowedDomain) => {
//     return (req, res, next) => {
//         const clientDomain = req.headers.referer;
//         if (clientDomain) {
//             var contains = false;
//             for (var i = 0; i < allowedDomain.length; i++) {
//                 if (clientDomain && clientDomain.includes(allowedDomain[i])) {
//                     contains = true;
//                     break;
//                 }
//             }
//             if (!contains) {
//                 res.status(403).send('Forbidden'); // Trả về lỗi 403 nếu tên miền không được phép
//             } else {
//                 next(); // Cho phép tiếp tục xử lý
//             }
//         }
//         else {
//             res.status(403).send('Forbidden'); // Trả về lỗi 403 nếu tên miền không được phép
//         }
//     };
// };


// // Middleware kiểm tra tên miền
// app.use(allowOnlyFromDomain(process.env.ALLOWED_DOMAIN));

// Hàm mã hóa dữ liệu
const encryptAES = (plaintext, key) => {
    const encryptedData = CryptoJS.AES.encrypt(plaintext, key).toString();
    return encryptedData
}

// Hàm giải mã AES
function decryptAES(encryptedString, key) {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedString, key);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
}


// API đăng nhập
app.post('/login', (req, res) => {

    const web3 = new Web3('http://127.0.0.1:7545')

    const { username, key } = req.body;

    const contractFaucet = new web3.eth.Contract(Faucet.abi, Faucet.networks[5777].address)

    contractFaucet.methods.getAccountInfo().call({ from: username })
        .then(result => {
            const token = jwt.sign({ username, key, name: result[0], sex: result[1], birth: result[2], phone: result[3], email: result[4], signature: result[5] }, process.env.SECRET_KEY);

            res.send({ token })
        })
        .catch()

});

app.post('/update', (req, res) => {
    const { username, name, key, sex, birth, phone, email } = req.body
    // const digital = digitalSignature(name + sex + birth + phone + email)
    const privateKey = forge.pki.privateKeyFromPem(process.env.PRIVATE_KEY);
    const md = forge.md.sha256.create();
    md.update(name + sex + birth + phone + email, 'utf8');
    const signature = privateKey.sign(md)

    const web3 = new Web3('http://127.0.0.1:7545')

    const contractFaucet = new web3.eth.Contract(Faucet.abi, Faucet.networks[5777].address)
    contractFaucet.methods.setAccountInfo(encryptAES(name, key), encryptAES(sex, key), encryptAES(birth, key), encryptAES(phone, key), encryptAES(email, key), encryptAES(signature, key)).send({ from: username, gas: 1500000 })
        .then(() => res.send('Update success'))
        .catch()

})

// Hàm middleware authenticateToken
function authenticateToken(req, res, next) {
    // Lấy token từ header Authorization
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token không được cung cấp.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const { username, key, name, sex, birth, phone, email, signature } = decoded

        // Lưu thông tin người dùng được giải mã từ token vào req.user
        if (name)
            req.user = { username, key, name: decryptAES(name, key), sex: decryptAES(sex, key), birth: decryptAES(birth, key), phone: decryptAES(phone, key), email: decryptAES(email, key), signature: decryptAES(signature, key) };
        else req.user = decoded
        next();
    } catch (err) {
        console.error('Lỗi xác thực token:', err);
        return res.status(403).json({ error: 'Token không hợp lệ.' });
    }
}



// Sử dụng middleware authenticateToken để lấy thông tin
app.get('/user-info', authenticateToken, (req, res) => {
    res.json({ info: req.user });
});




app.get('/', (req, res) => {
    res.send("Hello world!")
    const privateKey = forge.pki.privateKeyFromPem(process.env.PRIVATE_KEY);
    const md = forge.md.sha256.create();
    md.update('hello'.toString(), 'utf8');
    const signature = privateKey.sign(md)

    const publicKey = forge.pki.publicKeyFromPem(process.env.PUBLIC_KEY);
    const md2 = forge.md.sha256.create();
    md2.update('hello', 'utf8');
    const verified = publicKey.verify(md2.digest().bytes(), signature);
    console.log(verified)

})

// Key exchange
app.get('/getMainKey', (req, res) => {
    res.send({ prime: process.env.BIG_PRIME, key: process.env.PUBLIC_KEY_MAIN })
})
app.get('/getSubKey', (req, res) => {
    res.send({ prime: process.env.BIG_PRIME, key: process.env.PUBLIC_KEY_SUB })
})

// Khởi động server
app.listen(8080, () => {
    console.log('Server đang chạy trên cổng 8080');
});

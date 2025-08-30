Dưới đây là nội dung được OCR từ các hình ảnh bạn đã cung cấp.

### **Trang 1: Tiêu đề**

TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP. HỒ CHÍ MINH
HCMC University of Technology and Education

KHOA CÔNG NGHỆ THÔNG TIN
BỘ MÔN CÔNG NGHỆ PHẦN MỀM

**CÔNG NGHỆ PHẦN MỀM MỚI (MTSE431179)**

**Hướng dẫn FullStack với Express.js – ReactJS - Mongoose**

**THS. NGUYỄN HỮU TRUNG**

---

### **Trang 2: Thông tin Giảng viên**

*   **Ths. Nguyễn Hữu Trung**
*   Khoa Công Nghệ Thông Tin
*   Trường Đại học Sư Phạm Kỹ Thuật TP.HCM
*   **Điện thoại:** 090.861.7108
*   **Email:** trungnh@hcmute.edu.vn
*   **Youtube:** https://www.youtube.com/@baigiai

---

### **Trang 3: Nội dung bài học**

*   **Phần 1:** Hướng dẫn xây dựng BackEnd API với ExpressJS
*   **Phần 2:** Hướng dẫn xây dựng FrontEnd với ReactJS

---

### **Trang 4: Hướng dẫn Fullstack - Bước 1 (Khởi tạo)**

**Bước 1:** Cài đặt node.js (>18.), MongoDB compass, tạo thư mục `FullStackNodeJS01\ExpressJS01` và `FullStackNodeJS01\ReactJS01`. Mở thư mục `FullStackNodeJS01` trong cửa sổ Explorer -> rồi lên thanh address gõ `cmd` -> rồi gõ `code .` để mở VSCode với thư mục đó. Rồi vào menu view->chọn Terminal. Rồi gõ `cd ExpressJS01` -> gõ `npm init` để tạo file `package.json`.

**Lệnh trong Command Prompt:**
`E:\Nam2025\CongNghePhanMemMoi\project_Fulltask\FullStackNodeJS01>code .`

**Lệnh trong Terminal VSCode:**
`PS E:\Nam2025\CongNghePhanMemMoi\project_Fulltask\FullStackNodeJS01> cd ExpressJS01`
`PS E:\Nam2025\CongNghePhanMemMoi\project_Fulltask\FullStackNodeJS01\ExpressJS01> npm init`

---

### **Trang 5: Hướng dẫn Fullstack - Bước 1 (package.json)**

**Bước 1: Các thông tin ban đầu của file `ExpressJS01\package.json`**

```json
{
  "name": "expressjs01",
  "version": "1.0.0",
  "description": "Backend API for Fullstack",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "nodejs",
    "expressjs",
    "reactjs"
  ],
  "author": "Nguyễn Hữu Trung",
  "license": "ISC"
}
```

---

### **Trang 6: Hướng dẫn Fullstack - Bước 2 (Cài đặt thư viện)**

**Bước 2:** Cài đặt Express.js, Mongoose cùng các thư viện cần thiết sau trong `package.json` như sau:

**Cài đặt dependencies:**
`npm install --save express mongoose dotenv ejs cors bcrypt jsonwebtoken`

**Cài đặt devDependencies:**
`npm install --save-dev @babel/core @babel/node @babel/preset-env nodemon`

**Thêm vào thẻ "scripts" trong `package.json`:**
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon ./src/server.js",
  "start": "nodemon ./src/server.js"
}
```

---

### **Trang 7: Hướng dẫn Fullstack - Bước 3 (Tạo file và cấu trúc)**

**Bước 3:** Tạo một số file và cấu trúc thư mục như sau:

**File `.env`:**
```
NODE_ENV=development
PORT=8080
MONGO_DB_URL=mongodb://localhost:27017/fullstack02
```

**File `.gitignore`:**
```
node_modules
# .env
```

**Cài đặt types:**
`npm i --save-dev @types/cors`
`npm i --save-dev @types/express`

---

### **Trang 8: Hướng dẫn Fullstack - Bước 4 (Config viewEngine.js)**

**Bước 4:** Tạo thư mục `src\config` và tạo file `viewEngine.js` sau:

```javascript
const path = require('path');
const express = require('express');

const configViewEngine = (app) => {
    app.set('views', path.join('./src', 'views'));
    app.set('view engine', 'ejs');

    //config static files: image/css/js
    app.use(express.static(path.join('./src', 'public')));
}

module.exports = configViewEngine;
```

---

### **Trang 9: Hướng dẫn Fullstack - Bước 4 (Config database.js)**

**Bước 4:** Tạo thư mục `src\config` và tạo file `database.js` sau:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

const dbState = [
    { value: 0, label: "Disconnected" },
    { value: 1, label: "Connected" },
    { value: 2, label: "Connecting" },
    { value: 3, label: "Disconnecting" }
];

const connection = async () => {
    await mongoose.connect(process.env.MONGO_DB_URL);
    const state = Number(mongoose.connection.readyState);
    console.log(dbState.find(f => f.value === state).label, "to database"); // connected to db
}

module.exports = connection;
```

---

### **Trang 10: Hướng dẫn Fullstack - Bước 5 (Cấu hình server.js)**

**Bước 5:** Cấu hình `server.js` và tạo cấu trúc dự án như sau:

```javascript
require('dotenv').config();
const express = require('express'); //commonjs
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const { getHomepage } = require('./controllers/homeController');
const cors = require('cors');

const app = express(); //cấu hình app là express
const port = process.env.PORT || 8888;

app.use(cors()); //config cors
app.use(express.json()); //config req.body cho json
app.use(express.urlencoded({ extended: true })); // for form data

configViewEngine(app); //config template engine

const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use('/', webAPI);

//khai báo route cho API
app.use('/v1/api/', apiRoutes);

(async () => {
    try {
        //kết nối database using mongoose
        await connection();
        //lắng nghe port trong env
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        });
    } catch (error) {
        console.log(">>> Error connect to DB: ", error);
    }
})();```

---

### **Trang 11: Hướng dẫn Fullstack - Bước 6 (Tạo routes/api.js)**

**Bước 6:** Tạo file `api.js` trong thư mục `src\routes` như sau:

```javascript
const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.all("*", auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI; //export default
```

---

### **Trang 12: Hướng dẫn Fullstack - Bước 7 (Tạo models/user.js)**

**Bước 7:** Tạo file `user.js` trong thư mục `src\models` như sau:

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
});

const User = mongoose.model('user', userSchema);
module.exports = User;
```

---

### **Trang 13 & 14: Hướng dẫn Fullstack - Bước 8 (Tạo services/userService.js)**

**Bước 8:** Tạo file `userService.js` trong thư mục `src\services` để xử lý logic như sau:

```javascript
require("dotenv").config();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            console.log(`>>> user exist, chọn 1 email khác: ${email}`);
            return null;
        }
        const hashPassword = await bcrypt.hash(password, saltRounds);
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "User"
        });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return { EC: 2, EM: "Email/Password không hợp lệ" };
            } else {
                const payload = { email: user.email, name: user.name };
                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRE }
                );
                return {
                    EC: 0,
                    access_token,
                    user: { email: user.email, name: user.name }
                };
            }
        } else {
            return { EC: 1, EM: "Email/Password không hợp lệ" };
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getUserService = async () => {
    try {
        let result = await User.find({}).select("-password");
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {
    createUserService, loginService, getUserService
};
```

---

### **Trang 15: Hướng dẫn Fullstack - Bước 9 (homeController và view)**

**Bước 9:** Tạo file `homeController.js` trong `src\controllers` và file `src\views\index.ejs`.

**File `homeController.js`:**
```javascript
const getHomepage = async (req, res) => {
    return res.render('index.ejs');
}

module.exports = {
    getHomepage,
}
```

**File `index.ejs`:**
```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nodejs</title>
</head>
<body>
    <h1> hello world with nodejs</h1>
</body>
</html>
```

---

### **Trang 16: Hướng dẫn Fullstack - Bước 9 (userController.js)**

**Bước 9:** Tạo file `userController.js` trong thư mục `src\controllers` như sau:

```javascript
const { createUserService, loginService, getUserService } = require("../services/userService");

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const data = await createUserService(name, email, password);
    return res.status(200).json(data);
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    return res.status(200).json(data);
}

const getUser = async (req, res) => {
    const data = await getUserService();
    return res.status(200).json(data);
}

const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
}

module.exports = {
    createUser, handleLogin, getUser, getAccount
}
```

---

### **Trang 17: Hướng dẫn Fullstack - Bước 10 (Middleware auth.js và delay.js)**

**Bước 10:** Tạo file `auth.js` và `delay.js` trong `src\middleware` để xử lý token.

**File `auth.js`:**
```javascript
require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const white_lists = ["/", "/register", "/login"];
    if (white_lists.find(item => '/v1/api' + item === req.originalUrl)) {
        next();
    } else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = { email: decoded.email, name: decoded.name, createdBy: "hoidanit" };
                console.log(">>> check token:", decoded);
                next();
            } catch (error) {
                return res.status(401).json({ message: "Token bị hết hạn/hoặc không hợp lệ" });
            }
        } else {
            return res.status(401).json({ message: "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn" });
        }
    }
}

module.exports = auth;
```

**File `delay.js`:**
```javascript
const delay = (req, res, next) => {
    setTimeout(() => {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            console.log(">>> check token: ", token);
        }
        next();
    }, 3000);
}

module.exports = delay;
```

---

### **Trang 18: Hướng dẫn Fullstack - Bước 11 (Chạy dự án)**

**Bước 11: Chạy dự án: `npm start`**

**Output terminal:**
```
> expressjs01@1.0.0 start
> nodemon ./src/server.js

[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./src/server.js`
Connected to database
Backend Nodejs App listening on port 8080
```

---

### **Trang 19: Hướng dẫn Fullstack - Bước 12 (Test API - Register)**

**Bước 12: Test API bằng postman, register user**

*   **Request:** `POST http://localhost:8080/v1/api/register`
*   **Body (x-www-form-urlencoded):**
    *   `name`: Hữu Trung
    *   `email`: trungnh2@hcmute.edu.vn
    *   `password`: 123456
*   **Response (200 OK):**
    ```json
    {
        "name": "Hữu Trung",
        "email": "trungnh2@hcmute.edu.vn",
        "password": "$2b$10$ozj1n6GCuxn3UJc42SnX/.CFd1s8weeZRZPARgHTNJef1gdo0qrta",
        "role": "User",
        "_id": "66b1a00f8168d49adfea80fe",
        "_v": 0
    }
    ```

---

### **Trang 20: Hướng dẫn Fullstack - Bước 12 (Test API - Login)**

**Bước 12: Test API bằng postman, login user**

*   **Request:** `POST http://localhost:8080/v1/api/login`
*   **Body (x-www-form-urlencoded):**
    *   `email`: trungnh1@hcmute.edu.vn
    *   `password`: 123456
*   **Response (200 OK):**
    ```json
    {
        "EC": 0,
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bWFpbCI6InRydW5nbmgxQGhjbXV0ZS51ZHUudm4iLCJuYW1lIjoiTmd1eeG7hW4gS0G7r3UgVHJ1bmciLCJpYXQi0jE3MjI5MTcwMDYsImV4cCI6MTcyMzAwMzQwNn0.V3aaVRTpuIIasDIrOhrImFrTyn4d0Mk8wXQK2PNMvIA",
        "user": {
            "email": "trungnh1@hcmute.edu.vn",
            "name": "Nguyễn Hữu Trung"
        }
    }
    ```

---

### **Trang 21: Hướng dẫn Fullstack - Bước 12 (Test API - Homepage)**

**Bước 12: Test API bằng postman, homepage, sau khi login thành công thì lấy token đưa vào api của homepage để test**

*   **Request:** `GET http://localhost:8080/v1/api`
*   **Authorization:** `Bearer Token` (dán token từ bước login vào)
*   **Response (200 OK):**
    `"Nguyễn Hữu Trung! Hello world! HomePage API"`

---

### **Trang 22: Hướng dẫn Frontend - Bước 13 (Tạo dự án React)**

**Bước 13: Xây dựng FrontEnd với ReactJS. Tại VSCode chọn Terminal -> New Terminal. Rồi gõ `cd ReactJS01` -> gõ `npm create vite@latest` để tạo project với ViteJS:**

*   Đặt tên project: `reactjs01`
*   Chọn React và Javascript + SWC
*   Chuyển vào thư mục project: `cd reactjs01`
*   Cài đặt module: `npm install`
*   Chạy project: `npm run dev`
*   Biên dịch và deploy: `npm run build`

---

### **Trang 23: Hướng dẫn Frontend - Bước 14 (Cài đặt thư viện)**

**Bước 14: Cài đặt các thư viện cần thiết sau trong `package.json` như sau:**

**Lệnh cài đặt:**
`npm install --save react-router-dom axios antd @ant-design/icons`

**Thêm vào "scripts" trong `package.json`:**
```json
"scripts": {
    "start": "vite"
}
```

---

### **Trang 24: Hướng dẫn Frontend - Bước 15 (Cấu hình)**

**Bước 15: Một số file và cấu trúc thư mục như sau:**

*   **File `vite.config.js`**: Cấu hình plugin React.
*   **File `.eslintrc.cjs`**: Cấu hình ESLint cho React.
*   **File `.env.development`**: `VITE_BACKEND_URL=http://localhost:8080`
*   **File `.gitignore`**: Cấu hình các file và thư mục cần bỏ qua.

---

### **Trang 25: Hướng dẫn Frontend - Bước 15 (Cấu trúc và index.html)**

**Bước 15: Một số file và cấu trúc thư mục như sau:**

**File `index.html`:**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FrontEnd Nguyễn Hữu Trung</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Cấu trúc thư mục:** `src` bao gồm `assets`, `components`, `context`, `layout`, `pages`, `styles`, `util`.

---

### **Trang 26: Hướng dẫn Frontend - Bước 16 (Tạo Context)**

**Bước 16: Tạo thư mục `src\components\context` và tạo file `auth.context.jsx`:**

```jsx
import { createContext, useState } from 'react';

export const AuthContext = createContext({
    isAuthenticated: false,
    user: { email: "", name: "" },
    appLoading: true,
});

export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: { email: "", name: "" }
    });
    const [appLoading, setAppLoading] = useState(true);
    return (
        <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
            {props.children}
        </AuthContext.Provider>
    );
}
```

---

### **Trang 27: Hướng dẫn Frontend - Bước 16 (Tạo Layout)**

**Bước 16: Tạo thư mục `src\components\layout` và tạo file `header.jsx`:**

(Mã nguồn cho component `Header` sử dụng `Menu` của Ant Design để tạo thanh điều hướng, hiển thị các mục menu khác nhau tùy thuộc vào trạng thái đăng nhập của người dùng).

---

### **Trang 28: Hướng dẫn Frontend - Bước 17 (Tạo Util)**

**Bước 17: Tạo thư mục `src\util` và tạo các file sau:**

**File `api.js`:**
```jsx
import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password };
    return axios.post(URL_API, data);
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = { email, password };
    return axios.post(URL_API, data);
}

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
}

export { createUserApi, loginApi, getUserApi };
```

**File `axios.customize.js`:**
```jsx
import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

instance.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    if (response && response.data) return response.data;
    return response;
}, function (error) {
    if (error?.response?.data) return error?.response?.data;
    return Promise.reject(error);
});

export default instance;
```

---

### **Trang 29: Hướng dẫn Frontend - Bước 17 (Tạo Styles và Pages)**

**Bước 17: Tạo thư mục `src\styles` và `src\pages` và tạo các file sau:**

*   **`global.css`**: `* { margin: 0; padding: 0; }`
*   **`home.jsx`**: Trang chủ đơn giản.
*   **`user.jsx`**: Trang hiển thị danh sách người dùng bằng `Table` của Ant Design, lấy dữ liệu từ API.

---

### **Trang 30 & 31: Hướng dẫn Frontend - Bước 17 (Tạo trang Register)**

**Bước 17: Tạo file `register.jsx` trong thư mục `src\pages`:**

(Mã nguồn cho component `RegisterPage` sử dụng `Form`, `Input`, `Button` của Ant Design để tạo form đăng ký, gọi `createUserApi` khi submit).

---

### **Trang 32 & 33: Hướng dẫn Frontend - Bước 17 (Tạo trang Login)**

**Bước 17: Tạo file `login.jsx` trong thư mục `src\pages`:**

(Mã nguồn cho component `LoginPage` sử dụng `Form`, `Input`, `Button` của Ant Design để tạo form đăng nhập, gọi `loginApi` khi submit và lưu `access_token` vào `localStorage`, cập nhật `AuthContext`).

---

### **Trang 34: Hướng dẫn Frontend - Bước 18 (Cấu hình main.jsx)**

**Bước 18: Cấu hình `main.jsx`:**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "user", element: <UserPage /> },
    ],
  },
  { path: "register", element: <RegisterPage /> },
  { path: "login", element: <LoginPage /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)```

---

### **Trang 35: Hướng dẫn Frontend - Bước 18 (Cấu hình App.jsx)**

**Bước 18: Cấu hình `App.jsx`:**

```jsx
import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      const res = await axios.get('/v1/api/user');
      if (res && !res.message) {
        setAuth({
          isAuthenticated: true,
          user: { email: res.email, name: res.name }
        });
      }
      setAppLoading(false);
    }
    fetchAccount();
  }, []);

  return (
    <div>
      {appLoading === true ?
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Spin />
        </div>
        :
        <>
          <Header />
          <Outlet />
        </>
      }
    </div>
  )
}

export default App;```

---

### **Trang 36: Bài tập thêm**

*   Thực hiện các bước tương tự như bài tập hướng dẫn nhưng áp dụng cho database MySql.
*   Thực hiện chức năng Register và ForgotPassword.
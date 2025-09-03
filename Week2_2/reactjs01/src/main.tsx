import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/global.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from './pages/register.tsx';
import UserPage from './pages/user.tsx';
import HomePage from './pages/home.tsx';
import LoginPage from './pages/login.tsx';
import ForgotPasswordPage from './pages/forgot-password.tsx';
import ResetPasswordPage from './pages/reset-password.tsx';
import ProductsPage from './pages/products.tsx';
import { AuthWrapper } from './components/context/auth.context.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "user", element: <UserPage /> },
      { path: "products", element: <ProductsPage /> },
    ],
  },
  { path: "register", element: <RegisterPage /> },
  { path: "login", element: <LoginPage /> },
  { path: "forgot-password", element: <ForgotPasswordPage /> },
  { path: "reset-password", element: <ResetPasswordPage /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)

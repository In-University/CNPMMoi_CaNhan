import { useContext, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { Menu } from 'antd';
import { HomeOutlined, UserOutlined, LoginOutlined, LogoutOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [current, setCurrent] = useState('home');

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setAuth({
            isAuthenticated: false,
            user: { email: "", name: "" }
        });
        navigate('/login');
    };

    const items = [
        {
            label: 'Home',
            key: 'home',
            icon: <HomeOutlined />,
            onClick: () => navigate('/')
        },
        auth.isAuthenticated ? {
            label: 'Users',
            key: 'users',
            icon: <UserOutlined />,
            onClick: () => navigate('/user')
        } : null,
        auth.isAuthenticated ? {
            label: `Welcome`,
            key: 'welcome',
            icon: <UserOutlined />,
            children: [
                {
                    label: 'Logout',
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    onClick: handleLogout
                }
            ]
        } : {
            label: 'Login',
            key: 'login',
            icon: <LoginOutlined />,
            onClick: () => navigate('/login')
        },
        !auth.isAuthenticated ? {
            label: 'Register',
            key: 'register',
            icon: <UserAddOutlined />,
            onClick: () => navigate('/register')
        } : null,
    ].filter(Boolean); // Filter out null values

    const onClick = (e) => {
        setCurrent(e.key);
    };

    return (
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    );
};

export default Header;

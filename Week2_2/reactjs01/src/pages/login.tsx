import React, { useContext } from 'react';
import { Button, Form, Input, message } from 'antd';
import { loginApi } from '../util/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { email, password } = values;
        const res = await loginApi(email, password);
        if (res && res.EC === 0) {
            message.success("Đăng nhập thành công!");
            localStorage.setItem("access_token", res.access_token);
            setAuth({
                isAuthenticated: true,
                user: { email: res.user.email, name: res.user.name }
            });
            navigate('/');
        } else {
            message.error(res.EM || "Đăng nhập thất bại!");
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Login</h1>
            <Form
                name="login"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginPage;

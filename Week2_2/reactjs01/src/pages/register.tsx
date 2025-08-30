import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { createUserApi } from '../util/api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { name, email, password } = values;
        const res = await createUserApi(name, email, password);
        if (res && res.EC === 0) {
            message.success("Đăng ký thành công!");
            navigate('/login');
        } else {
            message.error(res.EM || "Đăng ký thất bại!");
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Register</h1>
            <Form
                name="register"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>

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
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterPage;

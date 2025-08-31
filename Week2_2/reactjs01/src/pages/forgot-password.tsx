import { Button, Form, Input } from 'antd';
import { forgotPasswordApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { email: string }) => {
        setLoading(true);
        try {
            const res = await forgotPasswordApi(values.email);
            console.log('Forgot password response:', res);
            
            const data = res.data || res;
            if (data && data.EC === 0) {
                alert(data.EM || "OTP đã được gửi qua email!");
                console.log('Navigating to reset-password with email:', values.email);
                navigate('/reset-password', { state: { email: values.email } });
            } else {
                console.log('Not navigating - condition failed');
                alert(data?.EM || "Gửi OTP thất bại");
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            alert("Lỗi kết nối");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Quên mật khẩu</h1>
            
            <Form name="forgotPassword" onFinish={onFinish} layout="vertical">
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                        Gửi OTP
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ForgotPasswordPage;

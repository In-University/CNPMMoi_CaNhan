import { Button, Form, Input } from 'antd';
import { resetPasswordApi } from '../util/api';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    
    useEffect(() => {
        const email = location.state?.email;
        if (email) {
            form.setFieldsValue({ email });
        }
    }, [location, form]);

    const onFinish = async (values: { email: string; otp: string; newPassword: string }) => {
        setLoading(true);
        try {
            const res = await resetPasswordApi(values.email, values.otp, values.newPassword);
            const data = res.data || res;
            
            if (data && data.EC === 0) {
                alert(data.EM || "Đặt lại mật khẩu thành công!");
                navigate('/login');
            } else {
                alert(data?.EM || "Đặt lại mật khẩu thất bại!");
            }
        } catch (error) {
            console.error('Reset password error:', error);
            alert("Lỗi kết nối");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Đặt lại mật khẩu</h1>
            
            <Form form={form} name="resetPassword" onFinish={onFinish} layout="vertical">
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="OTP" name="otp" rules={[{ required: true }]}>
                    <Input maxLength={6} />
                </Form.Item>

                <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                        Đặt lại mật khẩu
                    </Button>
                </Form.Item>
            </Form>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/login">Quay lại đăng nhập</Link>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

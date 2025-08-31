import { Button, Form, Input } from 'antd';
import { createUserApi } from '../util/api';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values: { name: string; email: string; password: string }) => {
        try {
            const res = await createUserApi(values.name, values.email, values.password);
            const data = res.data || res;
            
            if (data && data.EC === 0) {
                alert(data.EM || "Đăng ký thành công!");
                navigate('/login');
            } else {
                alert(data?.EM || "Đăng ký thất bại!");
            }
        } catch (error) {
            console.error('Register error:', error);
            alert("Lỗi kết nối");
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Đăng ký tài khoản</h1>
            <Form name="register" onFinish={onFinish} layout="vertical">
                <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </div>
        </div>
    );
};

export default RegisterPage;

import { useContext } from 'react';
import { Button, Form, Input } from 'antd';
import { loginApi } from '../util/api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext) as any;

    const onFinish = async (values) => {
        const { email, password } = values;
        try {
            const res = await loginApi(email, password) as any;
            console.log('Login response:', res);
            
            if (res && res.EC === 0) {
                localStorage.setItem("access_token", res.access_token);
                setAuth({
                    isAuthenticated: true,
                    user: { email: res.user.email, name: res.user.name }
                });
                navigate('/');
            } else {
                console.log("Login failed with EC:", res?.EC, "EM:", res?.EM);
                alert(res?.EM || "Đăng nhập thất bại!");
            }
        } catch (error) {
            console.error('Login error:', error);
            alert("Lỗi kết nối");
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Đăng nhập</h1>
            <Form name="login" onFinish={onFinish} layout="vertical">
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </div>
        </div>
    );
};

export default LoginPage;

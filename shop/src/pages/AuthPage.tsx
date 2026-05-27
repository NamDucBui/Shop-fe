// src/pages/AuthPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ isLogin }: { isLogin: boolean }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const {setUser} = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    try {
      const res = await apiClient.post(endpoint, formData);
      
      if (isLogin) {
        console.log("Đăng nhập thành công", res.data);
        localStorage.setItem("token", res.data.token);
        
        setUser({name: res.data.user.name, email: res.data.user.email, role: res.data.user.role})
        navigate('/'); 
      } else {
        console.log("Đăng ký thành công", res.data);
        // Sau khi đăng ký, điều hướng về trang đăng nhập
        navigate('/login'); 
      }
    } catch (err: any) {
      const message = err.response?.data?.message
                    || "Có lỗi xảy ra, vui lòng thử lại!"
      alert(message)
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Chỉ hiện tên khi đăng ký */}
        {!isLogin && (
          <input type="text" placeholder="Họ và tên" onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} required />
        )}
        
        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} required />
        <input type="password" placeholder="Mật khẩu" onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} required />
        
        <button type="submit" style={{ padding: '12px', background: '#e53935', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </button>
      </form>

      {/* Dòng điều hướng chuyển đổi */}
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        {isLogin ? (
          <p>Chưa có tài khoản? <Link to="/register" style={{ color: '#e53935', fontWeight: 'bold' }}>Đăng ký ngay</Link></p>
        ) : (
          <p>Đã có tài khoản? <Link to="/login" style={{ color: '#e53935', fontWeight: 'bold' }}>Đăng nhập ngay</Link></p>
        )}
      </div>
    </div>
  );
};
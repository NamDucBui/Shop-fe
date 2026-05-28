// src/pages/AuthPage.tsx
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../api/client'
import { useAuth } from '../context/AuthContext'

interface AuthFormData {
  name?: string
  email: string
  password: string
  confirmPassword?: string
}

export const AuthPage = ({ isLogin }: { isLogin: boolean }) => {
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues
  } = useForm<AuthFormData>()

  const onSubmit = async (data: AuthFormData) => {
    const endpoint = isLogin ? '/auth/login' : '/auth/register'
    try {
      const res = await apiClient.post(endpoint, data)
      if (isLogin) {
        localStorage.setItem("token", res.data.token)
        setUser({ name: res.data.user.name, email: res.data.user.email, role: res.data.user.role })
        navigate('/')
      } else {
        navigate('/login')
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Có lỗi xảy ra!")
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 30, border: '1px solid #ddd', borderRadius: 12 }}>
      <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Tên — chỉ hiện khi đăng ký */}
        {!isLogin && (
          <div>
            <input
              placeholder="Họ và tên"
              {...register('name', {
                required: 'Vui lòng nhập họ tên',
                minLength: { value: 2, message: 'Tối thiểu 2 ký tự' }
              })}
              style={{ width: '100%', padding: 10, borderRadius: 6, border: `1px solid ${errors.name ? '#e53935' : '#ccc'}`, boxSizing: 'border-box' }}
            />
            {errors.name && <p style={{ color: '#e53935', fontSize: 12, margin: '4px 0 0' }}>{errors.name.message}</p>}
          </div>
        )}

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email', {
              required: 'Vui lòng nhập email',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' }
            })}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: `1px solid ${errors.email ? '#e53935' : '#ccc'}`, boxSizing: 'border-box' }}
          />
          {errors.email && <p style={{ color: '#e53935', fontSize: 12, margin: '4px 0 0' }}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Mật khẩu"
            {...register('password', {
              required: 'Vui lòng nhập mật khẩu',
              minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
            })}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: `1px solid ${errors.password ? '#e53935' : '#ccc'}`, boxSizing: 'border-box' }}
          />
          {errors.password && <p style={{ color: '#e53935', fontSize: 12, margin: '4px 0 0' }}>{errors.password.message}</p>}
        </div>

        {!isLogin && (
          <div>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              {...register('confirmPassword', {
                required: 'Vui lòng nhập lại mật khẩu',
                validate: (value) => value === getValues("password") || "Mật khẩu không khớp"
              })}
              style={{ width: '100%', padding: 10, borderRadius: 6, border: `1px solid ${errors.confirmPassword ? '#e53935' : '#ccc'}`, boxSizing: 'border-box' }}
            />
            {errors.confirmPassword && <p style={{ color: '#e53935', fontSize: 12, margin: '4px 0 0' }}>{errors.confirmPassword.message}</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{ padding: 12, background: isSubmitting ? '#ccc' : '#e53935', color: 'white', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
        >
          {isSubmitting ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
        </button>
      </form>

      <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14 }}>
        {isLogin
          ? <p>Chưa có tài khoản? <Link to="/register" style={{ color: '#e53935', fontWeight: 'bold' }}>Đăng ký ngay</Link></p>
          : <p>Đã có tài khoản? <Link to="/login" style={{ color: '#e53935', fontWeight: 'bold' }}>Đăng nhập ngay</Link></p>
        }
      </div>
    </div>
  )
}
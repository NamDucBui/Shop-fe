// src/pages/CheckoutPage.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiClient } from '../api/client';
import { useCartStore } from '../store/useCartStore';

interface CheckoutItem {
    product_id: number;
    name: string;
    quantity: number;
    price: number;
}

export const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const fetchCart = useCartStore((state) => state.fetchCart);
    const [loading, setLoading] = useState(false);

    // Lấy thông tin sản phẩm được truyền sang từ trang trước đó (Cart hoặc ProductDetail)
    const { items, isDirectBuy } = (location.state as { items: CheckoutItem[]; isDirectBuy: boolean }) || { items: [], isDirectBuy: false };

    if (!items || items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Không có sản phẩm nào để thanh toán!</h2>
                <button onClick={() => navigate('/')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Quay lại trang chủ</button>
            </div>
        );
    }

    // Tính tổng tiền tạm tính hiển thị trên giao diện
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleConfirmOrder = async () => {
        setLoading(true);
        try {
            // const token = localStorage.getItem("token");
            let payload = {};

            // Nếu là mua ngay trực tiếp, gửi kèm product_id và quantity lên API
            if (isDirectBuy && items.length === 1) {
                payload = {
                    product_id: items[0].product_id,
                    quantity: items[0].quantity
                };
            }

            const res = await apiClient.post('/orders', payload)

            alert(res.data.message || "Đặt hàng thành công!");
            
            // Làm mới lại số lượng giỏ hàng trên Navbar nếu mua từ luồng Giỏ hàng thông thường
            if (!isDirectBuy) {
                await fetchCart();
            }

            // Chuyển hướng người dùng về trang Lịch sử đơn hàng
            navigate('/my'); 
        } catch (error: any) {
            alert(error.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', color: '#d70018' }}>Xác Nhận Đơn Hàng</h2>
            
            <div style={{ margin: '20px 0' }}>
                <h3>Danh sách sản phẩm:</h3>
                {items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
                        <div>
                            <strong>{item.name}</strong>
                            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Số lượng: {item.quantity}</p>
                        </div>
                        <span style={{ fontWeight: 'bold' }}>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginTop: '20px', borderTop: '2px solid #eee' }}>
                <span>Tổng thanh toán:</span>
                <span style={{ color: '#d70018' }}>{totalAmount.toLocaleString('vi-VN')} đ</span>
            </div>

            <button
                onClick={handleConfirmOrder}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: loading ? '#ccc' : '#d70018',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '30px'
                }}
            >
                {loading ? 'Đang xử lý đơn hàng...' : 'Xác Nhận Đặt Hàng'}
            </button>
        </div>
    );
};
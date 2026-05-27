// src/pages/CartPage.tsx
import { useEffect } from "react"
import { useCartStore } from "../store/useCartStore"

export const CartPage = () => {
  const {
    items,
    total,
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart
  } = useCartStore()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display:       'flex',
                alignItems:    'center',
                padding:       '20px',
                borderBottom:  '1px solid #eee',
                gap:           '16px'
              }}
            >
              {/* Thông tin sản phẩm */}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold' }}>
                  {item.products?.name ?? `Sản phẩm #${item.product_id}`}
                </p>
                <p style={{ color: '#888' }}>
                  {Number(item.products?.price ?? 0).toLocaleString('vi-VN')}đ
                </p>
              </div>

              {/* Điều chỉnh số lượng */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => updateCartItem(item.product_id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >−</button>

                <span>{item.quantity}</span>

                <button onClick={() => updateCartItem(item.product_id, item.quantity + 1)}
                  // disabled={item.quantity >= (item.products?.stock ?? 0)}
                >+</button>
              </div>

              {/* Thành tiền */}
              <div style={{ minWidth: '100px', textAlign: 'right' }}>
                {(Number(item.products?.price ?? 0) * item.quantity)
                  .toLocaleString('vi-VN')}đ
              </div>

              {/* Xóa */}
              <button
                onClick={() => removeFromCart(item.product_id)}
                style={{ color: 'red', cursor: 'pointer' }}
              >
                Xóa
              </button>
            </div>
          ))}

          {/* Tổng tiền */}
          <div style={{ textAlign: 'right', padding: '20px', fontSize: '18px', fontWeight: 'bold' }}>
            Tổng: {total.toLocaleString('vi-VN')}đ
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0' }}>
            <button onClick={clearCart} style={{ color: 'red' }}>
              Xóa toàn bộ
            </button>
            <button style={{ background: '#007bff', color: 'white', padding: '10px 24px' }}>
              Đặt hàng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
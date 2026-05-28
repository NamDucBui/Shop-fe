import { useEffect, useState } from "react"
import { apiClient } from "../api/client"
import { useNavigate } from "react-router-dom"

interface OrderItem {
    id: number
    product_id: number
    quantity: number
    price: number
    products?: { name: string }
}

interface Order {
    id: number
    status: string
    total: number
    created_at: string
    order_items: OrderItem[]
}

export const OrderHistoryPage = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        apiClient.get('/orders/my')
            .then(res => setOrders(res.data))
            .catch(err => {
                if (err.response?.status === 401) navigate('/login')
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div style={{ padding: 40 }}>Đang tải...</div>

    return (
        <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
            <h1>Lịch sử đơn hàng</h1>

            {orders.length === 0 ? (
                <p style={{ color: "#888" }}>Bạn chưa có đơn hàng nào.</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} style={{
                        border: "1px solid #eee", borderRadius: 8,
                        marginBottom: 16, overflow: "hidden"
                    }}>
                        {/* Header đơn hàng */}
                        <div style={{
                            background: "#f9f9f9", padding: "12px 20px",
                            display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <div>
                                <span style={{ fontWeight: 700 }}>Đơn #{order.id}</span>
                                <span style={{ color: "#888", fontSize: 13, marginLeft: 12 }}>
                                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <span style={{
                                    background: order.status === 'completed' ? '#e8f5e9'
                                        : order.status === 'pending' ? '#e3f2fd'
                                            : '#fff3e0',
                                    color: order.status === 'completed' ? '#2e7d32'
                                        : order.status === 'pending' ? '#1565c0'
                                            : '#e65100',
                                    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600
                                }}>
                                    {order.status === 'completed' ? 'Hoàn thành'
                                        : order.status === 'pending' ? 'Chờ xử lý'
                                            : order.status}
                                </span>
                                <span style={{ fontWeight: 700, color: "#d70018" }}>
                                    {Number(order.total).toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div style={{ padding: "12px 20px" }}>
                            {order.order_items?.map(item => (
                                <div key={item.id} style={{
                                    display: "flex", justifyContent: "space-between",
                                    padding: "6px 0", fontSize: 14,
                                    borderBottom: "1px dashed #f0f0f0"
                                }}>
                                    <span>{item.products?.name ?? `Sản phẩm #${item.product_id}`}</span>
                                    <span style={{ color: "#555" }}>
                                        x{item.quantity} — {Number(item.price).toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
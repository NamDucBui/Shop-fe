// src/pages/ProductDetail.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product } from "../types";
import { apiClient } from "../api/client";
import { useCartStore } from "../store/useCartStore";

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const addToCart = useCartStore((state) => state.addToCart);
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

    useEffect(() => {
        apiClient.get<Product>(`/products/${id}`).then((res) => setProduct(res.data));
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            await addToCart(product.id, 1);
            // navigate('/cart');
        } catch (error: any) {
            if (error.response?.status === 401) {
                alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
                navigate('/login'); // Tự động đẩy qua trang đăng nhập
            } else {
                console.error("Lỗi hệ thống:", error);
                alert("Có lỗi xảy ra, vui lòng thử lại sau.");
            }
        }
    };

    if (!product) return <div>Đang tải thông tin sản phẩm...</div>;

    return (
        <div style={{
            display: 'flex',
            gap: '40px',
            padding: '40px',
            maxWidth: '1000px',
            margin: 'auto',
            alignItems: 'center' // Căn giữa theo chiều dọc nếu ảnh và thông tin có chiều cao khác nhau
        }}>

            {/* Cột trái: Ảnh sản phẩm */}
            <div style={{ flex: 1 }}>
                <img
                    src={product.image
                        ? `${baseUrl}${product.image}`
                        : "/placeholder.png"
                    }
                    alt={product.name}
                    style={{ width: '100%', objectFit: 'contain', borderRadius: '12px' }}
                />
            </div>

            {/* Cột phải: Căn giữa nội dung */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column', // Xếp chồng các phần tử theo chiều dọc
                alignItems: 'center',    // Căn giữa theo chiều ngang
                textAlign: 'center'      // Đảm bảo văn bản nằm giữa
            }}>
                <h1 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>{product.name}</h1>
                <p style={{ fontSize: '28px', color: '#d70018', fontWeight: 'bold', margin: '10px 0' }}>
                    {Number(product.price).toLocaleString('vi-VN')} đ
                </p>

                {/* Nhóm nút bấm */}
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'nowrap' }}>
                    <button
                        onClick={handleAddToCart}
                        style={{ padding: '12px 24px', background: '#fff', border: '1px solid #d70018', color: '#d70018', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                        Thêm vào giỏ
                    </button>
                    <button
                        style={{ padding: '12px 24px', background: '#d70018', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                        Mua ngay
                    </button>
                </div>
            </div>
        </div>
    )
};
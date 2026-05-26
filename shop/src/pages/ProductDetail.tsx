import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import type { Product } from "../types";
import { apiClient } from "../api/client";
import { useCartStore } from "../store/useCartStore";

export const ProductDetail = () => {
    const {id} = useParams<{id: string}>();
    const [product, setProduct] = useState<Product | null>(null)
    const addToCart = useCartStore((state) => state.addToCart)

    useEffect(() => {
        apiClient.get<Product>(`/products/${id}`)
            .then(res => setProduct(res.data))
    }, [id])

    if(!product) return <div>Đang tải</div>
    return(
        <div>
            <h3>Chi tiết: {product.name} - {product.price.toLocaleString()} VNĐ</h3>
            <button onClick={() => addToCart(product.id, 1)}>Thêm vào giỏ hàng</button>
        </div>
    )
}
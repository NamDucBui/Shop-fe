import { useEffect, useState } from "react"
import type { Product } from "../types"

export const ProductPage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/products')

                if(!response.ok){
                    throw new Error('Không thể tải danh sách sản phẩm');
                }

                const data: Product[] = await response.json();
                setProducts(data);
            } catch (error: any) {
                setError(error.message || 'Có lỗi xảy ra');
            } finally{
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])
    
    if(loading) return <div>Đang tải sản phẩm...</div>

    if(error) return <div style={{color: 'red'}}>Lỗi: {error}</div>

    return(
        <div>
            <h1>Danh sách sản phẩm</h1>
            <ul>
                {
                    products.map((p) => (
                        <li key={p.id}>{p.name} - {p.price.toLocaleString()} VNĐ</li>
                    ))
                }
            </ul>
        </div>
    )
}
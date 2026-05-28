
import type { Product } from "../types";
import "../App.css";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config";

export const ProductCard = ({ product }: { product: Product }) => {
    return (
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="product-card">
                <img
                    src={product.image ? `${BASE_URL}${product.image}` : '/placeholder.jpg'}
                    alt={product.name}
                    className="product-image"
                />
                <h3>{product.name}</h3>
                <p style={{ color: '#d70018', fontWeight: 'bold' }}>
                    {Number(product.price).toLocaleString('vi-VN')} đ
                </p>
            </div>
        </Link>

    );
};
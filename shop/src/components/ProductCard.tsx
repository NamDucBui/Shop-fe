// src/components/ProductCard.tsx
import type { Product } from "../types";
import "../App.css"; 

export const ProductCard = ({ product }: { product: Product }) => {
    const baseUrl = "http://localhost:3000"
  return (
    <div className="product-card">
      <img 
        src={`${baseUrl}${product.image}` || 'placeholder.jpg'} 
        alt={product.name} 
        className="product-image" 
      />
      <h3>{product.name}</h3>
      <p style={{ color: '#d70018', fontWeight: 'bold' }}>
        {Number(product.price).toLocaleString('vi-VN')} đ
      </p>
    </div>
  );
};
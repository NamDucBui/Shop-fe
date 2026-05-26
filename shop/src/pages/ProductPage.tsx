// src/components/ProductPage.tsx
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";


export const ProductPage = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px' 
      }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
import type { Product } from "../types";
import { ProductItem } from "./ProductItem";

interface ProductListProps{
    products: Product[];
}

export const ProductList = ({products} : ProductListProps) => {
    return (
        <div>
            {products.map((item) => (
                <ProductItem key={item.id}{...item} />
            ))}
        </div>
    )
}



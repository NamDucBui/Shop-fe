import type { Product } from "../types"
import { useFetch } from "./useFetch";

export const useProducts = () => {
    const { data, loading, error } = useFetch<Product[]>('/products');
    return { products: data || [], loading, error}
}
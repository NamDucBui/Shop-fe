import type { Category } from "../types"
import { useFetch } from "./useFetch";

export const useCategories = () => {
    const { data, loading, error } = useFetch<Category[]>('/categories');
    return { categories: data || [], loading, error}
}
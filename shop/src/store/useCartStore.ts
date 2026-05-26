import { create } from "zustand"
import { apiClient } from "../api/client"

interface CartItem {
    id: number
    product_id: number
    quantity: number
}
interface CartStore{
    items: CartItem[]
    fetchCart: () => Promise<void>
    addToCart: (productId: number, quantity: number) => Promise<void>
}

export const useCartStore = create<CartStore>((set) => ({
    items: [],

    fetchCart: async () => {
        const res = await apiClient.get('/cart')
        set({items: res.data})
    },
    
    addToCart: async (product_id, quantity) => {
        const res = await apiClient.post('/cart', {product_id, quantity})
        set({items: res.data})
    }
}))
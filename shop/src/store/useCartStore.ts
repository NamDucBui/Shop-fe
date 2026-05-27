// src/store/useCartStore.ts
import { create } from "zustand"
import { apiClient } from "../api/client"
import type { Product } from "../types"

interface CartItem {
    id: number
    product_id: number
    quantity: number
    products: Product
}
interface CartStore {
    items: CartItem[]
    total: number
    fetchCart: () => Promise<void>
    addToCart: (productId: number, quantity: number) => Promise<void>
    updateCartItem:  (productId: number, quantity: number) => Promise<void>
    removeFromCart:  (productId: number) => Promise<void>
    clearCart:       () => Promise<void>
}

export const useCartStore = create<CartStore>((set) => ({
    items: [],
    total: 0,

    fetchCart: async () => {
        try {
            const res = await apiClient.get('/cart')
            set({ items: res.data.cart_items || [] })
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
            set({ items: [] })
        }
    },

    addToCart: async (product_id, quantity) => {
        try {
            const res = await apiClient.post('/cart', { product_id, quantity })
            const newItem = res.data?.item

            if (newItem) {
                set(state => {
                    const exists = state.items.find(i => i.product_id === newItem.product_id)

                    if (exists) {
                        return {
                            items: state.items.map(i =>
                                i.product_id === newItem.product_id
                                    ? { ...i, quantity: newItem.quantity }
                                    : i
                            )
                        }
                    } else {
                        return { items: [...state.items, newItem] }
                    }
                })
            }
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng: ", error)
            throw error
        }
    },

    updateCartItem: async (productId, quantity) => {
    try {
      const res = await apiClient.put(`/cart/${productId}`, { quantity })
      const updatedItem = res.data?.item

      if (updatedItem) {
        set(state => {
          const updatedItems = state.items.map(i =>
            i.product_id === productId
              ? { ...i, quantity: updatedItem.quantity }
              : i
          )
          return {
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, i) => sum + Number(i.products?.price ?? 0) * i.quantity, 0
            )
          }
        })
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật giỏ hàng:', error)
      throw error
    }
  },

  removeFromCart: async (productId) => {
    try {
      await apiClient.delete(`/cart/${productId}`)
      set(state => {
        const updatedItems = state.items.filter(i => i.product_id !== productId)
        return {
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, i) => sum + Number(i.products?.price ?? 0) * i.quantity, 0
          )
        }
      })
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error)
      throw error
    }
  },

  clearCart: async () => {
    try {
      await apiClient.delete('/cart')
      set({ items: [], total: 0 })
    } catch (error) {
      console.error('Lỗi khi xóa giỏ hàng:', error)
      throw error
    }
  }

}))
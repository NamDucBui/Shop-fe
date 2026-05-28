// src/store/useCartStore.ts
import { create } from "zustand"
import { apiClient } from "../api/client"
import type { CartItem } from "../types"


interface CartStore {
  items: CartItem[]
  total: number
  fetchCart: () => Promise<void>
  addToCart: (productId: number, quantity: number) => Promise<void>
  updateCartItem: (productId: number, quantity: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  clearCart: () => Promise<void>
}

const calcTotal = (item: CartItem[]) =>
  item.reduce((sum, i) => sum + Number(i.products?.price ?? 0) * i.quantity, 0)

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,

  fetchCart: async () => {
    try {
      const res = await apiClient.get('/cart')
      const items = res.data.cart_items || []
      set({ items, total: calcTotal(items) })
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

          const updatedItems = exists
            ? state.items.map(i =>
              i.product_id === newItem.product_id
                ? { ...i, quantity: newItem.quantity }
                : i
            )
            : [...state.items, newItem]

          return { items: updatedItems, total: calcTotal(updatedItems) }
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
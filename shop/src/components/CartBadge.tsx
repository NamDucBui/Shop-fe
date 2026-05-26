import { useEffect } from "react"
import { useCartStore } from "../store/useCartStore"

export const CartBadge = () => {
    const items = useCartStore(state => state.items)
    const fetchCart = useCartStore(state => state.fetchCart)

    useEffect(() => {
        fetchCart();
    }, [])

    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0)

    return(
        <div className="cart-badge">
            Giỏ hàng: {totalItems} sản phẩm
        </div>
    )
}
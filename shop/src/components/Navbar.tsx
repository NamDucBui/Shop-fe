import { useEffect, useState } from "react"
import { CategoryDropdown } from "./CategoryDropdown"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { apiClient } from "../api/client"
import { useCartStore } from "../store/useCartStore"

export const Navbar = () => {
    // const {isAuthenticated, login, logout} = useAuth()

    const [search, setSearch] = useState("")
    const { user, setUser } = useAuth()
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const { items, fetchCart } = useCartStore();
    const cartCount = Array.isArray(items)
        ? items.reduce((total, item) => total + item.quantity, 0)
        : 0;

    // Trong Navbar.tsx, cập nhật hàm handleLogout
    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout')

            setUser(null);
            localStorage.removeItem("token");
            navigate('/');
        } catch (error: any) {
            // Nếu lỗi 401 do token đã hết hạn, ta vẫn nên cho phép logout ở phía Client
            if (error.response?.status === 401) {
                setUser(null);
                localStorage.removeItem("token");
                navigate('/');
            } else {
                console.error("Lỗi khi đăng xuất:", error);
            }
        }
    };

    useEffect(() => {
        if (user) fetchCart()
    }, [user])
    return (
        // <nav>
        //     <CartBadge />
        //     {isAuthenticated ? (
        //         <button onClick={logout}>Đăng xuất</button>
        //     ) : (
        //         <button onClick={login}>Đăng nhập</button>
        //     )}
        // </nav>
        <div style={{
            background: "#e53935", padding: "10px 24px",
            display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 100,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}>
            {/* Logo */}
            <Link to={"/"}>
                <div style={{ fontWeight: 900, fontSize: 22, color: "white", letterSpacing: -1, whiteSpace: "nowrap" }}>
                    cellphone<span style={{ background: "white", color: "#e53935", borderRadius: 4, padding: "0 5px", marginLeft: 2 }}>N</span>
                </div>
            </Link>


            {/* Danh mục */}
            <CategoryDropdown />

            {/* Location */}
            <button style={{
                background: "rgba(255,255,255,0.15)", border: "none", color: "white",
                padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 14,
                display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap"
            }}>
                📍 Hà Nội ▾
            </button>

            {/* Search */}
            <div style={{ flex: 1, position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#999" }}>🔍</span>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Bạn muốn mua gì hôm nay?"
                    style={{
                        width: "100%", padding: "10px 16px 10px 38px", borderRadius: 8,
                        border: "none", fontSize: 14, outline: "none", boxSizing: "border-box"
                    }}
                />
            </div>

            {/* Cart */}
            <Link to="/cart" style={{ textDecoration: 'none' }}>
                <div style={{ position: "relative", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 22 }}>🛒</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Giỏ hàng</span>
                    {cartCount > 0 && (
                        <span style={{
                            position: "absolute", top: -6, right: -6,
                            background: "#fff", color: "#e53935", borderRadius: "50%",
                            width: 18, height: 18, fontSize: 11, fontWeight: 700,
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>{cartCount}</span>
                    )}
                </div>
            </Link>

            {/* Login */}
            {user ? (
                <div style={{ position: "relative" }}>
                    <div
                        onClick={() => setShowMenu(!showMenu)}
                        style={{ color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                    >
                        Chào, {user.name} ▾
                    </div>

                    {/* Menu đăng xuất */}
                    {showMenu && (
                        <div style={{
                            position: "absolute", top: "100%", right: 0,
                            background: "white", borderRadius: 4,
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                            minWidth: 160, overflow: "hidden"
                        }}>
                            {/* Lịch sử đơn hàng */}
                            <div
                                onClick={() => { navigate('/my'); setShowMenu(false) }}
                                style={{
                                    padding: "10px 16px", cursor: "pointer", color: "#333",
                                    fontSize: 14, borderBottom: "1px solid #f0f0f0"
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
                                onMouseLeave={e => (e.currentTarget.style.background = "white")}
                            >
                                📦 Lịch sử đơn hàng
                            </div>

                            {/* Đăng xuất */}
                            <div
                                onClick={handleLogout}
                                style={{
                                    padding: "10px 16px", cursor: "pointer", color: "#e53935",
                                    fontSize: 14
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = "#fff5f5")}
                                onMouseLeave={e => (e.currentTarget.style.background = "white")}
                            >
                                🚪 Đăng xuất
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <button style={{
                        background: "white", color: "#e53935", border: "none",
                        padding: "8px 18px", borderRadius: 6, cursor: "pointer",
                        fontWeight: 700, fontSize: 14, whiteSpace: "nowrap"
                    }}>
                        Đăng nhập 👤
                    </button>
                </Link>
            )}

        </div>
    )
}
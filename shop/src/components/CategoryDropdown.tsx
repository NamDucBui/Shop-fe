import { useState } from "react"
import { useCategories } from "../hooks/useCategories"

export const CategoryDropdown = () => {
    const [isOpen, setIsOpen] = useState(false)
    const {categories, loading} = useCategories()
    
    return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "rgba(255,255,255,0.15)", border: "none", color: "white",
          padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 14,
          display: "flex", alignItems: "center", gap: 6
        }}
      >
        ▦ Danh mục ▾
      </button>

      {isOpen && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, background: 'white',
          color: 'black', listStyle: 'none', padding: '10px', margin: 0,
          borderRadius: 4, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10
        }}>
          {loading ? <li>Đang tải...</li> : categories?.map(cat => (
            <li key={cat.id} style={{ padding: '5px 0', cursor: 'pointer' }}>
              {cat.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
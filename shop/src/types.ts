export interface Product{
    id: number;
    name: string;
    price: number;
    image: string | null;
}

export interface Category{
    id: number;
    name: string;
}

export interface ApiResponse<T>{
    data: T
    message?: string
    success: boolean
}

export interface CartItem {
  id: number
  product_id: number
  quantity: number
  products: Product
}
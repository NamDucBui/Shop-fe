import type { Product } from "../types";

export const ProductItem = ({name, price, image} : Product) => {
    return(
        <div>
            <img src={image || ''} alt={name} width={100} />
            <h3>{name}</h3>
            <p>{price.toLocaleString()} VNĐ</p>
        </div>
    )
}



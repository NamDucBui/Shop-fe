import { useEffect, useState } from "react"
import { apiClient } from "../api/client"

export const useFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get<T>(url);
                setData(response.data);
            } catch (error: any) {
                setError(error.message || 'Có lỗi xảy ra');
            } finally{
                setLoading(false)
            }
        }
        fetchData()
    }, [url])
    return { data, loading, error}
}
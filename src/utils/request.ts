// request.ts
import axios from 'axios'

const request = axios.create({
    baseURL: '',
    timeout: 8000
})

// 请求拦截
request.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// 响应拦截
request.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('响应错误:', error)
        const errorMessage = error.response?.data?.message
            || error.message
            || '请求失败'
        // 这里返回一个 rejected 的 Promise
        return Promise.reject(new Error(errorMessage))
    }
)

export default request
import request from "../utils/request.ts"
import {watermarkUrl} from "./url_info.ts";

export const getWatermarkByCGG = async (url: string): Promise<string> => {
    const response = await request.get(watermarkUrl['Cuiguigui'].url, {
        params: {
            url: url,
        }
    }) as any
    return response.data
}
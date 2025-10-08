// src/types/wallpaper.ts
export interface WallpaperFile {
    name: string
    path: string
    size: number
    type: 'image' | 'video' | 'gif'
}

export interface SaveWallpaperResult {
    success: boolean
    filePath?: string
    error?: string
}

export interface DeleteWallpaperResult {
    success: boolean
    error?: string
}
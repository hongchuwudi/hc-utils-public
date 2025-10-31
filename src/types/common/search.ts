export interface SearchBarProps {
    modelValue?: string
    placeholder?: string
    visible?: boolean
    maxWidth?: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'filled' | 'outlined'
    showClear?: boolean
    autoFocus?: boolean
}

export interface SearchBarEmits {
    (e: 'update:modelValue', value: string): void
    (e: 'search', value: string): void
    (e: 'clear'): void
    (e: 'focus'): void
    (e: 'blur'): void
}
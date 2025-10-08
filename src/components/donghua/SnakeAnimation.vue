<template>
  <div class="snake-animation-container bg-transparent p-2.5 rounded-lg overflow-hidden">
    <div class="grid-container bg-gray-100 dark:bg-gray-900 grid grid-cols-31 grid-rows-13 gap-px w-full aspect-[31/13] p-1">
      <div
          v-for="(cell, index) in grid"
          :key="index"
          :class="[
          'grid-cell rounded-sm transition-all duration-200 ease-in-out',
          cellClasses[cell.type],
          { 'rain-light': cell.rainLight }
        ]"
          :style="{ backgroundColor: getCellColor(cell) }"
          :data-direction="cell.direction"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 类型定义
interface GridCell {
  row: number
  col: number
  type: 'empty' | 'head' | 'body' | 'food'
  rainLight: boolean
  rainColor?: string
  rainOpacity?: number
  direction?: string
}

interface Position {
  row: number
  col: number
}

interface SnakeColors {
  head: string
  body: string
}

interface RainDrop {
  id: number
  color: string
  progress: number
  speed: number
  length: number
  direction: 'up' | 'down' | 'left' | 'right'
  startCol?: number
  startRow?: number
  row?: number
  col?: number
}

// 网格配置
const rows = 13
const cols = 31
const grid = ref<GridCell[]>([])
const snake = ref<Position[]>([])
const food = ref<Position>({ row: 0, col: 0 })
const direction = ref<'up' | 'down' | 'left' | 'right'>('right')
const animationInterval = ref<number | null>(null)
const mode = ref<'rain-show' | 'pause' | 'snake-game'>('rain-show')
const rainShowInterval = ref<number | null>(null)
const rainShowTimeout = ref<number | null>(null)
const showSpeed = ref<number>(70)
const rainDrops = ref<RainDrop[]>([])
const currentColorIndex = ref<number>(0)

// 颜色配置 - 添加明暗主题颜色
const themeColors = {
  light: {
    empty: '#f8fafc', // gray-50
    gridBackground: '#f1f5f9' // gray-100
  },
  dark: {
    empty: '#1e293b', // gray-800
    gridBackground: '#0f172a' // gray-900
  }
}

const vibrantColors = [
  '#FF5252', // 鲜艳红色
  '#FF4081', // 粉红色
  '#E040FB', // 紫色
  '#7C4DFF', // 深紫色
  '#536DFE', // 蓝色
  '#448AFF', // 亮蓝色
  '#40C4FF', // 天蓝色
  '#18FFFF', // 青色
  '#64FFDA', // 绿青色
  '#69F0AE', // 亮绿色
  '#B2FF59', // 黄绿色
  '#EEFF41', // 黄色
  '#FFFF00', // 纯黄色
  '#FFD740', // 橙色
  '#FFAB40', // 橙红色
  '#FF6E40'  // 红橙色
]

const snakeColorThemes: SnakeColors[] = [
  { head: '#1890ff', body: '#69c0ff' }, // 蓝色系
  { head: '#FF5252', body: '#FF8A80' }, // 红色系
  { head: '#69F0AE', body: '#B9F6CA' }, // 绿色系
  { head: '#FFD740', body: '#FFE57F' }, // 黄色系
  { head: '#E040FB', body: '#EA80FC' }, // 紫色系
  { head: '#FF6E40', body: '#FF9E80' }, // 橙色系
  { head: '#00BFA5', body: '#1DE9B6' }, // 青绿色系
  { head: '#FF4081', body: '#FF80AB' }, // 粉红色系
  { head: '#7C4DFF', body: '#B388FF' }, // 深紫色系
  { head: '#448AFF', body: '#82B1FF' }, // 亮蓝色系
  { head: '#FFC107', body: '#FFD54F' }, // 金黄色系
  { head: '#00E5FF', body: '#18FFFF' }, // 霓虹青色
  { head: '#76FF03', body: '#B2FF59' }, // 霓虹绿色
  { head: '#FF1744', body: '#FF5252' }, // 霓虹红色
  { head: '#F50057', body: '#FF4081' }, // 霓虹粉红
]

const snakeColors = ref<SnakeColors>(snakeColorThemes[0] ||  { head: '#1890ff', body: '#69c0ff' })

// 检测当前主题
const getCurrentTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'

  if (document.documentElement.classList.contains('dark')) {
    return 'dark'
  }
  return 'light'
}

// 单元格类名映射
const cellClasses = {
  empty: 'empty-cell',
  head: 'snake-head',
  body: 'snake-body',
  food: 'snake-food'
}

// 初始化网格
const initializeGrid = (): void => {
  const newGrid: GridCell[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      newGrid.push({ row, col, type: 'empty', rainLight: false })
    }
  }
  grid.value = newGrid
}

// 更新网格状态
const updateGrid = (): void => {
  // 重置所有单元格
  grid.value.forEach(cell => {
    cell.type = 'empty'
  })

  // 设置食物
  const foodIndex = food.value.row * cols + food.value.col
  if (grid.value[foodIndex]) {
    grid.value[foodIndex].type = 'food'
  }

  // 设置蛇身
  snake.value.forEach((segment, index) => {
    const segmentIndex = segment.row * cols + segment.col
    if (grid.value[segmentIndex]) {
      grid.value[segmentIndex].type = index === 0 ? 'head' : 'body'
    }
  })
}

// 自动寻路算法
const findPathToFood = (): string[] => {
  const head = snake.value[0]
  if (!head) return getSafeDirection()

  const queue: Array<{row: number, col: number, path: string[]}> = [{ ...head, path: [] }]
  const visited = new Set<string>()
  visited.add(`${head.row},${head.col}`)

  while (queue.length > 0) {
    const current = queue.shift()!
    if (!current) continue

    if (current.row === food.value.row && current.col === food.value.col) {
      return current.path
    }

    const directions = [
      { row: -1, col: 0, dir: 'up' },
      { row: 1, col: 0, dir: 'down' },
      { row: 0, col: -1, dir: 'left' },
      { row: 0, col: 1, dir: 'right' }
    ]

    for (const dir of directions) {
      const newRow = (current.row + dir.row + rows) % rows
      const newCol = (current.col + dir.col + cols) % cols
      const key = `${newRow},${newCol}`

      if (!visited.has(key) && !isSnakeBody(newRow, newCol, true)) {
        visited.add(key)
        queue.push({
          row: newRow,
          col: newCol,
          path: [...current.path, dir.dir]
        })
      }
    }
  }

  return getSafeDirection()
}

// 检查是否是蛇身
const isSnakeBody = (row: number, col: number, excludeTail: boolean = false): boolean => {
  const endIndex = excludeTail ? snake.value.length - 1 : snake.value.length
  return snake.value.slice(0, endIndex).some(segment =>
      segment.row === row && segment.col === col
  )
}

// 获取安全移动方向
const getSafeDirection = (): string[] => {
  const head = snake.value[0]
  if (!head) return ['right']

  const directions = [
    { row: -1, col: 0, dir: 'up' },
    { row: 1, col: 0, dir: 'down' },
    { row: 0, col: -1, dir: 'left' },
    { row: 0, col: 1, dir: 'right' }
  ]

  const safeDirections = directions.filter(dir => {
    const newRow = (head.row + dir.row + rows) % rows
    const newCol = (head.col + dir.col + cols) % cols
    return !isSnakeBody(newRow, newCol, true)
  })

  if (safeDirections.length > 0) {
    const currentDir = safeDirections.find(d => d.dir === direction.value)
    if (currentDir) return [direction.value]
    const randomDir = safeDirections[Math.floor(Math.random() * safeDirections.length)]
    return randomDir ? [randomDir.dir] : ['right']
  }

  return [direction.value]
}

// 移动蛇
const moveSnake = (): void => {
  const path = findPathToFood()
  if (path && path.length > 0) direction.value = path[0] as 'up' | 'down' | 'left' | 'right'

  // 确保蛇头存在且有有效的坐标
  const currentHead = snake.value[0]
  if (!currentHead || currentHead.row === undefined || currentHead.col === undefined) {
    console.error('蛇头坐标无效')
    return
  }

  // 创建新的头部位置，确保类型正确
  const head: Position = {
    row: currentHead.row,
    col: currentHead.col
  }

  switch (direction.value) {
    case 'up': head.row = (head.row - 1 + rows) % rows; break
    case 'down': head.row = (head.row + 1) % rows; break
    case 'left': head.col = (head.col - 1 + cols) % cols; break
    case 'right': head.col = (head.col + 1) % cols; break
  }

  const ateFood = head.row === food.value.row && head.col === food.value.col

  snake.value.unshift(head)
  if (!ateFood) {
    snake.value.pop()
  } else {
    changeSnakeColor()
    generateFood()
  }

  updateGrid()
  updateHeadDirection()
}

// 更新头部方向指示
const updateHeadDirection = (): void => {
  const head = snake.value[0]
  if (!head) return

  const headIndex = head.row * cols + head.col
  if (grid.value[headIndex]) {
    grid.value[headIndex].direction = direction.value
  }
}

// 生成食物
const generateFood = (): void => {
  let newFood: Position
  do {
    newFood = {
      row: Math.floor(Math.random() * rows),
      col: Math.floor(Math.random() * cols)
    }
  } while (snake.value.some(segment => segment.row === newFood.row && segment.col === newFood.col))

  food.value = newFood
}

// 下雨灯效
const startRainShow = (): void => {
  const startTime = Date.now()
  const duration = 800
  mode.value = 'rain-show'
  rainDrops.value = []

  if (rainShowInterval.value) clearInterval(rainShowInterval.value)

  rainShowInterval.value = window.setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = elapsed / duration

    if (elapsed >= duration) {
      clearInterval(rainShowInterval.value!)
      rainShowInterval.value = null
      mode.value = 'pause'
      rainDrops.value = []

      grid.value.forEach(cell => {
        cell.rainLight = false
        cell.rainColor = undefined
      })

      rainShowTimeout.value = window.setTimeout(() => {
        mode.value = 'snake-game'
        initializeSnake()
        generateFood()
        updateGrid()
        startAnimation()
      }, 100)
      return
    }

    grid.value.forEach(cell => {
      cell.rainLight = false
      cell.rainColor = undefined
    })

    const intensity = 6 + progress * 8

    if (Math.random() < intensity * 0.3) {
      createNewRainDrop()
    }

    updateRainDrops()

  }, 30)
}

// 创建新雨滴
const createNewRainDrop = (): void => {
  const edgeType = Math.floor(Math.random() * 4)
  const color = vibrantColors[Math.floor(Math.random() * vibrantColors.length)] || '#FF5252'

  let rainDrop: RainDrop = {
    id: Date.now() + Math.random(),
    color: color,
    progress: 0,
    speed: 0.03 + Math.random() * 0.02,
    length: 3 + Math.floor(Math.random() * 3),
    direction: 'down'
  }

  switch (edgeType) {
    case 0:
      rainDrop = { ...rainDrop, startCol: Math.floor(Math.random() * cols), direction: 'down', row: 0 }
      break
    case 1:
      rainDrop = { ...rainDrop, startCol: Math.floor(Math.random() * cols), direction: 'up', row: rows - 1 }
      break
    case 2:
      rainDrop = { ...rainDrop, startRow: Math.floor(Math.random() * rows), direction: 'right', col: 0 }
      break
    case 3:
      rainDrop = { ...rainDrop, startRow: Math.floor(Math.random() * rows), direction: 'left', col: cols - 1 }
      break
  }

  rainDrops.value.push(rainDrop)
}

// 更新所有雨滴位置
const updateRainDrops = (): void => {
  const updatedDrops: RainDrop[] = []

  rainDrops.value.forEach(drop => {
    drop.progress += drop.speed

    if (drop.progress > 1) {
      return
    }

    updatedDrops.push(drop)
    renderRainDrop(drop)
  })

  rainDrops.value = updatedDrops
}

// 渲染单个雨滴
const renderRainDrop = (drop: RainDrop): void => {
  switch (drop.direction) {
    case 'down':
      for (let i = 0; i < drop.length; i++) {
        const row = Math.floor((drop.row || 0) + drop.progress * (rows - 1) - i)
        if (row >= 0 && row < rows) {
          const cellIndex = row * cols + (drop.startCol || 0)
          if (grid.value[cellIndex]) {
            grid.value[cellIndex].rainLight = true
            grid.value[cellIndex].rainColor = drop.color
            grid.value[cellIndex].rainOpacity = 1 - (i * 0.3)
          }
        }
      }
      break

    case 'up':
      for (let i = 0; i < drop.length; i++) {
        const row = Math.floor((drop.row || 0) - drop.progress * (rows - 1) + i)
        if (row >= 0 && row < rows) {
          const cellIndex = row * cols + (drop.startCol || 0)
          if (grid.value[cellIndex]) {
            grid.value[cellIndex].rainLight = true
            grid.value[cellIndex].rainColor = drop.color
            grid.value[cellIndex].rainOpacity = 1 - (i * 0.3)
          }
        }
      }
      break

    case 'right':
      for (let i = 0; i < drop.length; i++) {
        const col = Math.floor((drop.col || 0) + drop.progress * (cols - 1) - i)
        if (col >= 0 && col < cols) {
          const cellIndex = (drop.startRow || 0) * cols + col
          if (grid.value[cellIndex]) {
            grid.value[cellIndex].rainLight = true
            grid.value[cellIndex].rainColor = drop.color
            grid.value[cellIndex].rainOpacity = 1 - (i * 0.3)
          }
        }
      }
      break

    case 'left':
      for (let i = 0; i < drop.length; i++) {
        const col = Math.floor((drop.col || 0) - drop.progress * (cols - 1) + i)
        if (col >= 0 && col < cols) {
          const cellIndex = (drop.startRow || 0) * cols + col
          if (grid.value[cellIndex]) {
            grid.value[cellIndex].rainLight = true
            grid.value[cellIndex].rainColor = drop.color
            grid.value[cellIndex].rainOpacity = 1 - (i * 0.3)
          }
        }
      }
      break
  }
}

// 变换蛇的颜色
const changeSnakeColor = (): void => {
  let newIndex
  do {
    newIndex = Math.floor(Math.random() * snakeColorThemes.length)
  } while (newIndex === currentColorIndex.value && snakeColorThemes.length > 1)

  currentColorIndex.value = newIndex
  const newColors = snakeColorThemes[currentColorIndex.value]
  if (newColors) {
    snakeColors.value = newColors
  }
}

// 获取单元格颜色和样式 - 修复空白格子颜色
const getCellColor = (cell: GridCell): string => {
  if (cell.rainLight && cell.rainColor) {
    const opacity = cell.rainOpacity !== undefined ? cell.rainOpacity : 0.8
    return cell.rainColor.replace(')', `, ${opacity})`).replace('hsl', 'hsla')
  }

  const currentTheme = getCurrentTheme()

  switch (cell.type) {
    case 'head':
      return snakeColors.value.head
    case 'body':
      return snakeColors.value.body
    case 'food':
      return '#4fb80d' // 食物保持绿色
    default:
      // 根据当前主题返回对应的空白格子颜色
      return themeColors[currentTheme].empty
  }
}

// 初始化蛇
const initializeSnake = (): void => {
  const startCol = Math.floor(cols / 2) - 5
  const startRow = Math.floor(rows / 2)
  snake.value = []

  for (let i = 0; i < 10; i++) {
    snake.value.push({ row: startRow, col: startCol + i })
  }

  direction.value = 'right'
  currentColorIndex.value = 0
  const initialColors = snakeColorThemes[0]
  if (initialColors) {
    snakeColors.value = initialColors
  }
}

// 启动动画
const startAnimation = (): void => {
  animationInterval.value = window.setInterval(moveSnake, showSpeed.value)
}

// 停止动画
const stopAnimation = (): void => {
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
    animationInterval.value = null
  }
}


// 监听主题变化
const observeThemeChanges = (): MutationObserver => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        // 主题变化时强制更新网格
        updateGrid()
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  return observer
}

let themeObserver: MutationObserver | null = null

// 生命周期
onMounted(() => {
  initializeGrid()
  startRainShow()
  themeObserver = observeThemeChanges()
})

onUnmounted(() => {
  stopAnimation()
  if (rainShowInterval.value) {
    clearInterval(rainShowInterval.value)
    rainShowInterval.value = null
  }
  if (rainShowTimeout.value) clearTimeout(rainShowTimeout.value)
  if (themeObserver) {
    themeObserver.disconnect()
  }
})
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(31, 1fr);
  grid-template-rows: repeat(13, 1fr);
}

.empty-cell {
  /* 背景色现在由 JavaScript 动态设置 */
}

.snake-head {
  box-shadow: 0 0 0 2px #000, 0 0 5px 3px rgba(255, 255, 255, 0.7);
  z-index: 10;
  transform: scale(1.05);
  position: relative;
}

.snake-body {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
  z-index: 5;
}

.snake-food {
  box-shadow: 0 0 0 2px #000, 0 0 8px 4px rgba(85, 255, 0, 0.5);
  z-index: 20;
  animation: pulse 1s infinite alternate;
}

/* 头部方向指示 */
.snake-head::after {
  content: '';
  position: absolute;
  width: 30%;
  height: 30%;
  background: #fa4545;
  border-radius: 50%;
}

.snake-head[data-direction="right"]::after {
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
}

.snake-head[data-direction="left"]::after {
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
}

.snake-head[data-direction="up"]::after {
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
}

.snake-head[data-direction="down"]::after {
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}
</style>
# l2d-viewer 开发指南

## 项目背景

`l2d-viewer` 是一个独立的 Live2D 模型可视化调试工具。用户目前无法直观看到 Live2D 模型的可点击区域、表情列表、动作列表和参数，本工具旨在解决这个痛点，提供所见即所得的模型调试体验。

上游库来自 `/Users/hacxy/Projects/l2d`，在 `package.json` 中以本地 workspace link 引入：`"l2d": "file:../l2d"`。

---

## 上游库 l2d 的完整 API（必读）

上游库从 `l2d` 导出 `init` 函数和 `L2D` 类型：

```ts
import { init } from 'l2d'
import type { L2D, Options, L2DEventMap, ParamInfo } from 'l2d'
```

### 初始化

```ts
const l2d = init(canvasElement) // 传入 HTMLCanvasElement
```

### Options 类型

```ts
interface Options {
  path: string              // 模型配置文件路径 (.model.json 或 .model3.json)
  position?: [x: number, y: number]  // 偏移范围 [-2, 2]，默认 [0, 0]
  scale?: number            // 缩放，1 = 原始大小，默认 1
  logLevel?: 'error' | 'warn' | 'info' | 'trace'
}
```

### 方法列表

| 方法 | 签名 | 说明 |
|------|------|------|
| `load` | `load(options: Options): Promise<void>` | 加载模型，自动识别 Cubism 2/6 |
| `getExpressions` | `getExpressions(): string[]` | 获取表情 ID 列表 |
| `setExpression` | `setExpression(id?: string): void` | 播放表情，无参数则随机 |
| `getMotions` | `getMotions(): Record<string, string[]>` | 获取动作列表，结构为 `{ groupName: [filePath, ...] }` |
| `playMotion` | `playMotion(group: string, index?: number, priority?: number): void` | 播放指定分组/索引的动作 |
| `playMotionByFile` | `playMotionByFile(file: string, priority?: number): void` | 按文件路径播放动作 |
| `getHitAreaBounds` | `getHitAreaBounds(): Array<{name: string, x: number, y: number, w: number, h: number}>` | 获取可点击区域边界（0-1 相对于 canvas 的比例值） |
| `setPosition` | `setPosition(x: number, y: number): void` | 设置模型位置，范围 [-2, 2] |
| `setScale` | `setScale(scale: number): void` | 设置模型缩放 |
| `setParams` | `setParams(params: Record<string, number>): void` | 手动设置模型参数值 |
| `getParams` | `getParams(): ParamInfo[]` | 读取所有参数当前状态，Cubism 2/6 完全对称，每帧调用可实现实时追踪 |
| `resize` | `resize(): void` | 通知 canvas 尺寸变化 |
| `getCanvas` | `getCanvas(): HTMLCanvasElement` | 获取 canvas DOM 元素 |
| `destroy` | `destroy(): void` | 销毁实例，释放 WebGL 资源 |
| `on` | `on<K extends keyof L2DEventMap>(event: K, callback: L2DEventMap[K]): void` | 订阅事件 |
| `off` | `off<K extends keyof L2DEventMap>(event: K, callback: L2DEventMap[K]): void` | 取消订阅 |

### 事件列表

```ts
interface L2DEventMap {
  tap: (areaName: string) => void
  loadstart: (total: number) => void
  loadprogress: (loaded: number, total: number, file: string) => void
  loaded: () => void
  expressionstart: (id: string) => void
  expressionend: () => void
  motionstart: (group: string, index: number, duration: number | null, file: string | null) => void
  motionend: (group: string, index: number, file: string | null) => void
  destroy: () => void
}
```

### ParamInfo 类型

```ts
interface ParamInfo {
  id: string       // 参数 ID，如 "ParamEyeLOpen" / "PARAM_MOUTH_OPEN_Y"
  value: number    // 当前值（每帧变化）
  min: number      // 最小值
  max: number      // 最大值
  default: number  // 默认值（模型加载后固定不变）
}
```

**注意：**
- `getParams()` 在 Cubism 2 和 Cubism 6 上完全对称，包含 `default` 字段
- `value !== default` 时说明该参数正被当前动作驱动（活跃参数）
- `getHitAreaBounds()` 返回的坐标是 0-1 比例值，相对于 canvas 宽高，可直接换算为百分比 CSS 定位

---

## 技术栈

- **React 19** + **TypeScript**
- **Ant Design 5**（UI 组件库）
- **React Router 7**（路由 + query string 状态）
- **Jotai**（原子状态管理）
- **Vite**（构建工具）
- **pnpm**（包管理）

初始化命令（在项目根目录执行）：

```bash
pnpm create vite . --template react-ts
pnpm add antd jotai react-router
pnpm add -D @types/node
pnpm add l2d@file:../l2d
```

---

## 项目结构

```
src/
├── main.tsx
├── App.tsx                        # ConfigProvider (AntD 主题) + RouterProvider
├── router.tsx                     # 路由定义
│
├── atoms/
│   ├── model.ts                   # 模型加载状态、表情、动作、HitArea 数据
│   ├── viewer.ts                  # 位置、缩放、overlay 开关、主题、派生代码 atom
│   ├── motions.ts                 # 当前播放动作状态、进度
│   ├── expressions.ts             # 当前激活表情
│   └── history.ts                 # URL 历史 (atomWithStorage → localStorage)
│
├── hooks/
│   ├── useL2D.ts                  # 初始化/销毁 L2D，监听 modelUrlAtom 触发 load
│   ├── useModelEvents.ts          # 注册所有 L2D 事件，更新对应 atoms
│   ├── useHitAreaOverlay.ts       # rAF 循环读取 getHitAreaBounds() → hitAreaBoundsAtom
│   ├── useMotionProgress.ts       # rAF 循环计算动作播放进度 0-1
│   ├── useParamsRaf.ts            # rAF 循环轮询 getParams() → paramsAtom
│   └── useDragToReposition.ts     # canvas 上 pointer 拖拽移动模型
│
├── pages/
│   └── ViewerPage.tsx             # 唯一主页面
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx          # AntD Layout 外壳（Header + Content + Sider）
│   │   ├── TopBar.tsx             # URL 输入栏 + StatusBadge + 主题切换
│   │   └── Sidebar.tsx            # 右侧可折叠侧边栏，容纳所有面板
│   ├── canvas/
│   │   ├── CanvasStage.tsx        # <canvas> 容器，ResizeObserver → l2d.resize()
│   │   ├── HitAreaOverlay.tsx     # 绝对定位 div 覆盖层，展示 hit area 边界
│   │   └── LoadingOverlay.tsx     # 加载遮罩（进度条）
│   ├── controls/
│   │   ├── UrlInputBar.tsx        # AutoComplete 输入框 + Load 按钮
│   │   ├── TransformControls.tsx  # x/y/scale 三个 Slider
│   │   ├── CodePreview.tsx        # 实时 load(options) 代码 + 一键复制
│   │   └── ResetButton.tsx        # 重置位置/缩放至默认值
│   ├── panels/
│   │   ├── ExpressionPanel.tsx    # 表情列表，激活高亮，点击播放
│   │   ├── MotionPanel.tsx        # 动作列表（Collapse 分组），进度条，点击切换
│   │   ├── ParamPanel.tsx         # 参数列表：搜索过滤、活跃高亮、滑块调值
│   │   └── HitAreaPanel.tsx       # HitArea 表格 + overlay 开关
│   └── shared/
│       ├── PanelCard.tsx          # 可折叠面板卡片（包装各 panel）
│       ├── EmptyState.tsx         # 未加载模型时的占位提示
│       └── StatusBadge.tsx        # idle/loading/loaded/error 状态徽章
│
├── lib/
│   ├── l2dSingleton.ts            # 模块级 L2D 实例持有器（非 React Context）
│   └── codegenUtils.ts            # 生成格式化的 load(options) 代码字符串
│
└── styles/
    ├── index.css                  # 全局重置 + CSS 变量
    └── theme.ts                   # AntD token 配置 (light/dark)
```

---

## 路由设计

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | redirect → `/viewer` | |
| `/viewer` | `ViewerPage` | 主调试界面 |
| `*` | redirect → `/viewer` | 兜底 |

**Query String：** 模型地址存在 `?model=<encoded-url>` 中，页面初始化时自动读取并触发加载，支持分享链接。

---

## Jotai Atoms 完整定义

### `atoms/model.ts`

```ts
import { atom } from 'jotai'
import type { ParamInfo } from 'l2d'

export const modelUrlAtom = atom<string>('')
export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error'
export const loadingStatusAtom = atom<LoadStatus>('idle')
export const loadingErrorAtom = atom<string | null>(null)
export const loadProgressAtom = atom<{ loaded: number; total: number }>({ loaded: 0, total: 0 })
export const expressionsAtom = atom<string[]>([])
export const motionsAtom = atom<Record<string, string[]>>({})
export const hitAreaBoundsAtom = atom<Array<{ name: string; x: number; y: number; w: number; h: number }>>([])
// 由 useParamsRaf rAF 循环轮询 getParams() 写入，每帧更新
export const paramsAtom = atom<ParamInfo[]>([])
```

### `atoms/viewer.ts`

```ts
import { atom } from 'jotai'
import { modelUrlAtom } from './model'
import { generateLoadCode } from '../lib/codegenUtils'

export const posXAtom = atom<number>(0)     // [-2, 2]
export const posYAtom = atom<number>(0)     // [-2, 2]
export const scaleAtom = atom<number>(1)    // [0.1, 5]
export const hitAreaOverlayEnabledAtom = atom<boolean>(false)
export const themeAtom = atom<'light' | 'dark'>('dark')

// 派生 atom：实时生成 load() 代码字符串
export const loadOptionsCodeAtom = atom((get) =>
  generateLoadCode({
    path: get(modelUrlAtom),
    position: [get(posXAtom), get(posYAtom)],
    scale: get(scaleAtom),
  })
)
```

### `atoms/motions.ts`

```ts
import { atom } from 'jotai'

export const activeMotionAtom = atom<{ group: string; index: number } | null>(null)
export const motionProgressAtom = atom<number>(0)       // 0-1
export const motionDurationAtom = atom<number | null>(null)  // 秒
```

### `atoms/expressions.ts`

```ts
import { atom } from 'jotai'

export const activeExpressionAtom = atom<string | null>(null)
```

### `atoms/history.ts`

```ts
import { atomWithStorage } from 'jotai/utils'

// 持久化到 localStorage，最多 20 条，去重，最新的在前
export const urlHistoryAtom = atomWithStorage<string[]>('l2d-viewer-history', [])
```

---

## 关键实现细节

### `lib/l2dSingleton.ts`

```ts
import type { L2D } from 'l2d'

let instance: L2D | null = null

export function setL2DInstance(l: L2D | null) { instance = l }
export function getL2DInstance(): L2D | null { return instance }
```

**原因：** L2D 实例是命令式 WebGL 会话，不是 React 值，用模块级变量持有，避免 Context 传递开销。

### `lib/codegenUtils.ts`

```ts
interface CodegenOptions {
  path: string
  position: [number, number]
  scale: number
}

export function generateLoadCode(opts: CodegenOptions): string {
  const { path, position, scale } = opts
  return `l2d.load({
  path: '${path}',
  position: [${position[0].toFixed(2)}, ${position[1].toFixed(2)}],
  scale: ${scale.toFixed(2)},
})`
}
```

### `hooks/useL2D.ts` 核心逻辑

```ts
// 伪代码，需完整实现
export function useL2D(canvasRef: RefObject<HTMLCanvasElement>) {
  const l2dRef = useRef<L2D | null>(null)
  const modelUrl = useAtomValue(modelUrlAtom)
  const posX = useAtomValue(posXAtom)
  const posY = useAtomValue(posYAtom)
  const scale = useAtomValue(scaleAtom)
  const setStatus = useSetAtom(loadingStatusAtom)
  const setError = useSetAtom(loadingErrorAtom)

  // mount: init
  useEffect(() => {
    if (!canvasRef.current) return
    const l2d = init(canvasRef.current)
    l2dRef.current = l2d
    setL2DInstance(l2d)
    return () => { l2d.destroy(); setL2DInstance(null) }
  }, [])

  // 事件绑定由 useModelEvents 处理

  // URL 变化时加载模型
  useEffect(() => {
    if (!modelUrl || !l2dRef.current) return
    setStatus('loading')
    setError(null)
    l2dRef.current.load({ path: modelUrl, position: [posX, posY], scale })
      .catch((err: Error) => {
        setStatus('error')
        setError(err.message)
      })
  }, [modelUrl]) // 只监听 URL 变化触发加载

  return l2dRef
}
```

### `hooks/useModelEvents.ts` 核心逻辑

```ts
// 在 loaded 事件后填充所有面板数据
l2d.on('loaded', () => {
  setStatus('loaded')
  setExpressions(l2d.getExpressions())
  setMotions(l2d.getMotions())
  // hitAreaBounds 由 useHitAreaOverlay 的 rAF 循环实时更新
})
l2d.on('loadstart', (total) => { setStatus('loading'); setProgress({ loaded: 0, total }) })
l2d.on('loadprogress', (loaded, total) => setProgress({ loaded, total }))
l2d.on('motionstart', (group, index, duration) => {
  setActiveMotion({ group, index })
  setMotionDuration(duration)
  setMotionProgress(0)
})
l2d.on('motionend', () => { setActiveMotion(null); setMotionProgress(0) })
l2d.on('expressionstart', (id) => setActiveExpression(id))
l2d.on('expressionend', () => setActiveExpression(null))
```

### `components/canvas/HitAreaOverlay.tsx` 实现思路

```tsx
// 从 hitAreaBoundsAtom 读取，渲染绝对定位的 div
// x, y, w, h 均为 0-1 比例值，直接转为百分比 CSS
{bounds.map(area => (
  <div
    key={area.name}
    style={{
      position: 'absolute',
      left: `${area.x * 100}%`,
      top: `${area.y * 100}%`,
      width: `${area.w * 100}%`,
      height: `${area.h * 100}%`,
      border: '2px solid rgba(0, 255, 128, 0.8)',
      backgroundColor: 'rgba(0, 255, 128, 0.1)',
      pointerEvents: 'none',
      boxSizing: 'border-box',
    }}
  >
    <span style={{ color: '#00ff80', fontSize: 12, padding: '2px 4px' }}>{area.name}</span>
  </div>
))}
```

### `hooks/useHitAreaOverlay.ts` 实现思路

```ts
useEffect(() => {
  if (!enabled || !l2dRef.current) return
  let rafId: number
  const loop = () => {
    const bounds = l2dRef.current?.getHitAreaBounds() ?? []
    setHitAreaBounds(bounds)
    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)
  return () => cancelAnimationFrame(rafId)
}, [enabled])
```

### `hooks/useParamsRaf.ts` 实现思路

```ts
// 模型 loaded 后启动 rAF 循环，每帧调用 getParams() 写入 paramsAtom
// 模型 destroy 或 unmount 时停止
useEffect(() => {
  if (loadingStatus !== 'loaded') return
  let rafId: number
  const loop = () => {
    const params = getL2DInstance()?.getParams() ?? []
    setParams(params)
    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)
  return () => cancelAnimationFrame(rafId)
}, [loadingStatus])
```

### `components/panels/ParamPanel.tsx` 设计

**三个功能组合：**

1. **搜索过滤**：顶部 Input 按 `id` 文字过滤参数列表
2. **活跃高亮**：`Math.abs(value - default) > 0.001` 时标记为活跃（蓝色左边框/标识），帮助用户在播放动作时快速识别被驱动的参数
3. **滑块调值**：每行一个 AntD Slider，范围 `[min, max]`，`onChange` 调用 `l2d.setParams({ [id]: newValue })`；行尾有"重置"按钮恢复 `default`

```tsx
// 每行结构（伪代码）
<div className={isActive ? 'param-row active' : 'param-row'}>
  <span className="param-id">{param.id}</span>
  <Slider
    min={param.min} max={param.max} step={(param.max - param.min) / 200}
    value={param.value}
    onChange={(v) => l2d.setParams({ [param.id]: v })}
  />
  <span className="param-value">{param.value.toFixed(3)}</span>
  <Button size="small" onClick={() => l2d.setParams({ [param.id]: param.default })}>↺</Button>
</div>
```

**活跃判断阈值 0.001**：避免浮点精度噪音导致静止参数闪烁。

### `hooks/useDragToReposition.ts` 实现思路

```ts
// pointerdown → 记录起始点和当前 posX/posY
// pointermove → 计算 delta（像素），映射到 [-2,2] 范围
// 映射公式: newX = startX + (deltaPixels / canvasWidth) * 4
// 调用 l2d.setPosition(newX, newY)，同步写 posXAtom/posYAtom
```

---

## 布局设计

```
┌─────────────────────────────────────────────────────────────┐
│  TopBar: [URL 输入框................] [Load] [状态] [主题]    │
├─────────────────────────────────────┬───────────────────────┤
│                                     │ TransformControls     │
│                                     │  X: ──●──────         │
│         CanvasStage                 │  Y: ───────●──        │
│         (WebGL canvas)              │  Scale: ──●───        │
│         [HitAreaOverlay]            │  [重置]               │
│         [LoadingOverlay]            │  代码预览 [复制]       │
│                                     ├───────────────────────┤
│                                     │ 表情面板              │
│                                     ├───────────────────────┤
│                                     │ 动作面板              │
│                                     ├───────────────────────┤
│                                     │ 参数面板              │
│                                     ├───────────────────────┤
│                                     │ Hit Area 面板 [覆盖]  │
└─────────────────────────────────────┴───────────────────────┘
```

---

## 实施顺序

### Phase 1 — 脚手架与基础设施
1. 执行初始化命令（见上方技术栈章节），安装所有依赖
2. 配置 `vite.config.ts`：添加路径别名 `@/` → `src/`，以及 `resolve.alias` 中设置 `@types/node`
3. 配置 `tsconfig.json`：严格模式，添加 `paths: { "@/*": ["src/*"] }`
4. 创建所有 atoms 文件（类型完整的空定义）
5. 创建 `lib/l2dSingleton.ts` 和 `lib/codegenUtils.ts`
6. 创建 `styles/index.css`（全局重置）和 `styles/theme.ts`（AntD token）
7. 创建 `router.tsx` + `App.tsx`（ConfigProvider 读 themeAtom + RouterProvider）

### Phase 2 — Canvas 与 L2D 集成
8. 实现 `hooks/useModelEvents.ts`
9. 实现 `hooks/useL2D.ts`（依赖 useModelEvents）
10. 实现 `components/canvas/CanvasStage.tsx`（ResizeObserver → l2d.resize()）
11. 实现 `components/canvas/LoadingOverlay.tsx`

### Phase 3 — URL 输入与加载
12. 实现 `components/controls/UrlInputBar.tsx`（AutoComplete + 历史下拉 + 写 query string）
13. 实现 `pages/ViewerPage.tsx`（读 `?model=` query string → 初始化 modelUrlAtom）
14. 实现 `components/shared/StatusBadge.tsx`
15. 实现 `components/layout/AppLayout.tsx` + `TopBar.tsx`

### Phase 4 — 变换控制
16. 实现 `components/controls/TransformControls.tsx`（三个 Slider，onChange 即调 l2d 方法）
17. 实现 `components/controls/ResetButton.tsx`
18. 实现 `components/controls/CodePreview.tsx`（读 loadOptionsCodeAtom，一键复制）

### Phase 5 — 调试面板
19. 实现 `components/panels/ExpressionPanel.tsx`（含"随机"按钮）
20. 实现 `hooks/useMotionProgress.ts` + `components/panels/MotionPanel.tsx`
21. 实现 `hooks/useParamsRaf.ts`（rAF 循环轮询 `getParams()` → `paramsAtom`）
22. 实现 `components/panels/ParamPanel.tsx`（搜索过滤 + 活跃高亮 + 滑块调值 + 重置按钮）
23. 实现 `hooks/useHitAreaOverlay.ts` + `components/canvas/HitAreaOverlay.tsx` + `components/panels/HitAreaPanel.tsx`

### Phase 6 — 布局与体验
24. 实现 `components/layout/Sidebar.tsx`（AntD Sider，可折叠，PanelCard 包装各面板）
25. 实现 `components/shared/PanelCard.tsx` + `EmptyState.tsx`
26. 实现 `hooks/useDragToReposition.ts`，接入 CanvasStage
27. 实现主题切换（TopBar 中的 ThemeToggle 按钮，写 themeAtom）
28. 实现 URL 历史持久化（atomWithStorage，去重，最多 20 条）
29. 实现导出配置功能（TopBar 或 Sidebar 中的"Export Config"按钮，下载 `l2d-config.json`）
30. 错误处理 UI（CanvasStage 中条件渲染 AntD `Result` 组件）
31. 小屏响应式（`Grid.useBreakpoint()`，小屏时 Sider 改为底部 `Drawer`）

---

## 验证方式

```bash
pnpm dev   # 启动开发服务器，访问 http://localhost:5173
```

1. 访问页面，确认布局正常渲染（TopBar + Canvas + Sidebar）
2. 输入公开模型地址，点击 Load，验证加载进度条 → 模型展示 → 面板数据填充
3. 拖动 x/y/scale 滑块，模型实时变化，代码预览实时更新，复制按钮可用
4. 点击表情条目，验证表情激活高亮
5. 点击动作条目，验证进度条和激活状态
5a. 播放动作期间，验证参数面板中被驱动的参数自动高亮（蓝色标识）
5b. 拖动参数滑块，验证模型对应部位实时响应，点击"↺"恢复 default
5c. 参数搜索框输入关键字，验证列表过滤正常
6. 开启 Hit Area 覆盖层开关，验证边界框显示在正确位置
7. 刷新页面，验证 `?model=` query string 自动触发加载
8. 拖拽 canvas 上的模型，验证位置跟随鼠标变化
9. 切换深色/浅色主题，验证 UI 整体变化
10. 输入第二个模型地址，验证历史下拉中出现之前的地址

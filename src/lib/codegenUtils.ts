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

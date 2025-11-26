export function resolveImg(img?: string, fallback?: string) {
  if (!img) return fallback || ''
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('//')) return img
  const base = (import.meta as any).env?.VITE_API_URL || ''
  if (!base) return img
  return `${base.replace(/\/$/, '')}/${img.replace(/^\//, '')}`
}

export default resolveImg

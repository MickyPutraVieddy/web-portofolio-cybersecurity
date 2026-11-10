/**
 * Minimal QR Code encoder (ISO/IEC 18004): byte mode, error-correction level M, versions 1–10, automatic mask choice.
 * No dependencies — used to draw the Google Authenticator enrollment code. Output is a boolean matrix (true = dark module).
 */

// Level M tables, index = version (1..10)
const ECC_PER_BLOCK = [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26]
const BLOCKS = [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5]
const FORMAT_BITS_M = 0
const MAX_VERSION = 10

function rawModules(ver: number): number {
  let result = (16 * ver + 128) * ver + 64
  if (ver >= 2) { const n = Math.floor(ver / 7) + 2; result -= (25 * n - 10) * n - 55; if (ver >= 7) result -= 36 }
  return result
}
const dataCodewords = (ver: number) => Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK[ver] * BLOCKS[ver]

// ---- Reed–Solomon over GF(2^8) / 0x11D
function gfMul(x: number, y: number): number {
  let z = 0
  for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((y >>> i) & 1) * x }
  return z
}
function rsDivisor(degree: number): number[] {
  const result = new Array<number>(degree).fill(0)
  result[degree - 1] = 1
  let root = 1
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) { result[j] = gfMul(result[j], root); if (j + 1 < result.length) result[j] ^= result[j + 1] }
    root = gfMul(root, 0x02)
  }
  return result
}
function rsRemainder(data: number[], divisor: number[]): number[] {
  const result = divisor.map(() => 0)
  for (const b of data) {
    const factor = b ^ (result.shift() as number)
    result.push(0)
    divisor.forEach((coef, i) => { result[i] ^= gfMul(coef, factor) })
  }
  return result
}

function alignmentPositions(ver: number): number[] {
  if (ver === 1) return []
  const n = Math.floor(ver / 7) + 2
  const step = Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2
  const out = [6]
  for (let pos = ver * 4 + 10; out.length < n; pos -= step) out.splice(1, 0, pos)
  return out
}

function buildCodewords(bytes: number[], ver: number): number[] {
  const bits: number[] = []
  const push = (value: number, len: number) => { for (let i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1) }
  push(0b0100, 4)
  push(bytes.length, ver >= 10 ? 16 : 8)
  for (const b of bytes) push(b, 8)
  const capacityBits = dataCodewords(ver) * 8
  push(0, Math.min(4, capacityBits - bits.length))
  push(0, (8 - (bits.length % 8)) % 8)
  const data: number[] = []
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2))
  for (let pad = 0xec; data.length < dataCodewords(ver); pad ^= 0xec ^ 0x11) data.push(pad)

  const numBlocks = BLOCKS[ver], eccLen = ECC_PER_BLOCK[ver]
  const raw = Math.floor(rawModules(ver) / 8)
  const shortBlocks = numBlocks - (raw % numBlocks)
  const shortLen = Math.floor(raw / numBlocks)
  const divisor = rsDivisor(eccLen)
  const blocks: number[][] = []
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const dat = data.slice(k, k + shortLen - eccLen + (i < shortBlocks ? 0 : 1))
    k += dat.length
    const ecc = rsRemainder(dat, divisor)
    if (i < shortBlocks) dat.push(0)
    blocks.push(dat.concat(ecc))
  }
  const result: number[] = []
  for (let i = 0; i < blocks[0].length; i++)
    blocks.forEach((block, j) => { if (i !== shortLen - eccLen || j >= shortBlocks) result.push(block[i]) })
  return result
}

function penalty(m: boolean[][]): number {
  const n = m.length
  let score = 0
  const line = (get: (i: number) => boolean) => {
    let run = 1
    for (let i = 1; i < n; i++) {
      if (get(i) === get(i - 1)) { run++; if (run === 5) score += 3; else if (run > 5) score++ } else run = 1
    }
    // finder-like 1:1:3:1:1 pattern with 4 light modules on either side
    const pat = [true, false, true, true, true, false, true]
    for (let i = 0; i + 7 <= n; i++) {
      if (!pat.every((v, k) => get(i + k) === v)) continue
      const lightBefore = i >= 4 && [1, 2, 3, 4].every((k) => !get(i - k))
      const lightAfter = i + 11 <= n && [7, 8, 9, 10].every((k) => !get(i + k))
      if (lightBefore || lightAfter) score += 40
    }
  }
  for (let y = 0; y < n; y++) line((x) => m[y][x])
  for (let x = 0; x < n; x++) line((y) => m[y][x])
  for (let y = 0; y + 1 < n; y++) for (let x = 0; x + 1 < n; x++) if (m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) score += 3
  const dark = m.reduce((a, row) => a + row.filter(Boolean).length, 0)
  score += Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10
  return score
}

const MASKS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0, (_x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => ((((x * y) % 2) + ((x * y) % 3)) % 2) === 0, (x, y) => ((((x + y) % 2) + ((x * y) % 3)) % 2) === 0,
]

export function qrMatrix(text: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text))
  let ver = 1
  while (ver <= MAX_VERSION && dataCodewords(ver) * 8 < 4 + (ver >= 10 ? 16 : 8) + bytes.length * 8) ver++
  if (ver > MAX_VERSION) throw new Error("Text is too long for this QR encoder")

  const size = ver * 4 + 17
  const modules = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const isFn = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const set = (x: number, y: number, dark: boolean) => { modules[y][x] = dark; isFn[y][x] = true }

  for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0) }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]])
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx, y = cy + dy
      if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, Math.max(Math.abs(dx), Math.abs(dy)) !== 2 && Math.max(Math.abs(dx), Math.abs(dy)) !== 4)
    }
  const align = alignmentPositions(ver)
  align.forEach((ax, i) => align.forEach((ay, j) => {
    if ((i === 0 && j === 0) || (i === 0 && j === align.length - 1) || (i === align.length - 1 && j === 0)) return
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
  }))

  const drawFormat = (mask: number) => {
    const data = (FORMAT_BITS_M << 3) | mask
    let rem = data
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
    const bits = ((data << 10) | rem) ^ 0x5412
    const bit = (i: number) => ((bits >>> i) & 1) !== 0
    for (let i = 0; i <= 5; i++) set(8, i, bit(i))
    set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8))
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i))
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i))
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i))
    set(8, size - 8, true)
  }
  drawFormat(0)
  if (ver >= 7) {
    let rem = ver
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25)
    const bits = (ver << 12) | rem
    for (let i = 0; i < 18; i++) { const dark = ((bits >>> i) & 1) !== 0, a = size - 11 + (i % 3), b = Math.floor(i / 3); set(a, b, dark); set(b, a, dark) }
  }

  const codewords = buildCodewords(bytes, ver)
  let bitIndex = 0
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
      const x = right - j, upward = ((right + 1) & 2) === 0, y = upward ? size - 1 - vert : vert
      if (!isFn[y][x] && bitIndex < codewords.length * 8) { modules[y][x] = ((codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) !== 0; bitIndex++ }
    }
  }

  const applyMask = (mask: number) => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!isFn[y][x] && MASKS[mask](x, y)) modules[y][x] = !modules[y][x] }
  let best = 0, bestScore = Infinity
  for (let mask = 0; mask < 8; mask++) {
    drawFormat(mask); applyMask(mask)
    const score = penalty(modules)
    if (score < bestScore) { best = mask; bestScore = score }
    applyMask(mask)
  }
  drawFormat(best); applyMask(best)
  return modules
}

/** Rows as "0101…" strings — compact to send to the browser, which draws them as SVG. */
export const qrRows = (text: string): string[] => qrMatrix(text).map((row) => row.map((d) => (d ? "1" : "0")).join(""))

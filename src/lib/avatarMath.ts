import { clamp } from './sceneMath'

/** Normalize cursor position, preserving a calm, frontal dead zone at the center. */
export function pointerToYaw(clientX: number, width: number, deadZone = 0.08) {
  if (width <= 0) return 0
  const normalized = clamp(clientX / width, 0, 1) * 2 - 1
  return Math.abs(normalized) <= deadZone ? 0 : Math.sign(normalized) * Math.min(1, (Math.abs(normalized) - deadZone) / (1 - deadZone))
}

export function yawToFrame(yaw: number) {
  return (clamp(yaw, -1, 1) + 1) * 4
}

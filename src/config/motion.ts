const ENTRY_EASE: [number, number, number, number] = [
  0.25, 0.1, 0.25, 1,
]

export const entryMotion = {
  duration: 0.6,
  distance: 12,
  ease: ENTRY_EASE,
  delays: {
    logo: 0,
    nav: 0.15,
    caption: 0.3,
    productInfo: 0.45,
  },
} as const

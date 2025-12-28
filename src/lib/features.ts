export const ENABLE_V4_PROTOCOL =
  (process.env.NEXT_PUBLIC_ENABLE_V4_PROTOCOL || process.env.ENABLE_V4_PROTOCOL || '').toLowerCase() === 'true'

export const ENABLE_LEGACY_PROTOCOL =
  (process.env.ENABLE_LEGACY_PROTOCOL ?? 'true').toLowerCase() !== 'false'

export function assertV4Enabled() {
  if (!ENABLE_V4_PROTOCOL) {
    throw new Error('V4 protocol is disabled via ENABLE_V4_PROTOCOL')
  }
}


import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/health/route'

describe('GET /api/health', () => {
  it('should return status ok', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('ok')
  })

  it('should return valid ISO timestamp', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.timestamp).toBeTruthy()
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp)
  })

  it('should return version', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.version).toBe('0.1.0')
  })
})

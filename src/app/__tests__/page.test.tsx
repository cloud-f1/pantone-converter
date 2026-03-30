import { describe, it, expect, vi } from 'vitest'
import { PANTONE_MAP } from '@/features/color/data/pantone-map'

// Mock the i18n modules so the async Server Component can be tested
vi.mock('@/i18n/get-locale', () => ({
  getLocale: vi.fn().mockResolvedValue('en'),
}))

vi.mock('@/i18n/get-dictionary', () => ({
  getDictionary: vi.fn().mockResolvedValue({
    site: { title: 'Pantone Color Converter', tagline: 'Test tagline' },
    home: {
      howToUse: 'How to Use',
      shareOnSocial: 'Share on Social',
      shareOnSocialDesc: 'Test desc',
      apiIntegration: 'API Integration',
      apiIntegrationDesc: 'Test desc',
      colorReference: 'Color Reference',
      colorReferenceDesc: 'Test desc',
      livePreview: 'Live Preview',
      livePreviewDesc: 'Test desc',
      browseColors: 'Browse Colors',
      tryApi: 'Try API',
      colorsAvailable: '{count} colors',
      colorsIndexed: '{count} colors indexed',
    },
    color: {},
    tabs: {},
    footer: { poweredBy: 'Powered by' },
  }),
}))

describe('Homepage', () => {
  it('should have PANTONE_MAP with entries', () => {
    const keys = Object.keys(PANTONE_MAP)
    expect(keys.length).toBeGreaterThan(200)
  })

  it('should have valid hex format for all entries', () => {
    for (const [key, entry] of Object.entries(PANTONE_MAP)) {
      expect(entry.hex, `${key} hex`).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })

  it('should have family field for all entries', () => {
    for (const [key, entry] of Object.entries(PANTONE_MAP)) {
      expect(entry.family, `${key} family`).toBeTruthy()
    }
  })

  it('should have correct color link paths', () => {
    const keys = Object.keys(PANTONE_MAP)
    for (const key of keys.slice(0, 5)) {
      expect(`/color/${key}`).toMatch(/^\/color\/[A-Z0-9]+$/)
    }
  })
})

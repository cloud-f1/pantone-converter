import { describe, it, expect } from 'vitest'
import { generateMetadata } from '../page'

describe('/color/[pantone] metadata', () => {
  it('should generate metadata for known color', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ pantone: '485C' }),
    })

    expect(metadata.title).toContain('485')
    expect(metadata.openGraph?.images).toBeDefined()

    const images = metadata.openGraph?.images as Array<{ url: string }>
    expect(images[0].url).toContain('/api/og?pantone=485C')
  })

  it('should generate fallback metadata for unknown color', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ pantone: 'ZZZZZ' }),
    })

    expect(metadata.title).toContain('Unknown')
  })
})

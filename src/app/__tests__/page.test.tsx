import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../page'
import { PANTONE_MAP } from '@/features/color/data/pantone-map'

describe('Homepage', () => {
  it('should render the title', () => {
    render(<Home />)
    expect(screen.getByText('Pantone Color Converter')).toBeDefined()
  })

  it('should render How to Use section', () => {
    render(<Home />)
    expect(screen.getByText('How to Use')).toBeDefined()
  })

  it('should render all color cards as links', () => {
    render(<Home />)
    const keys = Object.keys(PANTONE_MAP)

    for (const key of keys.slice(0, 5)) {
      const entry = PANTONE_MAP[key]
      expect(screen.getAllByText(entry.name).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('should link to correct color pages', () => {
    render(<Home />)
    const links = screen.getAllByRole('link')
    const colorLinks = links.filter((link) =>
      link.getAttribute('href')?.startsWith('/color/')
    )
    expect(colorLinks.length).toBe(Object.keys(PANTONE_MAP).length)
  })
})

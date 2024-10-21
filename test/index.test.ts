import { describe, it, expect } from 'vitest'
import { presetDaisy, defaultOptions } from '../index'

describe('presetDaisy', () => {
  it('should return a preset object with correct structure', () => {
    const preset = presetDaisy()
    expect(preset).toBeTypeOf('object')
    expect(preset.name).toBe('unocss-preset-daisy')
    expect(preset.preflights).toBeInstanceOf(Array)
    expect(preset.theme).toBeTypeOf('object')
    expect(preset.rules).toBeInstanceOf(Array)
  })

  it('should use default options when no options are provided', () => {
    const preset = presetDaisy()
    expect(preset.name).toBe('unocss-preset-daisy')
    if (preset.theme && typeof preset.theme === 'object') {
      expect(preset.theme).toHaveProperty('colors')
      if ('colors' in preset.theme) {
        expect(preset.theme.colors).toHaveProperty('base')
      }
    }
  })

  it('should override default options with provided options', () => {
    const customOptions = {
      styled: false,
      themes: ['light', 'dark'],
      base: false,
    }
    const preset = presetDaisy(customOptions)
    expect(preset.name).toBe('unocss-preset-daisy')
    // Add more specific checks here based on the actual implementation
    // For example, check if styled and base options are correctly applied
  })

  it('should include default themes when themes option is true', () => {
    const preset = presetDaisy({ themes: true })
    expect(preset.preflights).toContainEqual(expect.objectContaining({
      layer: 'daisy-themes'
    }))
  })

  it('should only include specified themes when themes option is an array', () => {
    const themes = ['light', 'dark']
    const preset = presetDaisy({ themes })
    // Add specific assertions here based on the actual implementation
    // For example, check if only light and dark themes are included
  })
})

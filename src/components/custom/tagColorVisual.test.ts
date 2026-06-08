import { describe, expect, it } from 'vitest';
import {
  getContrastRatio,
  getTagColorBorderStyle,
  needsTagColorOutline,
  resolveTagVisualColor,
} from './tagColorVisual';
import { colors } from '../../styles/tokens/colors';

describe('tagColorVisual', () => {
  it('RN-CT-10: resolve tokens e cores hexadecimais para cor visual', () => {
    expect(resolveTagVisualColor('support')).toBe(colors.support.main);
    expect(resolveTagVisualColor('#fff')).toBe('#ffffff');
  });

  it('RN-CT-10: identifica cores claras que precisam de contorno em fundo branco', () => {
    expect(needsTagColorOutline(colors.surface.xxxl)).toBe(true);
    expect(needsTagColorOutline(colors.surface.xl)).toBe(true);
    expect(getTagColorBorderStyle(colors.surface.xxxl).border).toBe(`1px solid ${colors.surface.dark}`);
  });

  it('RN-CT-10: não aplica contorno em cores com contraste suficiente contra fundo branco', () => {
    expect(needsTagColorOutline(colors.error.main)).toBe(false);
    expect(needsTagColorOutline(colors.primary.main)).toBe(false);
    expect(getContrastRatio(colors.primary.main, colors.surface.xxxl)).toBeGreaterThan(2);
  });
});

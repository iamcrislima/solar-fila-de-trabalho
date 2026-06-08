import type { CSSProperties } from 'react';
import { colors } from '../../styles/tokens/colors';

const COLOR_MAP = {
  support: colors.support.main,
  error:   colors.error.main,
  warning: colors.warning.main,
  success: colors.success.main,
  surface: colors.surface.main,
  primary: colors.primary.main,
};

const MIN_VISIBLE_CONTRAST_ON_LIGHT = 2;

function expandShortHex(hex: string) {
  return hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;
}

function parseHexColor(hex: string) {
  const normalized = expandShortHex(hex.trim());
  const match = /^#([0-9a-f]{6})$/i.exec(normalized);
  if (!match) return null;

  const value = match[1];
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function toLinearChannel(channel: number) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function getRelativeLuminance(hex: string) {
  const rgb = parseHexColor(hex);
  if (!rgb) return null;

  return (
    0.2126 * toLinearChannel(rgb.r) +
    0.7152 * toLinearChannel(rgb.g) +
    0.0722 * toLinearChannel(rgb.b)
  );
}

export function resolveTagVisualColor(colorKey?: string) {
  if (!colorKey) return colors.surface.main;
  if (colorKey.startsWith('#')) return expandShortHex(colorKey);
  return COLOR_MAP[colorKey as keyof typeof COLOR_MAP] ?? colors.surface.main;
}

export function getContrastRatio(colorA: string, colorB: string) {
  const luminanceA = getRelativeLuminance(resolveTagVisualColor(colorA));
  const luminanceB = getRelativeLuminance(resolveTagVisualColor(colorB));
  if (luminanceA === null || luminanceB === null) return Number.POSITIVE_INFINITY;

  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function needsTagColorOutline(colorKey?: string) {
  return getContrastRatio(resolveTagVisualColor(colorKey), colors.surface.xxxl) < MIN_VISIBLE_CONTRAST_ON_LIGHT;
}

export function getTagColorBorderStyle(colorKey?: string): CSSProperties {
  return {
    border: `${needsTagColorOutline(colorKey) ? 1 : 0}px solid ${colors.surface.dark}`,
  };
}

export function getTagIconOutlineStyle(colorKey?: string): CSSProperties {
  return needsTagColorOutline(colorKey)
    ? {
        stroke: colors.surface.dark,
        strokeWidth: 1.5,
        paintOrder: 'stroke fill',
      }
    : {};
}

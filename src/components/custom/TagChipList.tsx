import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import ReactDOM from 'react-dom';
import { colors } from '../../styles/tokens/colors';
import { borders } from '../../styles/tokens/borders';
import { spacing } from '../../styles/tokens/spacing';
import { typography } from '../../styles/tokens/typography';
import { shadows } from '../../styles/tokens/shadows';
import { TagChip } from './TagChip';
import { TagListItem } from './TagListItem';
import { Tooltip } from '../ds/atoms/Tooltip/Tooltip';

type TagChipItem = string | Record<string, unknown>;

interface TagChipListProps {
  chips?: unknown[];
  compact?: boolean;
  maxCompactVisible?: number;
  overflowDisclosure?: 'tooltip' | 'popover';
  overflowVariant?: 'compact' | 'full';
}

const DEFAULT_MAX_COMPACT_VISIBLE = Number.MAX_SAFE_INTEGER;
const COMPACT_CHIP_SIZE = 18;
const COMPACT_GAP = 4;
const MORE_CHIP_MIN_WIDTH = 18;
const DROPDOWN_VIEWPORT_MARGIN = 12;
const DROPDOWN_MAX_WIDTH = 520;

function getChipLabel(chip: TagChipItem) {
  return typeof chip === 'string' ? chip : String(chip.label ?? '');
}

function getChipColor(chip: TagChipItem) {
  return typeof chip === 'string' ? 'success' : String(chip.color ?? 'success');
}

function getMoreChipWidth(hiddenCount: number) {
  return hiddenCount > 9 ? 26 : MORE_CHIP_MIN_WIDTH;
}

function getInlineItemsWidth(itemWidths: number[]) {
  if (itemWidths.length === 0) return 0;
  return itemWidths.reduce((total, width) => total + width, 0) + (itemWidths.length - 1) * COMPACT_GAP;
}

function getCompactVisibleCount(totalChips: number, availableWidth: number, maxCompactVisible: number) {
  const cappedTotal = Math.min(totalChips, maxCompactVisible);
  const allVisibleWidth = getInlineItemsWidth(Array.from({ length: cappedTotal }, () => COMPACT_CHIP_SIZE));

  if (totalChips <= maxCompactVisible && allVisibleWidth <= availableWidth) {
    return totalChips;
  }

  for (let visibleCount = Math.min(totalChips - 1, maxCompactVisible); visibleCount >= 0; visibleCount -= 1) {
    const hiddenCount = totalChips - visibleCount;
    const compactWidths = Array.from({ length: visibleCount }, () => COMPACT_CHIP_SIZE);
    const totalWidth = getInlineItemsWidth([...compactWidths, getMoreChipWidth(hiddenCount)]);

    if (totalWidth <= availableWidth) {
      return visibleCount;
    }
  }

  return 0;
}

function getFullVisibleCount(itemWidths: number[], availableWidth: number) {
  const allVisibleWidth = getInlineItemsWidth(itemWidths);

  if (allVisibleWidth <= availableWidth) {
    return itemWidths.length;
  }

  for (let visibleCount = itemWidths.length - 1; visibleCount >= 0; visibleCount -= 1) {
    const hiddenCount = itemWidths.length - visibleCount;
    const totalWidth = getInlineItemsWidth([
      ...itemWidths.slice(0, visibleCount),
      getMoreChipWidth(hiddenCount),
    ]);

    if (totalWidth <= availableWidth) {
      return visibleCount;
    }
  }

  return 0;
}

function getPopoverPosition(anchor: HTMLElement) {
  const rect = anchor.getBoundingClientRect();

  return {
    top: Math.min(rect.bottom + 4, window.innerHeight - DROPDOWN_VIEWPORT_MARGIN),
    left: Math.min(
      Math.max(rect.left, DROPDOWN_VIEWPORT_MARGIN),
      Math.max(DROPDOWN_VIEWPORT_MARGIN, window.innerWidth - DROPDOWN_VIEWPORT_MARGIN)
    ),
  };
}

function HiddenTagItem({ chip }: { chip: TagChipItem }) {
  const label = getChipLabel(chip);
  const color = getChipColor(chip);
  const iconKey = typeof chip === 'object' && chip.iconKey ? String(chip.iconKey) : undefined;

  return <TagListItem label={label} color={color} iconKey={iconKey} />;
}

function MoreTagsChip({
  hiddenChips,
  disclosure,
}: {
  hiddenChips: TagChipItem[];
  disclosure: 'tooltip' | 'popover';
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);
  const hiddenLabels = hiddenChips.map(getChipLabel).filter(Boolean).join(', ');
  const resolvedPopoverPosition = popoverOpen && ref.current
    ? popoverPosition ?? getPopoverPosition(ref.current)
    : null;
  const isPopover = disclosure === 'popover';

  useLayoutEffect(() => {
    if (!popoverOpen || !ref.current) {
      setPopoverPosition(null);
      return undefined;
    }

    const updatePopoverPosition = () => {
      if (!ref.current) return;
      const anchorPosition = getPopoverPosition(ref.current);
      const popoverWidth = popoverRef.current?.offsetWidth ?? 0;
      const maxLeft = popoverWidth > 0
        ? window.innerWidth - popoverWidth - DROPDOWN_VIEWPORT_MARGIN
        : window.innerWidth - DROPDOWN_VIEWPORT_MARGIN;

      setPopoverPosition({
        top: anchorPosition.top,
        left: Math.min(
          Math.max(anchorPosition.left, DROPDOWN_VIEWPORT_MARGIN),
          Math.max(DROPDOWN_VIEWPORT_MARGIN, maxLeft)
        ),
      });
    };

    updatePopoverPosition();
    window.addEventListener('resize', updatePopoverPosition);
    return () => window.removeEventListener('resize', updatePopoverPosition);
  }, [popoverOpen, hiddenChips]);

  useEffect(() => {
    if (!popoverOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (ref.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setPopoverOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPopoverOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [popoverOpen]);

  const handleClick = () => {
    if (isPopover) setPopoverOpen((current) => !current);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
    if (!isPopover) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setPopoverOpen((current) => !current);
    }
  };

  const chipSpan = (
    <span
      ref={ref}
      aria-label={`${hiddenChips.length} tags adicionais`}
      aria-haspopup={isPopover ? 'menu' : undefined}
      aria-expanded={isPopover ? popoverOpen : undefined}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
          ...typography.styles.captionBold,
          minWidth: 18,
          height: 18,
          padding: `0 ${spacing.xxs}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: borders.radius.pill,
          backgroundColor: colors.surface.light,
          color: colors.surface.dark,
          boxSizing: 'border-box',
          flexShrink: 0,
          cursor: isPopover ? 'pointer' : 'default',
          outline: 'none',
        }}
      >
        +{hiddenChips.length}
      </span>
  );

  return (
    <>
      {isPopover ? chipSpan : <Tooltip content={hiddenLabels}>{chipSpan}</Tooltip>}

      {isPopover && resolvedPopoverPosition && ReactDOM.createPortal(
        <div
          ref={popoverRef}
          role="menu"
          style={{
            position: 'fixed',
            top: resolvedPopoverPosition.top,
            left: resolvedPopoverPosition.left,
            width: 'max-content',
            minWidth: 0,
            maxWidth: `min(${DROPDOWN_MAX_WIDTH}px, calc(100vw - ${DROPDOWN_VIEWPORT_MARGIN * 2}px))`,
            maxHeight: 'min(320px, calc(100vh - 24px))',
            overflowY: 'auto',
            zIndex: 10000,
            backgroundColor: colors.surface.xxxl,
            border: `1px solid ${colors.surface.light}`,
            boxShadow: shadows.level2,
            boxSizing: 'border-box',
          }}
        >
          {hiddenChips.map((chip, index) => (
            <HiddenTagItem key={index} chip={chip} />
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

export function TagChipList({
  chips = [],
  compact = false,
  maxCompactVisible = DEFAULT_MAX_COMPACT_VISIBLE,
  overflowDisclosure = 'tooltip',
  overflowVariant = 'compact',
}: TagChipListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [availableWidth, setAvailableWidth] = useState(0);
  const [fullChipWidths, setFullChipWidths] = useState<number[]>([]);
  const normalizedChips = useMemo(
    () => chips.filter(Boolean) as TagChipItem[],
    [chips]
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const updateOverflow = () => {
      const availableWidth = container.clientWidth;
      const fullWidth = measure.scrollWidth;
      const chipWidths = Array.from(measure.children).map((child) => {
        const element = child as HTMLElement;
        return element.getBoundingClientRect().width || element.scrollWidth;
      });
      setAvailableWidth(availableWidth);
      setFullChipWidths(chipWidths);
      setIsOverflowing(fullWidth > availableWidth + 1);
    };

    updateOverflow();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateOverflow);
      return () => window.removeEventListener('resize', updateOverflow);
    }

    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(container);
    resizeObserver.observe(measure);

    return () => resizeObserver.disconnect();
  }, [normalizedChips]);

  if (normalizedChips.length === 0) return null;

  const shouldUseFullOverflow = !compact && overflowVariant === 'full' && isOverflowing;
  const fullVisibleCount = shouldUseFullOverflow && fullChipWidths.length === normalizedChips.length
    ? getFullVisibleCount(fullChipWidths, availableWidth)
    : normalizedChips.length;
  const visibleFullChips = normalizedChips.slice(0, fullVisibleCount);
  const hiddenFullChips = normalizedChips.slice(fullVisibleCount);
  const shouldCompact = compact || (isOverflowing && overflowVariant === 'compact');
  const compactVisibleCount = shouldCompact
    ? getCompactVisibleCount(normalizedChips.length, availableWidth, maxCompactVisible)
    : normalizedChips.length;
  const visibleCompactChips = normalizedChips.slice(0, compactVisibleCount);
  const hiddenCompactChips = normalizedChips.slice(compactVisibleCount);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        gap: spacing.xxs,
        maxWidth: '100%',
        minWidth: 0,
        overflow: 'hidden',
        flexWrap: 'nowrap',
      }}
    >
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'row',
          gap: spacing.xxs,
          flexWrap: 'nowrap',
          width: 'max-content',
        }}
      >
        {normalizedChips.map((chip, index) => (
          <TagChip key={`measure-${index}`} chip={chip} />
        ))}
      </div>

      {shouldUseFullOverflow ? (
        <>
          {visibleFullChips.map((chip, index) => (
            <TagChip key={index} chip={chip} />
          ))}
          {hiddenFullChips.length > 0 && (
            <MoreTagsChip hiddenChips={hiddenFullChips} disclosure={overflowDisclosure} />
          )}
        </>
      ) : shouldCompact ? (
        <>
          {visibleCompactChips.map((chip, index) => (
            <TagChip key={index} chip={chip} variant="compact" />
          ))}
          {hiddenCompactChips.length > 0 && (
            <MoreTagsChip hiddenChips={hiddenCompactChips} disclosure={overflowDisclosure} />
          )}
        </>
      ) : (
        normalizedChips.map((chip, index) => (
          <TagChip key={index} chip={chip} />
        ))
      )}
    </div>
  );
}

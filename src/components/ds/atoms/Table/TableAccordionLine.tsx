import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon       from '@mui/icons-material/Edit';
import { Checkbox }  from '../Checkbox';
import { Chip }      from '../Chip';
import { InputRead } from '../InputRead';
import { colors }    from '../../../../styles/tokens/colors';
import { shadows }   from '../../../../styles/tokens/shadows';

// TableAccordionLine — Figma node: 723:166299 (Accordion Line Grid)
// White card with shadow, expand/collapse toggle, status Chip, and action buttons.
// Expanded content is passed via `children`.
//
// headerFields: [{ label, value }] — rendered as InputRead atoms in the header row.
// children — arbitrary content shown when collapsed=false (expanded rows).

const ICON_BTN = { border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex' };

export function TableAccordionLine({
  collapsed     = false,
  onToggle,
  checked       = false,
  onCheckChange,
  statusLabel,
  statusScheme  = 'success',
  onView,
  onEdit,
  headerFields  = [],
  children,
  style,
}: { collapsed?: boolean; onToggle?: () => void; checked?: boolean; onCheckChange?: React.ChangeEventHandler<HTMLInputElement>; statusLabel?: string; statusScheme?: string; onView?: () => void; onEdit?: () => void; headerFields?: Array<{ label?: string; value?: string }>; children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        backgroundColor: colors.surface.xxxl,
        boxShadow:       shadows.level1,
        borderRadius:    8,
        maxWidth:        1024,
        minWidth:        634,
        paddingLeft:     8,
        paddingRight:    16,
        paddingBottom:   collapsed ? 0 : 2,
        boxSizing:       'border-box',
        ...style,
      }}
    >
      {/* Header row — always visible */}
      <div
        style={{
          display:     'flex',
          alignItems:  'flex-start',
          justifyContent: 'center',
          paddingTop:    8,
          paddingBottom: collapsed ? 8 : 0,
          width:        '100%',
        }}
      >
        {/* Left: checkbox + header fields */}
        <div style={{ display: 'flex', flex: 1, gap: 16, alignItems: 'flex-start', minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
            <Checkbox checked={checked} onChange={onCheckChange} />
          </div>
          {headerFields.map((f, i) => (
            <InputRead key={i} label={f.label} value={f.value} />
          ))}
        </div>

        {/* Right: status chip + actions + accordion toggle */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0 }}>
          {statusLabel && (
            <Chip color={statusScheme as Parameters<typeof Chip>[0]["color"]} size="sm">
              {statusLabel}
            </Chip>
          )}
          {onView && (
            <button onClick={onView} style={ICON_BTN}>
              <VisibilityIcon style={{ fontSize: 24, color: colors.surface.main }} />
            </button>
          )}
          {onEdit && (
            <button onClick={onEdit} style={ICON_BTN}>
              <EditIcon style={{ fontSize: 24, color: colors.surface.main }} />
            </button>
          )}
          <button
            onClick={onToggle}
            style={{
              ...ICON_BTN,
              backgroundColor: colors.surface.xl,
              borderRadius:    '50%',
              width:           32,
              height:          32,
              alignItems:      'center',
              justifyContent:  'center',
            }}
          >
            {collapsed
              ? <ExpandMoreIcon style={{ fontSize: 24, color: colors.surface.main }} />
              : <ExpandLessIcon style={{ fontSize: 24, color: colors.surface.main }} />}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {!collapsed && children && (
        <div style={{ paddingBottom: 8 }}>
          {children}
        </div>
      )}
    </div>
  );
}

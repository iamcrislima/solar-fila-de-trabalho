
import CheckCircleIcon    from '@mui/icons-material/CheckCircle';
import VisibilityIcon     from '@mui/icons-material/Visibility';
import EditIcon           from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ExpandMoreIcon     from '@mui/icons-material/ExpandMore';
import ArrowDropDownIcon  from '@mui/icons-material/ArrowDropDown';
import { TableHeaderCell } from './TableHeaderCell';
import { Checkbox }        from '../Checkbox';
import { Chip }            from '../Chip';
import { colors }          from '../../../../styles/tokens/colors';

// TableColumn — Figma node: 580:75252 (column grid)
// Flex-column layout: header + stacked body cells. Place side-by-side to build grids.
//
// type: 'default' | 'accordion' | 'checkbox' | 'money' | 'input'
//       'status' | 'statusChip' | 'icon1' | 'icon2' | 'icon3'

const CELL: React.CSSProperties = {
  display:       'flex',
  alignItems:    'center',
  minHeight:     40,
  paddingLeft:   8,
  paddingRight:  8,
  backgroundColor: colors.surface.xxxl,
  borderBottom:  `1px solid ${colors.surface.light}`,
  boxSizing:     'border-box',
};

const TEXT = {
  fontFamily: "'Open Sans', sans-serif",
  fontSize:   14,
  fontWeight: 400,
  color:      colors.surface.main,
};

const ICON_BTN = {
  border:     'none',
  background: 'transparent',
  cursor:     'pointer',
  padding:    0,
  display:    'flex',
  alignItems: 'center',
};

function IconBtn({ onClick, children }: { onClick?: () => void; children?: React.ReactNode }) {
  return <button onClick={onClick} style={ICON_BTN}>{children}</button>;
}

function CellContent({ type, row, rowIndex, onToggle, onSelect, onView, onEdit, onDelete }: { type?: string; row?: unknown; rowIndex?: number; onToggle?: (i: number, r: unknown) => void; onSelect?: (i: number, checked: boolean) => void; onView?: (i?: number, r?: unknown) => void; onEdit?: (i?: number, r?: unknown) => void; onDelete?: (i?: number, r?: unknown) => void }) {
  if (type === 'accordion') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <IconBtn onClick={() => onToggle?.(rowIndex ?? 0, row)}>
          <ExpandMoreIcon style={{ fontSize: 24, color: colors.surface.main }} />
        </IconBtn>
        <span style={TEXT}>{(row as React.ReactNode) ?? 'Content'}</span>
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox
          type="surface"
          checked={(row as Record<string, unknown>)?.checked as boolean ?? false}
          onChange={e => onSelect?.(rowIndex ?? 0, e.target.checked)}
        />
        <span style={TEXT}>{(row as Record<string, unknown>)?.label as React.ReactNode ?? row as React.ReactNode ?? 'Content'}</span>
      </div>
    );
  }

  if (type === 'money') {
    return (
      <span style={{ ...TEXT, width: '100%', textAlign: 'right' }}>
        {(row as React.ReactNode) ?? '0.00'}
      </span>
    );
  }

  if (type === 'input') {
    return (
      <div style={{
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'space-between',
        border:       `1px solid ${colors.surface.medium}`,
        borderRadius: 4,
        paddingLeft:  12,
        paddingRight: 6,
        height:       32,
        width:        '100%',
        boxSizing:    'border-box' as const,
        cursor:       'pointer',
      }}>
        <span style={{ ...TEXT, fontSize: 16, opacity: 0.4 }}>Select</span>
        <ArrowDropDownIcon style={{ fontSize: 20, color: colors.surface.main, opacity: 0.4 }} />
      </div>
    );
  }

  if (type === 'status') {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <CheckCircleIcon style={{ fontSize: 24, color: colors.success.main }} />
      </div>
    );
  }

  if (type === 'statusChip') {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Chip color="success" size="sm">{(row as React.ReactNode) ?? 'Checked'}</Chip>
      </div>
    );
  }

  if (type === 'icon1') {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <IconBtn onClick={() => onView?.(rowIndex, row)}>
          <VisibilityIcon style={{ fontSize: 24, color: colors.surface.main }} />
        </IconBtn>
      </div>
    );
  }

  if (type === 'icon2') {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 4 }}>
        <IconBtn onClick={() => onView?.(rowIndex, row)}>
          <VisibilityIcon style={{ fontSize: 24, color: colors.surface.main }} />
        </IconBtn>
        <IconBtn onClick={() => onEdit?.(rowIndex, row)}>
          <EditIcon style={{ fontSize: 24, color: colors.surface.main }} />
        </IconBtn>
      </div>
    );
  }

  if (type === 'icon3') {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 4 }}>
        <IconBtn onClick={() => onView?.(rowIndex, row)}>
          <VisibilityIcon style={{ fontSize: 24, color: colors.surface.main }} />
        </IconBtn>
        <IconBtn onClick={() => onEdit?.(rowIndex, row)}>
          <EditIcon style={{ fontSize: 24, color: colors.surface.main }} />
        </IconBtn>
        <IconBtn onClick={() => onDelete?.(rowIndex, row)}>
          <DeleteOutlinedIcon style={{ fontSize: 24, color: colors.surface.main }} />
        </IconBtn>
      </div>
    );
  }

  // default
  return <span style={TEXT}>{(row as React.ReactNode) ?? 'Content'}</span>;
}

export function TableColumn({
  type       = 'default',
  label      = 'Label',
  rows       = [] as unknown[],
  theme      = 'default',
  showR      = false,
  sortable   = false,
  sortDir    = 'none',
  onSort,
  width,
  onToggle,
  onSelect,
  onView,
  onEdit,
  onDelete,
  style,
}: { type?: string; label?: string; rows?: unknown[]; theme?: string; showR?: boolean; sortable?: boolean; sortDir?: string; onSort?: () => void; width?: number; onToggle?: (i: number, r: unknown) => void; onSelect?: (i: number, checked: boolean) => void; onView?: (i?: number, r?: unknown) => void; onEdit?: (i?: number, r?: unknown) => void; onDelete?: (i?: number, r?: unknown) => void; style?: React.CSSProperties }) {
  const headerAlign = type === 'money' ? 'right'
    : (type === 'status' || type === 'statusChip' || type === 'icon1' || type === 'icon2' || type === 'icon3') ? 'center'
    : 'left';

  const headerLabel = type === 'money'
    ? label
    : (type === 'status' || type === 'statusChip') ? 'Status'
    : (type === 'icon1' || type === 'icon2' || type === 'icon3') ? 'Action'
    : label;

  const headerShowR = type === 'money' ? true : showR;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width, ...style }}>
      <TableHeaderCell
        label={headerLabel}
        theme={theme}
        showR={headerShowR}
        sortable={sortable}
        sortDir={sortDir}
        onSort={onSort}
        align={headerAlign}
      />
      {rows.map((row, i) => (
        <div key={i} style={CELL}>
          <CellContent
            type={type}
            row={row}
            rowIndex={i}
            onToggle={onToggle}
            onSelect={onSelect}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

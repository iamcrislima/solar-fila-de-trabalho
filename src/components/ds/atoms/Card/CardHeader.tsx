import type { CSSProperties } from 'react';
import InfoOutlinedIcon     from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon       from '@mui/icons-material/ExpandMore';
import ExpandLessIcon       from '@mui/icons-material/ExpandLess';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import FileDownloadIcon     from '@mui/icons-material/FileDownload';
import FileUploadIcon       from '@mui/icons-material/FileUpload';
import MoreVertIcon         from '@mui/icons-material/MoreVert';
import { Chip }      from '../Chip';
import { Checkbox }  from '../Checkbox';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

// CardHeader — Figma node: 512:1461

interface CardHeaderProps {
  title?: string;
  showTooltip?: boolean;
  showCheckbox?: boolean;
  checked?: boolean;
  onCheckChange?: () => void;
  chip?: { label: string; scheme?: string };
  primaryAction?: { label: string; onClick: () => void };
  showDownload?: boolean;
  showUpload?: boolean;
  showMore?: boolean;
  showAccordion?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  style?: CSSProperties;
}

export function CardHeader({ title = 'Card', showTooltip = false, showCheckbox = false, checked = false, onCheckChange, chip, primaryAction, showDownload = false, showUpload = false, showMore = false, showAccordion = false, collapsed = false, onToggle, style }: CardHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0, paddingBottom: 12 }}>
        {showCheckbox && <Checkbox checked={checked} onChange={onCheckChange} style={{ flexShrink: 0 }} />}
        <span style={{ ...typography.styles.subtitle1, color: colors.surface.dark, whiteSpace: 'nowrap' }}>{title}</span>
        {showTooltip && <InfoOutlinedIcon style={{ fontSize: 24, color: colors.surface.medium, flexShrink: 0 }} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {chip && <Chip color={(chip.scheme as Parameters<typeof Chip>[0]['color']) ?? 'warning'}>{chip.label}</Chip>}
        {primaryAction && (
          <button onClick={primaryAction.onClick} style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 4 }}>
            <span style={{ ...typography.styles.subtitle2, color: colors.primary.main, padding: '3px 8px 4px' }}>{primaryAction.label}</span>
            <AddCircleOutlineIcon style={{ fontSize: 24, color: colors.primary.main }} />
          </button>
        )}
        {showDownload && <FileDownloadIcon style={{ fontSize: 24, color: colors.surface.main, cursor: 'pointer' }} />}
        {showUpload && <FileUploadIcon style={{ fontSize: 24, color: colors.surface.main, cursor: 'pointer' }} />}
        {showMore && <MoreVertIcon style={{ fontSize: 24, color: colors.surface.main, cursor: 'pointer' }} />}
        {showAccordion && (
          <button onClick={onToggle} style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: colors.surface.xl, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {collapsed ? <ExpandMoreIcon style={{ fontSize: 24, color: colors.surface.main }} /> : <ExpandLessIcon style={{ fontSize: 24, color: colors.surface.main }} />}
          </button>
        )}
      </div>
    </div>
  );
}

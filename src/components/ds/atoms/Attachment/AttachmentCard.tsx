
import AttachFileIcon    from '@mui/icons-material/AttachFile';
import ChevronLeftIcon   from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon  from '@mui/icons-material/ChevronRight';
import VisibilityIcon    from '@mui/icons-material/Visibility';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ExpandMoreIcon    from '@mui/icons-material/ExpandMore';
import ExpandLessIcon    from '@mui/icons-material/ExpandLess';
import { Chip }          from '../Chip';
import { colors }        from '../../../../styles/tokens/colors';
import { shadows }       from '../../../../styles/tokens/shadows';
import { typography }    from '../../../../styles/tokens/typography';

// AttachmentCard — Figma node: 48:10019
// Card de anexo de arquivo com thumbnail + nav de páginas + dados + ações.
// size: 'lg' (1024px, bg white) | 'sm' (504px, bg #FAFAFA)
// Expanded mostra children; collapsed mostra só o header.
// image: string (src) | ReactNode | null — slot para preview do arquivo.
// statusScheme: 'warning' | 'success' | 'surface' | 'error' — usa o Chip atom interno.
// Visibility icon é exibido apenas no tamanho 'lg'.

function ImagePreview({ image, fileName }: { image?: string; fileName?: string }) {
  return (
    <div
      style={{
        width:           114,
        height:          80,
        borderRadius:    8,
        backgroundColor: colors.surface.light,
        overflow:        'hidden',
        flexShrink:      0,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
      }}
    >
      {image && typeof image === 'string' ? (
        <img
          src={image}
          alt={fileName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : image ? (
        image
      ) : null}
    </div>
  );
}

function NavControls({ page, totalPages, onPrevPage, onNextPage }: { page?: number; totalPages?: number; onPrevPage?: () => void; onNextPage?: () => void }) {
  const navBtn = (onClick: (() => void) | undefined, disabled: boolean, Icon: React.ElementType) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border:     'none',
        background: 'transparent',
        cursor:     disabled ? 'default' : 'pointer',
        padding:    0,
        display:    'flex',
        alignItems: 'center',
        opacity:    disabled ? 0.4 : 1,
      }}
    >
      <Icon style={{ fontSize: 24, color: colors.surface.main }} />
    </button>
  );

  return (
    <div
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            10,
        padding:        '8px 16px',
      }}
    >
      {navBtn(onPrevPage, (page ?? 1) <= 1, ChevronLeftIcon)}
      <span
        style={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize:   12,
          fontWeight: 400,
          color:      colors.surface.main,
          whiteSpace: 'nowrap',
        }}
      >
        {page ?? 1}
      </span>
      {navBtn(onNextPage, (page ?? 1) >= (totalPages ?? 1), ChevronRightIcon)}
    </div>
  );
}

export function AttachmentCard({
  image,
  fileName      = 'File.pdf',
  fileDate      = '',
  status        = '',
  statusScheme  = 'warning',
  size          = 'lg',
  expanded   = false,
  onToggle,
  onView,
  onDelete,
  page       = 1,
  totalPages = 1,
  onPrevPage,
  onNextPage,
  children,
  style,
}: { image?: string; fileName?: string; fileDate?: string; status?: string; statusScheme?: string; size?: string; expanded?: boolean; onToggle?: () => void; onView?: () => void; onDelete?: () => void; page?: number; totalPages?: number; onPrevPage?: () => void; onNextPage?: () => void; children?: React.ReactNode; style?: React.CSSProperties }) {
  const isLg = size === 'lg';

  return (
    <div
      style={{
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'flex-start',
        width:           isLg ? 1024 : 504,
        minWidth:        504,
        padding:         16,
        borderRadius:    8,
        backgroundColor: isLg ? colors.surface.xxxl : colors.surface.xxl,
        boxShadow:       shadows.level1,
        boxSizing:       'border-box',
        ...style,
      }}
    >
      {/* ── Header row ── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          width:          '100%',
        }}
      >
        {/* Left: paperclip + image nav + title/date */}
        <div
          style={{
            display:    'flex',
            alignItems: 'flex-start',
            gap:        4,
            flex:       1,
            minWidth:   0,
            padding:    '6px 0',
          }}
        >
          <AttachFileIcon
            style={{ fontSize: 40, color: colors.surface.main, flexShrink: 0 }}
          />

          {/* Image + nav stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <ImagePreview image={image} fileName={fileName} />
            <NavControls
              page={page ?? 1}
              totalPages={totalPages}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
            />
          </div>

          {/* Filename + date */}
          <div
            style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           2,
              justifyContent:'center',
              paddingLeft:   8,
              flexShrink:    0,
            }}
          >
            <span
              style={{
                ...typography.styles.title2,
                color:     colors.surface.dark,
                whiteSpace: 'nowrap',
              }}
            >
              {fileName}
            </span>
            {fileDate && (
              <span
                style={{
                  ...typography.styles.body1,
                  color:     colors.surface.dark,
                  lineHeight: '22px',
                  whiteSpace: 'nowrap',
                }}
              >
                {fileDate}
              </span>
            )}
          </div>
        </div>

        {/* Right: chip + actions */}
        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        8,
            flexShrink: 0,
          }}
        >
          {/* Status chip — usa o Chip atom */}
          {status && (
            <Chip color={statusScheme as "primary" | "warning" | "success" | "surface" | "error" | "support"} size="md">
              {status}
            </Chip>
          )}

          {/* Visibility — LG only */}
          {isLg && onView && (
            <button
              onClick={onView}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex' }}
            >
              <VisibilityIcon style={{ fontSize: 24, color: colors.surface.main }} />
            </button>
          )}

          {/* Delete */}
          {onDelete && (
            <button
              onClick={onDelete}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex' }}
            >
              <DeleteOutlinedIcon style={{ fontSize: 24, color: colors.surface.main }} />
            </button>
          )}

          {/* Expand / Collapse */}
          <button
            onClick={onToggle}
            style={{
              border:          'none',
              background:      colors.surface.xl,
              cursor:          'pointer',
              padding:         0,
              borderRadius:    '50%',
              width:           32,
              height:          32,
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              flexShrink:      0,
            }}
          >
            {expanded
              ? <ExpandLessIcon style={{ fontSize: 32, color: colors.surface.main }} />
              : <ExpandMoreIcon style={{ fontSize: 32, color: colors.surface.main }} />}
          </button>
        </div>
      </div>

      {/* ── Expanded content ── */}
      {expanded && children && (
        <div style={{ width: '100%', paddingTop: 8 }}>
          {children}
        </div>
      )}
    </div>
  );
}

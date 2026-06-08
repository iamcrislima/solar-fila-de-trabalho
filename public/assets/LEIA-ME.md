# Assets estáticos — SolarBPM

Salve aqui os logos que atualmente estão como URLs temporárias do Figma no código.

## Arquivos necessários

| Arquivo | Uso no código | Origem |
|---|---|---|
| `logo-solar-icon.png` | Ícone do SolarBPM (48×48px) | Exportar do Figma: nó do ícone SolarBPM |
| `logo-solar-text.png` | Texto "SolarBPM" (120×24px) | Exportar do Figma: nó do logotipo texto |
| `logo-softplan.png` | Logo Softplan rodapé (105×32px) | Exportar do Figma: nó Softplan Setor Público |

## Como migrar

1. Exporte cada imagem pelo Figma (botão direito → Export → PNG 2×)
2. Salve nesta pasta com os nomes acima
3. Em `FilaDeTrabalho.jsx`, substitua as constantes:

```js
// Antes (URLs temporárias — expiram em 7 dias)
const LOGO_ICON     = 'https://www.figma.com/api/mcp/asset/...';
const LOGO_TEXT     = 'https://www.figma.com/api/mcp/asset/...';
const SOFTPLAN_LOGO = 'https://www.figma.com/api/mcp/asset/...';

// Depois (arquivos estáticos — permanentes)
const LOGO_ICON     = '/assets/logo-solar-icon.png';
const LOGO_TEXT     = '/assets/logo-solar-text.png';
const SOFTPLAN_LOGO = '/assets/logo-softplan.png';
```

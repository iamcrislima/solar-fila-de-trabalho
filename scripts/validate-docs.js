/**
 * Valida que todos os links locais dentro dos arquivos de documentação
 * apontam para arquivos que realmente existem.
 *
 * Executar: node scripts/validate-docs.js
 * Falha com exit 1 se houver qualquer link quebrado.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Todos os arquivos de documentação que devem existir e cujos links devem ser validados.
// Adicionar aqui quando um novo doc for criado.
const DOC_FILES = [
  'docs/orientacoes.md',
  'docs/learnings.md',
  'docs/architecture/project-structure.md',
  'docs/architecture/data-flow.md',
  'docs/evolucao/plano.md',
  'docs/evolucao/fase-2-services.md',
  'docs/evolucao/fase-2-react-query.md',
  'docs/evolucao/fase-3-react-router.md',
  'docs/padroes/checklist.md',
  'docs/padroes/storybook.md',
  'docs/padroes/testes.md',
  'docs/padroes/regras-de-negocio.md',
  'docs/padroes/design-system.md',
  'docs/padroes/ux-responsividade.md',
  'docs/padroes/componentes-e-telas.md',
  'src/modules/fila-trabalho/docs/mapa-funcional.md',
  'src/modules/fila-trabalho/docs/regras-fila-trabalho.md',
];

// Extrai todos os links markdown [texto](href) de um conteúdo,
// ignorando URLs externas e âncoras puras.
function extractLocalLinks(content) {
  const links = [];
  const regex = /\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const raw = match[2];
    const href = raw.split('#')[0].trim(); // remove âncora e espaços
    if (!href) continue; // link só com âncora, ex: [texto](#secao)
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) continue;
    links.push({ text: match[1], href });
  }
  return links;
}

let errors = 0;
let linksChecked = 0;
let missingDocs = 0;

for (const docFile of DOC_FILES) {
  const absPath = join(ROOT, docFile);

  if (!existsSync(absPath)) {
    console.error(`❌ Arquivo de doc ausente: ${docFile}`);
    missingDocs++;
    errors++;
    continue;
  }

  const content = readFileSync(absPath, 'utf8');
  const links = extractLocalLinks(content);
  const fileDir = dirname(absPath);

  for (const { text, href } of links) {
    const resolved = resolve(fileDir, href);
    linksChecked++;
    if (!existsSync(resolved)) {
      console.error(`❌ Link quebrado em ${docFile}`);
      console.error(`   [${text}](${href})`);
      console.error(`   → Resolvido: ${resolved}`);
      errors++;
    }
  }
}

if (errors === 0) {
  console.log(`✅ validate-docs: ${linksChecked} link(s) verificado(s) em ${DOC_FILES.length} arquivo(s) — nenhum problema encontrado.`);
} else {
  const docMsg = missingDocs > 0 ? ` (${missingDocs} arquivo(s) ausente(s))` : '';
  console.error(`\n⛔ ${errors} problema(s) encontrado(s)${docMsg}. Corrija antes de fazer merge.`);
  process.exit(1);
}

import React, { useState, useCallback, Suspense } from 'react';
import type { ReactNode } from 'react';

import { AppShell }          from '@/shell/AppShell';
import { FavoritesProvider } from '@/application/providers/FavoritesProvider';

import { FavSidebar }   from '@/modules/fav/FavSidebar';
import { BuscaSidebar } from '@/modules/busca/BuscaSidebar';
import { SolarSidebar } from '@/modules/solar/SolarSidebar';
import { WflowSidebar } from '@/modules/wflow/WflowSidebar';
import { EcmSidebar }   from '@/modules/ecm/EcmSidebar';
import { CesSidebar }   from '@/modules/ces/CesSidebar';
import { BpmSidebar }   from '@/modules/bpm/BpmSidebar';
import { OrgSidebar }   from '@/modules/org/OrgSidebar';
import { SegSidebar }   from '@/modules/seg/SegSidebar';

const FEATURE_IDS = {
  filaTrabalho: 'fila.trabalho',
} as const;

type FeatureId = (typeof FEATURE_IDS)[keyof typeof FEATURE_IDS];

const FilaModule = React.lazy(() =>
  import('@/modules/fila-trabalho/FilaModule').then((m) => ({ default: m.FilaModule }))
);

const PlaceholderModule = React.lazy(() =>
  import('@/modules/_shared/PlaceholderModule').then((m) => ({ default: m.PlaceholderModule }))
);

const STATIC_SIDEBAR: Record<string, ReactNode> = {
  fav:   <FavSidebar />,
  busca: <BuscaSidebar />,
  solar: <SolarSidebar />,
  wflow: <WflowSidebar />,
  ecm:   <EcmSidebar />,
  ces:   <CesSidebar />,
  bpm:   <BpmSidebar />,
  org:   <OrgSidebar />,
  seg:   <SegSidebar />,
};

function App() {
  const [activeModuleId, setActiveModuleId] = useState('fila');
  const [activeFeatureId, setActiveFeatureId] = useState<FeatureId>(FEATURE_IDS.filaTrabalho);
  const [filaSidebar,     setFilaSidebar]     = useState<ReactNode>(null);
  const [filaBreadcrumb,  setFilaBreadcrumb]  = useState<ReactNode>(null);

  const handleSidebarChange = useCallback((content: ReactNode) => {
    setFilaSidebar(content);
  }, []);

  const handleBreadcrumbChange = useCallback((node: ReactNode) => {
    setFilaBreadcrumb(node);
  }, []);

  const handleModuleChange = useCallback((moduleId: string) => {
    setActiveModuleId(moduleId);
    if (moduleId !== 'fila') setFilaBreadcrumb(null);
    if (moduleId === 'fila') setActiveFeatureId(FEATURE_IDS.filaTrabalho);
  }, []);

  const sidebarContent =
    activeModuleId === 'fila'
      ? filaSidebar
      : STATIC_SIDEBAR[activeModuleId] ?? null;

  const breadcrumbBar =
    activeModuleId === 'fila' ? filaBreadcrumb : null;

  const moduleContent =
    activeFeatureId === FEATURE_IDS.filaTrabalho ? (
      <FilaModule onSidebarChange={handleSidebarChange} onBreadcrumbChange={handleBreadcrumbChange} />
    ) : (
      <PlaceholderModule label="Funcionalidade em desenvolvimento" />
    );

  return (
    <FavoritesProvider>
      <AppShell
        sidebarContent={sidebarContent}
        activeModuleId={activeModuleId}
        onModuleChange={handleModuleChange}
        breadcrumbBar={breadcrumbBar}
      >
        <Suspense fallback={null}>{moduleContent}</Suspense>
      </AppShell>
    </FavoritesProvider>
  );
}

export default App;

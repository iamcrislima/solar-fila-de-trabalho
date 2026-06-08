import { SideMenuSection } from '../../components/ds/atoms/SideMenu/SideMenuSection';

export function SegSidebar() {
  return (
    <>
      <SideMenuSection title="Usuários" />
      <SideMenuSection title="Perfis" />
      <SideMenuSection title="Permissões" />
      <SideMenuSection title="Sistemas" />
      <SideMenuSection title="Menu" defaultOpen={true} />
      <SideMenuSection title="Auditoria" />
    </>
  );
}

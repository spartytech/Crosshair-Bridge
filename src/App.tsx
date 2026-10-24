import { useEffect, useState } from 'react';
import { Header, toolFromHash, type ToolId } from './components/Header';
import { CrosshairPage } from './pages/CrosshairPage';
import { SensPage } from './pages/SensPage';

export default function App() {
  // Nástroj je v adrese (#citlivost), takže jde poslat odkaz přímo na převodník citlivosti.
  const [tool, setTool] = useState<ToolId>(() => toolFromHash(window.location.hash));

  useEffect(() => {
    const onHash = () => setTool(toolFromHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-7 pb-12">
      <Header tool={tool} />
      {tool === 'sens' ? <SensPage /> : <CrosshairPage />}
    </div>
  );
}

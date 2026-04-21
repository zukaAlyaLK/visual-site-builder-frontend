import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProject } from '../api/projects.api';
import type { CanvasElement } from '../types';
import { HeaderElement } from '../components/elements/HeaderElement';
import { HeroElement } from '../components/elements/HeroElement';
import { TextElement } from '../components/elements/TextElement';
import { ImageElement } from '../components/elements/ImageElement';
import { ButtonElement } from '../components/elements/ButtonElement';
import { CardElement } from '../components/elements/CardElement';
import { FormElement } from '../components/elements/FormElement';
import { FooterElement } from '../components/elements/FooterElement';
import { DividerElement } from '../components/elements/DividerElement';
import { ColumnsElement } from '../components/elements/ColumnsElement';

type ViewMode = 'desktop' | 'tablet' | 'mobile';

const VIEW_WIDTHS: Record<ViewMode, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

function renderElement(el: CanvasElement) {
  const props = { element: el, selected: false, onSelect: () => {} };
  switch (el.type) {
    case 'header': return <HeaderElement key={el.id} {...props} />;
    case 'hero': return <HeroElement key={el.id} {...props} />;
    case 'text': return <TextElement key={el.id} {...props} />;
    case 'image': return <ImageElement key={el.id} {...props} />;
    case 'button': return <ButtonElement key={el.id} {...props} />;
    case 'card': return <CardElement key={el.id} {...props} />;
    case 'form': return <FormElement key={el.id} {...props} />;
    case 'footer': return <FooterElement key={el.id} {...props} />;
    case 'divider': return <DividerElement key={el.id} {...props} />;
    case 'columns': return <ColumnsElement key={el.id} {...props} />;
    default: return null;
  }
}

export function PreviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');

  useEffect(() => {
    if (!projectId) return;
    const cached = sessionStorage.getItem(`preview:${projectId}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { elements?: CanvasElement[]; projectName?: string };
        if (parsed.elements && Array.isArray(parsed.elements)) {
          setElements(parsed.elements);
        }
        if (parsed.projectName) {
          setProjectName(parsed.projectName);
        }
        setLoading(false);
        return;
      } catch {
        // fall back to API
      }
    }
    getProject(projectId)
      .then((project) => {
        setProjectName(project.name);
        setElements(project.canvasData?.elements || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ color: '#64748b' }}>Загрузка предпросмотра...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      {/* Preview Toolbar */}
      <div style={{
        height: 56,
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 12,
        flexShrink: 0,
      }}>
        <span style={{ color: '#1e293b', fontWeight: 600, fontSize: 14, flex: 1 }}>
          {projectName || 'Проект'} — Предпросмотр
        </span>

        {/* Viewport switcher */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 4, gap: 4, border: '1px solid #e2e8f0' }}>
          {(['desktop', 'tablet', 'mobile'] as ViewMode[]).map((mode) => {
            const labels = { desktop: 'Desktop', tablet: 'Tablet', mobile: 'Mobile' };
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  background: viewMode === mode ? '#6366f1' : 'transparent',
                  color: viewMode === mode ? '#fff' : '#64748b',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => window.close()}
          style={{
            background: 'transparent',
            border: '1px solid #e2e8f0',
            color: '#64748b',
            borderRadius: 8,
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Закрыть
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
        <div
          style={{
            width: VIEW_WIDTHS[viewMode],
            maxWidth: '100%',
            background: '#fff',
            transition: 'width 0.3s ease',
            boxShadow: viewMode !== 'desktop' ? '0 0 0 1px #e2e8f0, 0 8px 32px rgba(0,0,0,0.12)' : undefined,
            minHeight: 400,
          }}
        >
          {elements.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, color: '#94a3b8', gap: 12 }}>
              <div style={{ fontSize: 48 }}>🎨</div>
              <p style={{ margin: 0 }}>Холст пуст — добавьте компоненты в редакторе</p>
            </div>
          ) : (
            [...elements].sort((a, b) => a.order - b.order).map(renderElement)
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useCanvasStore } from '../../store/canvas.store';
import { AvatarList } from '../collab/AvatarList';
import { exportToZip } from '../../utils/zipExport';
import { updateProject } from '../../api/projects.api';
import { ArrowLeft, Undo2, Redo2, Save, Eye, Download, Settings } from 'lucide-react';
import type { Member } from '../../types';
import { ProjectSettingsModal } from '../dashboard/ProjectSettingsModal';

interface Props {
  projectId: string;
  projectName: string;
  onNameChange: (name: string) => void;
  members: Member[];
}

export function Toolbar({ projectId, projectName, onNameChange, members }: Props) {
  const { elements, undo, redo, history, future } = useCanvasStore();
  const [editing, setEditing] = useState(false);
  const [nameVal, setNameVal] = useState(projectName);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');
  const [showSettings, setShowSettings] = useState(false);

  const handleNameSave = async () => {
    setEditing(false);
    if (nameVal !== projectName) {
      onNameChange(nameVal);
      await updateProject(projectId, { name: nameVal });
    }
  };

  const handlePreview = async () => {
    try {
      await updateProject(projectId, { canvasData: { elements } });
    } catch {
      // ignore save errors, still attempt preview
    }
    sessionStorage.setItem(
      `preview:${projectId}`,
      JSON.stringify({
        elements,
        projectName,
        ts: Date.now(),
      })
    );
    window.open(`/preview/${projectId}`, '_blank');
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await updateProject(projectId, { canvasData: { elements } });
      setSaveStatus('ok');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  return (
    <div
      style={{
        height: 56,
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 12,
        flexShrink: 0,
      }}
    >
      {/* Project Name */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', color: '#6366f1', textDecoration: 'none', padding: 8, borderRadius: 8, transition: 'background 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
          <ArrowLeft size={20} />
        </a>
        {editing ? (
          <input
            autoFocus
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
            style={{
              border: '1px solid #6366f1',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 15,
              fontWeight: 600,
              outline: 'none',
              width: 220,
            }}
          />
        ) : (
          <span
            onClick={() => { setEditing(true); setNameVal(projectName); }}
            style={{ fontWeight: 600, fontSize: 15, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}
            title="Нажмите для переименования"
          >
            {projectName}
          </span>
        )}
      </div>

      {/* Undo/Redo */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={undo}
          disabled={history.length === 0}
          title="Отменить (Ctrl+Z)"
          style={{ ...btnStyle, opacity: history.length === 0 ? 0.4 : 1 }}
          onMouseEnter={(e) => { if (history.length > 0) e.currentTarget.style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={redo}
          disabled={future.length === 0}
          title="Повторить (Ctrl+Y)"
          style={{ ...btnStyle, opacity: future.length === 0 ? 0.4 : 1 }}
          onMouseEnter={(e) => { if (future.length > 0) e.currentTarget.style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Redo2 size={18} />
        </button>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: '#e2e8f0' }} />

      {/* Online Members */}
      <AvatarList members={members} />

      {/* Settings */}
      <button onClick={() => setShowSettings(true)} style={{ ...outlineBtn, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Settings size={16} />
        <span>Настройки</span>
      </button>

      {/* Save */}
      <button onClick={handleSave} style={{ ...outlineBtn, display: 'flex', alignItems: 'center', gap: 6 }} disabled={saveStatus === 'saving'}>
        <Save size={16} />
        <span>{saveStatus === 'saving' ? 'Сохранение...' : saveStatus === 'ok' ? 'Сохранено' : saveStatus === 'error' ? 'Ошибка' : 'Сохранить'}</span>
      </button>

      {/* Preview */}
      <button
        onClick={handlePreview}
        style={{ ...outlineBtn, display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <Eye size={16} />
        <span>Просмотр</span>
      </button>

      {/* Export */}
      <button
        onClick={() => exportToZip(elements, projectName)}
        style={{ ...primaryBtn, display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <Download size={16} />
        <span>Экспорт</span>
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <ProjectSettingsModal
          projectId={projectId}
          onClose={() => setShowSettings(false)}
          onUpdate={() => {
            window.location.reload(); 
          }}
        />
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  borderRadius: 8,
  padding: '8px',
  color: '#64748b',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s',
};

const outlineBtn: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: '7px 14px',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  color: '#475569',
};

const primaryBtn: React.CSSProperties = {
  background: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '7px 16px',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
};

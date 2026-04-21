import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { getProject, getMembers, updateProject } from '../api/projects.api';
import { useCanvasStore } from '../store/canvas.store';
import { useAuthStore } from '../store/auth.store';
import { connectToProject, disconnectSocket } from '../collab/socket';
import { yElements } from '../collab/yjs';
import { Canvas } from '../components/editor/Canvas';
import { ComponentPanel } from '../components/editor/ComponentPanel';
import { PropertiesPanel } from '../components/editor/PropertiesPanel';
import { Toolbar } from '../components/editor/Toolbar';
import { LayoutTemplate, GripVertical } from 'lucide-react';
import type { Member, ElementType, CanvasElement } from '../types';

export function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { token } = useAuthStore();
  const { elements, addElement, setElements, undo, redo } = useCanvasStore();
  const [projectName, setProjectName] = useState('Загрузка...');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDrag, setActiveDrag] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const createDefaultElement = (type: ElementType): CanvasElement => {
    const base = { id: uuidv4(), type, order: 0, style: {} as CanvasElement['style'] };
    switch (type) {
      case 'header':
        return {
          ...base,
          style: { backgroundColor: '#ffffff', color: '#0f172a', padding: '20px 40px', borderWidth: 0, borderColor: '#e2e8f0', borderRadius: 0 },
          content: { logoText: 'MyBrand', navLinks: ['Главная', 'О компании', 'Услуги', 'Контакты'] },
        };
      case 'hero':
        return {
          ...base,
          style: { backgroundColor: '#f8fafc', color: '#0f172a', padding: '100px 40px', fontSize: 56, fontWeight: 'bold', borderRadius: 24, margin: '20px' },
          content: { title: 'Создайте свой идеальный сайт', subtitle: 'Простой и удобный конструктор для вашего бизнеса. Никакого кода, только чистое творчество.', buttonText: 'Начать бесплатно' },
        };
      case 'text':
        return {
          ...base,
          style: { color: '#334155', fontSize: 18, padding: '20px 40px' },
          content: { text: 'Это текстовый блок. Здесь вы можете рассказать подробнее о вашей компании, миссии или продукте. Хороший текст помогает пользователям лучше понять ценность вашего предложения.' },
        };
      case 'image':
        return {
          ...base,
          style: { imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80', width: '100%', borderRadius: 16, margin: '20px 0' },
          content: {},
        };
      case 'button':
        return {
          ...base,
          style: { backgroundColor: '#6366f1', color: '#ffffff', borderRadius: 12, padding: '14px 28px', fontSize: 16, fontWeight: 'bold' },
          content: { buttonText: 'Узнать больше', buttonLink: '#' },
        };
      case 'card':
        return {
          ...base,
          style: { backgroundColor: '#ffffff', borderRadius: 16, padding: '24px', borderWidth: 1, borderColor: '#e2e8f0' },
          content: { title: 'Преимущество', text: 'Краткое описание того, почему клиенты должны выбрать именно вас. Подчеркните ваши сильные стороны.' },
        };
      case 'form':
        return {
          ...base,
          style: { backgroundColor: '#ffffff', padding: '48px', borderRadius: 24, borderWidth: 1, borderColor: '#e2e8f0', margin: '40px 20px' },
          content: { title: 'Готовы начать?', subtitle: 'Оставьте заявку и мы свяжемся с вами', buttonText: 'Отправить' },
        };
      case 'footer':
        return {
          ...base,
          style: { backgroundColor: '#0f172a', color: '#94a3b8', padding: '40px', fontSize: 14 },
          content: { text: '© 2025 Ваша Компания. Все права защищены.' },
        };
      case 'divider':
        return {
          ...base,
          style: { borderWidth: 1, borderColor: '#e2e8f0', padding: '8px 24px' },
          content: {},
        };
      case 'columns':
        return {
          ...base,
          style: { padding: '24px' },
          content: { columns: [[], []] },
        };
      default: return { ...base, content: {} };
    }
  };

  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event;
      setActiveDrag(null);
      if (!over) return;

      if (active.data.current?.isNewComponent) {
        const type = active.data.current.componentType as ElementType;
        const isCanvasTarget = over?.id === 'canvas-drop' || elements.some((el) => el.id === over?.id);
        if (!isCanvasTarget) return;
        const el = createDefaultElement(type);
        el.order = elements.length;
        addElement(el);
        return;
      }

      if (active.id !== over.id) {
        const oldIndex = elements.findIndex((e) => e.id === active.id);
        const newIndex = elements.findIndex((e) => e.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(elements, oldIndex, newIndex).map((el, i) => ({ ...el, order: i }));
          setElements(reordered);
        }
      }
    },
    [addElement, elements, setElements]
  );

  const handleDragStart = useCallback((event: any) => {
    setActiveDrag(event.active);
  }, []);

  useEffect(() => {
    if (!projectId || !token) return;

    const init = async () => {
      try {
        const [project, memberList] = await Promise.all([
          getProject(projectId),
          getMembers(projectId),
        ]);
        setProjectName(project.name);
        setMembers(memberList);

        const elements = project.canvasData?.elements || [];
        setElements(elements);

        if (elements.length > 0) {
          yElements.delete(0, yElements.length);
          yElements.push(elements);
        }

        connectToProject(projectId, token);
      } catch (err) {
        console.error('Failed to init editor', err);
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      disconnectSocket();
    };
  }, [projectId, token]);

  // Sync yElements -> canvas store
  useEffect(() => {
    const observer = () => {
      const els = yElements.toArray();
      setElements(els);
    };
    yElements.observe(observer);
    return () => yElements.unobserve(observer);
  }, [setElements]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'y' || (e.key === 'z' && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    },
    [undo, redo]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!projectId) return;
    const interval = setInterval(() => {
      updateProject(projectId, { canvasData: { elements } }).catch(() => undefined);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [projectId, elements]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: '#6366f1' }}>
            <LayoutTemplate size={48} strokeWidth={1.5} />
          </div>
          <p style={{ margin: 0, fontSize: 16 }}>Загрузка редактора...</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Toolbar
          projectId={projectId!}
          projectName={projectName}
          onNameChange={setProjectName}
          members={members}
        />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <ComponentPanel />
          <Canvas projectId={projectId!} />
          <PropertiesPanel />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeDrag?.data?.current?.isNewComponent ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: '#6366f1',
              color: '#fff',
              borderRadius: 100,
              boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <GripVertical size={16} />
            Добавление компонента...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

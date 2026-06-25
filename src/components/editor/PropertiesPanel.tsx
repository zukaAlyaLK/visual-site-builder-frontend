import { useRef, useState } from 'react';
import { useCanvasStore } from '../../store/canvas.store';
import { uploadImage } from '../../api/upload.api';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Upload,
  Plus,
  Trash2,
  Settings,
  Type,
  FileImage,
} from 'lucide-react';
import type { ElementType } from '../../types';

export function PropertiesPanel() {
  const { elements, selectedId, updateElement } = useCanvasStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const selectedElement = elements.find((el) => el.id === selectedId);

  if (!selectedElement) {
    return (
      <div
        style={{
          width: 288,
          minWidth: 288,
          background: '#fff',
          borderLeft: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
          color: '#94a3b8',
        }}
      >
        <div style={{ background: '#f1f5f9', padding: 16, borderRadius: '50%', marginBottom: 12 }}>
          <Settings size={28} />
        </div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#64748b' }}>
          Выберите элемент на холсте
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>
          чтобы настроить его содержимое и стили
        </p>
      </div>
    );
  }

  const { type, content, style } = selectedElement;

  const handleStyleChange = (key: keyof typeof style, value: any) => {
    updateElement(selectedElement.id, {
      style: { [key]: value },
    });
  };

  const handleContentChange = (key: string, value: any) => {
    updateElement(selectedElement.id, {
      content: { [key]: value },
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isLogo = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      if (isLogo) {
        handleContentChange('logoImageUrl', url);
      } else {
        handleStyleChange('imageUrl', url);
      }
    } catch (err) {
      alert('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  // NavLinks management helper
  const handleNavLinkChange = (index: number, val: string) => {
    const links = [...(content.navLinks || ['Главная', 'О нас'])];
    links[index] = val;
    handleContentChange('navLinks', links);
  };

  const handleAddNavLink = () => {
    const links = [...(content.navLinks || ['Главная', 'О нас']), 'Новая ссылка'];
    handleContentChange('navLinks', links);
  };

  const handleRemoveNavLink = (index: number) => {
    const links = [...(content.navLinks || ['Главная', 'О нас'])];
    if (links.length <= 1) return;
    links.splice(index, 1);
    handleContentChange('navLinks', links);
  };

  // Columns management helper
  const handleColumnsCountChange = (count: number) => {
    const currentCols = content.columns || [[], []];
    let newCols = [...currentCols];
    if (count > currentCols.length) {
      while (newCols.length < count) {
        newCols.push([]);
      }
    } else if (count < currentCols.length && count >= 1) {
      newCols = newCols.slice(0, count);
    }
    handleContentChange('columns', newCols);
  };

  return (
    <div
      style={{
        width: 288,
        minWidth: 288,
        background: '#fff',
        borderLeft: '1px solid #e2e8f0',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '16px 16px 8px', borderBottom: '1px solid #f1f5f9' }}>
        <h3
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Свойства ({type})
        </h3>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* SECTION 1: Content */}
        <div>
          <div style={sectionHeaderStyle}>
            <Type size={14} />
            <span>Содержимое</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Header Content */}
            {type === 'header' && (
              <>
                <div>
                  <label style={labelStyle}>Логотип (Текст)</label>
                  <input
                    type="text"
                    value={content.logoText || ''}
                    onChange={(e) => handleContentChange('logoText', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Логотип (Изображение)</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="URL логотипа"
                      value={content.logoImageUrl || ''}
                      onChange={(e) => handleContentChange('logoImageUrl', e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      onClick={() => logoFileInputRef.current?.click()}
                      disabled={uploading}
                      style={iconBtnStyle}
                      title="Загрузить изображение"
                    >
                      <Upload size={14} />
                    </button>
                    <input
                      type="file"
                      ref={logoFileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Ссылки меню</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {(content.navLinks || ['Главная', 'О нас']).map((link, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 6 }}>
                        <input
                          type="text"
                          value={link}
                          onChange={(e) => handleNavLinkChange(idx, e.target.value)}
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        <button
                          onClick={() => handleRemoveNavLink(idx)}
                          style={{ ...iconBtnStyle, color: '#ef4444' }}
                          title="Удалить ссылку"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddNavLink}
                      style={{
                        background: 'transparent',
                        border: '1px dashed #6366f1',
                        color: '#6366f1',
                        borderRadius: 6,
                        padding: '6px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        marginTop: 4,
                      }}
                    >
                      <Plus size={12} />
                      Добавить ссылку
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Hero Content */}
            {type === 'hero' && (
              <>
                <div>
                  <label style={labelStyle}>Заголовок</label>
                  <textarea
                    value={content.title || ''}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    rows={2}
                    style={textareaStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Подзаголовок</label>
                  <textarea
                    value={content.subtitle || ''}
                    onChange={(e) => handleContentChange('subtitle', e.target.value)}
                    rows={3}
                    style={textareaStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Текст кнопки</label>
                  <input
                    type="text"
                    value={content.buttonText || ''}
                    onChange={(e) => handleContentChange('buttonText', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Ссылка кнопки</label>
                  <input
                    type="text"
                    value={content.buttonLink || ''}
                    onChange={(e) => handleContentChange('buttonLink', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            {/* Text Content */}
            {type === 'text' && (
              <div>
                <label style={labelStyle}>Текст</label>
                <textarea
                  value={content.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  rows={6}
                  style={textareaStyle}
                />
              </div>
            )}

            {/* Image Content / Style */}
            {type === 'image' && (
              <div>
                <label style={labelStyle}>Изображение</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="URL изображения"
                    value={style.imageUrl || ''}
                    onChange={(e) => handleStyleChange('imageUrl', e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={iconBtnStyle}
                    title="Загрузить изображение"
                  >
                    <Upload size={14} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                  />
                </div>
              </div>
            )}

            {/* Button Content */}
            {type === 'button' && (
              <>
                <div>
                  <label style={labelStyle}>Текст кнопки</label>
                  <input
                    type="text"
                    value={content.buttonText || ''}
                    onChange={(e) => handleContentChange('buttonText', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Ссылка кнопки</label>
                  <input
                    type="text"
                    value={content.buttonLink || ''}
                    onChange={(e) => handleContentChange('buttonLink', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            {/* Card Content */}
            {type === 'card' && (
              <>
                <div>
                  <label style={labelStyle}>Заголовок карточки</label>
                  <input
                    type="text"
                    value={content.title || ''}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Текст описания</label>
                  <textarea
                    value={content.text || ''}
                    onChange={(e) => handleContentChange('text', e.target.value)}
                    rows={4}
                    style={textareaStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Изображение карточки</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="URL изображения"
                      value={style.imageUrl || ''}
                      onChange={(e) => handleStyleChange('imageUrl', e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      style={iconBtnStyle}
                      title="Загрузить изображение"
                    >
                      <Upload size={14} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Form Content */}
            {type === 'form' && (
              <>
                <div>
                  <label style={labelStyle}>Заголовок формы</label>
                  <input
                    type="text"
                    value={content.title || ''}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Подзаголовок</label>
                  <input
                    type="text"
                    value={content.subtitle || ''}
                    onChange={(e) => handleContentChange('subtitle', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Текст кнопки отправки</label>
                  <input
                    type="text"
                    value={content.buttonText || ''}
                    onChange={(e) => handleContentChange('buttonText', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            {/* Footer Content */}
            {type === 'footer' && (
              <div>
                <label style={labelStyle}>Текст подвала</label>
                <textarea
                  value={content.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  rows={3}
                  style={textareaStyle}
                />
              </div>
            )}

            {/* Columns Content */}
            {type === 'columns' && (
              <div>
                <label style={labelStyle}>Количество колонок</label>
                <select
                  value={(content.columns || [[], []]).length}
                  onChange={(e) => handleColumnsCountChange(Number(e.target.value))}
                  style={selectStyle}
                >
                  <option value={1}>1 Колонка</option>
                  <option value={2}>2 Колонки</option>
                  <option value={3}>3 Колонки</option>
                  <option value={4}>4 Колонки</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div style={{ height: 1, background: '#f1f5f9' }} />

        {/* SECTION 2: Styling */}
        <div>
          <div style={sectionHeaderStyle}>
            <FileImage size={14} />
            <span>Оформление</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Color Palette */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Цвет фона</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={style.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    style={{ border: 'none', background: 'transparent', width: 28, height: 28, cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={style.backgroundColor || ''}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    style={{ ...inputStyle, padding: '4px 6px', fontSize: 11 }}
                    placeholder="Hex/RGB"
                  />
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Цвет текста</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={style.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    style={{ border: 'none', background: 'transparent', width: 28, height: 28, cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={style.color || ''}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    style={{ ...inputStyle, padding: '4px 6px', fontSize: 11 }}
                    placeholder="Hex/RGB"
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Размер шрифта</label>
                <input
                  type="number"
                  min={8}
                  max={96}
                  value={style.fontSize || ''}
                  onChange={(e) => handleStyleChange('fontSize', e.target.value ? Number(e.target.value) : undefined)}
                  style={inputStyle}
                  placeholder="px"
                />
              </div>

              <div style={{ display: 'flex', gap: 4 }}>
                {/* Bold Toggle */}
                <button
                  onClick={() => handleStyleChange('fontWeight', style.fontWeight === 'bold' ? 'normal' : 'bold')}
                  style={{
                    ...iconBtnStyle,
                    background: style.fontWeight === 'bold' ? '#e0e7ff' : 'transparent',
                    borderColor: style.fontWeight === 'bold' ? '#6366f1' : '#e2e8f0',
                    color: style.fontWeight === 'bold' ? '#6366f1' : '#64748b',
                  }}
                  title="Жирный"
                >
                  <Bold size={14} />
                </button>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <label style={labelStyle}>Выравнивание текста</label>
              <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
                {(['left', 'center', 'right'] as const).map((align) => {
                  const icons = {
                    left: <AlignLeft size={14} />,
                    center: <AlignCenter size={14} />,
                    right: <AlignRight size={14} />,
                  };
                  const active = style.textAlign === align || (align === 'left' && !style.textAlign);
                  return (
                    <button
                      key={align}
                      onClick={() => handleStyleChange('textAlign', align)}
                      style={{
                        border: 'none',
                        background: active ? '#f1f5f9' : '#fff',
                        color: active ? '#1e293b' : '#94a3b8',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {icons[align]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layout Geometry */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Внутр. отступы (padding)</label>
                <input
                  type="text"
                  value={style.padding || ''}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. 16px 24px"
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Внешн. отступы (margin)</label>
                <input
                  type="text"
                  value={style.margin || ''}
                  onChange={(e) => handleStyleChange('margin', e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. 20px"
                />
              </div>
            </div>

            {/* Borders & Rounding */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Скругление углов</label>
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={style.borderRadius !== undefined ? style.borderRadius : ''}
                  onChange={(e) => handleStyleChange('borderRadius', e.target.value ? Number(e.target.value) : undefined)}
                  style={inputStyle}
                  placeholder="px"
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Толщина рамки</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={style.borderWidth !== undefined ? style.borderWidth : ''}
                  onChange={(e) => handleStyleChange('borderWidth', e.target.value ? Number(e.target.value) : undefined)}
                  style={inputStyle}
                  placeholder="px"
                />
              </div>
            </div>

            {(style.borderWidth || 0) > 0 && (
              <div>
                <label style={labelStyle}>Цвет рамки</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={style.borderColor || '#e2e8f0'}
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    style={{ border: 'none', background: 'transparent', width: 28, height: 28, cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={style.borderColor || ''}
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. #e2e8f0"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 12,
  fontWeight: 700,
  color: '#475569',
  marginBottom: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: '#64748b',
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  fontSize: 12,
  outline: 'none',
  boxSizing: 'border-box',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  fontSize: 12,
  outline: 'none',
  boxSizing: 'border-box',
  resize: 'vertical',
  fontFamily: 'inherit',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  fontSize: 12,
  outline: 'none',
  boxSizing: 'border-box',
  background: '#fff',
};

const iconBtnStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#64748b',
  flexShrink: 0,
};

import type { CanvasElement } from '../types';

// ─── Helpers ───────────────────────────────────────────────────────────────

function px(value: number | string | undefined): string {
  if (value === undefined) return '';
  return typeof value === 'number' ? `${value}px` : value;
}

function styleToCSS(style: CanvasElement['style']): string {
  const rules: string[] = [];
  if (style.backgroundColor) rules.push(`background-color: ${style.backgroundColor}`);
  if (style.color) rules.push(`color: ${style.color}`);
  if (style.fontSize) rules.push(`font-size: ${px(style.fontSize)}`);
  if (style.fontWeight) rules.push(`font-weight: ${style.fontWeight}`);
  if (style.padding) rules.push(`padding: ${style.padding}`);
  if (style.margin) rules.push(`margin: ${style.margin}`);
  if (style.borderRadius) rules.push(`border-radius: ${px(style.borderRadius)}`);
  if (style.borderWidth) rules.push(`border: ${px(style.borderWidth)} solid ${style.borderColor || '#000'}`);
  if (style.width) rules.push(`width: ${style.width}`);
  if (style.height) rules.push(`height: ${style.height}`);
  if (style.imageUrl) rules.push(`background-image: url('${style.imageUrl}')`);
  return rules.map(r => `  ${r};`).join('\n');
}

function renderElementToHtml(el: CanvasElement, cls: string): string {
  const { type, content, style } = el;
  switch (type) {
    case 'header':
      return `<header class="${cls}">
  <div class="${cls}__logo">${content.logoText || 'Logo'}</div>
  <nav class="${cls}__nav">
    ${(content.navLinks || []).map((l: string) => `<a href="#">${l}</a>`).join('\n    ')}
  </nav>
</header>\n`;

    case 'hero':
      return `<section class="${cls}">
  <div class="${cls}__inner">
    <h1 class="${cls}__title">${content.title || 'Заголовок'}</h1>
    <p class="${cls}__subtitle">${content.subtitle || ''}</p>
    ${content.buttonText ? `<a class="${cls}__btn" href="${content.buttonLink || '#'}">${content.buttonText}</a>` : ''}
  </div>
</section>\n`;

    case 'text':
      return `<div class="${cls}"><p>${content.text || ''}</p></div>\n`;

    case 'image':
      return `<div class="${cls}"><img src="${style.imageUrl || ''}" alt="" style="width:100%;border-radius:${px(style.borderRadius) || '0'};display:block;" /></div>\n`;

    case 'button':
      return `<div class="${cls}__wrap"><a class="${cls}" href="${content.buttonLink || '#'}">${content.buttonText || 'Кнопка'}</a></div>\n`;

    case 'card':
      return `<div class="${cls}">
  <h3 class="${cls}__title">${content.title || 'Карточка'}</h3>
  <p class="${cls}__text">${content.text || ''}</p>
</div>\n`;

    case 'form':
      return `<section class="${cls}">
  <h2 class="${cls}__title">${content.title || 'Свяжитесь с нами'}</h2>
  <p class="${cls}__subtitle">${content.subtitle || ''}</p>
  <form class="${cls}__form">
    <input type="text" placeholder="Ваше имя" />
    <input type="email" placeholder="Email" />
    <textarea placeholder="Сообщение"></textarea>
    <button type="submit">${content.buttonText || 'Отправить'}</button>
  </form>
</section>\n`;

    case 'footer':
      return `<footer class="${cls}"><p>${content.text || '© 2025 Мой сайт'}</p></footer>\n`;

    case 'divider':
      return `<hr class="${cls}" />\n`;

    case 'columns':
      return `<div class="${cls}">
  ${(content.columns || [[], []]).map((col: CanvasElement[], i: number) =>
    `<div class="${cls}__col">${col.map((c: CanvasElement) => renderElementToHtml(c, `${cls}-n${i}`)).join('')}</div>`
  ).join('\n  ')}
</div>\n`;

    default:
      return '';
  }
}

/**
 * Generate per-element CSS rules + structural CSS for complex elements
 */
function generateElementCSS(el: CanvasElement, cls: string): string {
  const { type, style } = el;
  let css = `.${cls} {\n${styleToCSS(style)}\n}\n`;

  switch (type) {
    case 'header':
      css += `.${cls} { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.${cls}__logo { font-size: 20px; font-weight: 700; color: inherit; }
.${cls}__nav { display: flex; gap: 24px; }
.${cls}__nav a { text-decoration: none; color: inherit; font-size: 15px; font-weight: 500; transition: opacity 0.2s; }
.${cls}__nav a:hover { opacity: 0.7; }\n`;
      break;
    case 'hero':
      css += `.${cls}__inner { max-width: 800px; margin: 0 auto; text-align: center; }
.${cls}__title { font-size: 52px; font-weight: 800; margin: 0 0 20px; line-height: 1.15; color: inherit; }
.${cls}__subtitle { font-size: 20px; margin: 0 0 36px; opacity: 0.75; color: inherit; }
.${cls}__btn { display: inline-block; padding: 16px 36px; background: #6366f1; color: #fff; border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: 700; transition: transform 0.2s, box-shadow 0.2s; }
.${cls}__btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.35); }\n`;
      break;
    case 'button':
      css += `.${cls}__wrap { display: flex; justify-content: center; padding: 16px; }
.${cls} { display: inline-block; text-decoration: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
.${cls}:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }\n`;
      break;
    case 'card':
      css += `.${cls}__title { font-size: 18px; font-weight: 700; margin: 0 0 10px; color: inherit; }
.${cls}__text { font-size: 15px; color: #64748b; margin: 0; line-height: 1.6; }\n`;
      break;
    case 'form':
      css += `.${cls}__title { font-size: 30px; font-weight: 800; text-align: center; margin: 0 0 8px; }
.${cls}__subtitle { text-align: center; color: #64748b; margin: 0 0 32px; }
.${cls}__form { display: flex; flex-direction: column; gap: 14px; max-width: 480px; margin: 0 auto; }
.${cls}__form input, .${cls}__form textarea { padding: 12px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 15px; font-family: inherit; outline: none; transition: border-color 0.2s; }
.${cls}__form input:focus, .${cls}__form textarea:focus { border-color: #6366f1; }
.${cls}__form textarea { min-height: 120px; resize: vertical; }
.${cls}__form button { padding: 14px; background: #6366f1; color: #fff; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
.${cls}__form button:hover { background: #4f46e5; }\n`;
      break;
    case 'footer':
      css += `.${cls} { text-align: center; }
.${cls} p { margin: 0; }\n`;
      break;
    case 'columns':
      css += `.${cls} { display: flex; gap: 24px; align-items: flex-start; }
.${cls}__col { flex: 1; }\n`;
      break;
  }

  return css;
}

// ─── Base / Reset CSS ───────────────────────────────────────────────────────

const BASE_CSS = `
/* === Reset & Base === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #0f172a;
  background: #ffffff;
  line-height: 1.5;
}
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; }
`;

// ─── Public API ─────────────────────────────────────────────────────────────

export function exportToHtml(elements: CanvasElement[]): { html: string; css: string } {
  let css = BASE_CSS;
  let bodyHtml = '';

  for (const el of [...elements].sort((a, b) => a.order - b.order)) {
    const cls = `el-${el.id.slice(0, 8)}`;
    css += generateElementCSS(el, cls);
    bodyHtml += renderElementToHtml(el, cls);
  }

  // ✅ CSS is INLINED via <style> — works when opened directly from file system
  //    (file:// protocol blocks <link rel="stylesheet"> in most browsers)
  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Site</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
${css}
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

  return { html, css };
}

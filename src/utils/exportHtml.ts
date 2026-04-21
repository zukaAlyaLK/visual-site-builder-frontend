import type { CanvasElement } from '../types';

function styleToCSS(style: CanvasElement['style']): string {
  let css = '';
  if (style.backgroundColor) css += `  background-color: ${style.backgroundColor};\n`;
  if (style.color) css += `  color: ${style.color};\n`;
  if (style.fontSize) css += `  font-size: ${style.fontSize}px;\n`;
  if (style.fontWeight) css += `  font-weight: ${style.fontWeight};\n`;
  if (style.padding) css += `  padding: ${style.padding};\n`;
  if (style.margin) css += `  margin: ${style.margin};\n`;
  if (style.borderRadius) css += `  border-radius: ${style.borderRadius}px;\n`;
  if (style.borderWidth) css += `  border: ${style.borderWidth}px solid ${style.borderColor || '#000'};\n`;
  if (style.width) css += `  width: ${style.width};\n`;
  if (style.height) css += `  height: ${style.height};\n`;
  return css;
}

function renderElementToHtml(el: CanvasElement, cls: string): string {
  const { type, content, style } = el;
  switch (type) {
    case 'header':
      return `<header class="${cls}">
  <div class="${cls}-logo">${content.logoText || 'Logo'}</div>
  <nav>${(content.navLinks || []).map((l) => `<a href="#">${l}</a>`).join(' ')}</nav>
</header>\n`;
    case 'hero':
      return `<section class="${cls}">
  <h1>${content.title || 'Заголовок'}</h1>
  <p>${content.subtitle || ''}</p>
  ${content.buttonText ? `<a href="${content.buttonLink || '#'}">${content.buttonText}</a>` : ''}
</section>\n`;
    case 'text':
      return `<p class="${cls}">${content.text || ''}</p>\n`;
    case 'image':
      return `<img class="${cls}" src="${style.imageUrl || ''}" alt="" />\n`;
    case 'button':
      return `<a class="${cls}" href="${content.buttonLink || '#'}">${content.buttonText || 'Кнопка'}</a>\n`;
    case 'card':
      return `<div class="${cls}">
  ${style.imageUrl ? `<img src="${style.imageUrl}" alt="" />` : ''}
  <h3>${content.title || 'Карточка'}</h3>
  <p>${content.text || ''}</p>
</div>\n`;
    case 'form':
      return `<form class="${cls}">
  <h2>${content.title || 'Свяжитесь с нами'}</h2>
  <input type="text" placeholder="Ваше имя" />
  <input type="email" placeholder="Email" />
  <textarea placeholder="Сообщение"></textarea>
  <button type="submit">Отправить</button>
</form>\n`;
    case 'footer':
      return `<footer class="${cls}"><p>${content.text || '© 2025 Мой сайт'}</p></footer>\n`;
    case 'divider':
      return `<hr class="${cls}" />\n`;
    case 'columns':
      return `<div class="${cls} columns">${(content.columns || [[], []]).map((col, i) => `<div class="${cls}-col-${i}">${col.map((c) => renderElementToHtml(c, `${cls}-nested`)).join('')}</div>`).join('')}</div>\n`;
    default:
      return '';
  }
}

export function exportToHtml(elements: CanvasElement[]): { html: string; css: string } {
  let css = '';
  let bodyHtml = '';

  for (const el of elements) {
    const cls = `vsb-element-${el.id.slice(0, 8)}`;
    css += `.${cls} {\n`;
    css += styleToCSS(el.style);
    css += `}\n`;
    bodyHtml += renderElementToHtml(el, cls);
  }

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Site</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${bodyHtml}</body>
</html>`;

  return { html, css };
}

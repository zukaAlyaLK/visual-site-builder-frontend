ТЗ для ИИ-агента — FRONTEND  |  Visual Site Builder

**ТЗ ДЛЯ ИИ-АГЕНТА**

**FRONTEND**

Visual Site Builder — Сервис визуальной компоновки сайтов

*Стек: React · TypeScript · Vite · dnd-kit · Yjs · Socket.io · Zustand · Tailwind CSS*

Версия 1.0  |  2025

*💡 Этот документ является инструкцией для ИИ-агента. Backend уже реализован и работает на http://localhost:3001. Не дублируй бизнес-логику на фронтенде — всё взаимодействие с данными только через API.*


# **1. Контекст и задача агента**
Ты — ИИ-агент, реализующий frontend-часть веб-приложения «Visual Site Builder». Твоя задача — создать React-приложение с drag-and-drop редактором, совместным редактированием и экспортом в HTML/CSS.

Backend API уже работает на http://localhost:3001. Все данные получай через REST API и WebSocket. Не реализуй серверную логику — только UI и клиентское взаимодействие.
## **1.1 Критерии успешного выполнения**
- Приложение запускается командой npm run dev без ошибок
- Авторизация работает: можно зарегистрироваться, войти, выйти
- Дашборд отображает список проектов пользователя
- Редактор: компоненты перетаскиваются на холст и сохраняют позицию
- Панель свойств: выбранный элемент можно редактировать
- Совместное редактирование: два окна синхронизируются через Yjs
- Предпросмотр и экспорт в ZIP работают


# **2. Структура файлов проекта**
visual-site-builder-frontend/

├── public/

├── src/

│   ├── main.tsx                  # Точка входа

│   ├── App.tsx                   # Роутер

│   ├── api/

│   │   ├── client.ts             # Axios instance с JWT

│   │   ├── auth.api.ts

│   │   └── projects.api.ts

│   ├── store/

│   │   ├── auth.store.ts         # Zustand: пользователь, токен

│   │   └── canvas.store.ts       # Zustand: элементы холста

│   ├── collab/

│   │   ├── yjs.ts                # Инициализация Y.Doc

│   │   └── socket.ts             # Socket.io клиент

│   ├── pages/

│   │   ├── LoginPage.tsx

│   │   ├── RegisterPage.tsx

│   │   ├── DashboardPage.tsx

│   │   ├── EditorPage.tsx

│   │   └── PreviewPage.tsx

│   ├── components/

│   │   ├── editor/

│   │   │   ├── Canvas.tsx        # Холст с dnd-kit

│   │   │   ├── CanvasElement.tsx # Один элемент на холсте

│   │   │   ├── ComponentPanel.tsx# Левая панель

│   │   │   ├── PropertiesPanel.tsx# Правая панель

│   │   │   └── Toolbar.tsx       # Верхняя панель

│   │   ├── collab/

│   │   │   ├── CursorOverlay.tsx # Курсоры участников

│   │   │   └── AvatarList.tsx    # Онлайн-индикаторы

│   │   └── ui/                   # Кнопки, инпуты, модалки

│   ├── components/elements/      # Рендер-компоненты

│   │   ├── HeaderElement.tsx

│   │   ├── HeroElement.tsx

│   │   ├── TextElement.tsx

│   │   ├── ImageElement.tsx

│   │   ├── ButtonElement.tsx

│   │   ├── CardElement.tsx

│   │   ├── FormElement.tsx

│   │   ├── FooterElement.tsx

│   │   ├── DividerElement.tsx

│   │   └── ColumnsElement.tsx

│   ├── utils/

│   │   ├── exportHtml.ts         # Генерация HTML/CSS

│   │   └── zipExport.ts          # Создание ZIP-архива

│   └── types/

│       └── index.ts              # Все TypeScript-типы

├── .env

├── index.html

├── vite.config.ts

└── package.json


# **3. Зависимости и установка**
npm create vite@latest . -- --template react-ts

npm install react-router-dom axios zustand

npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

npm install yjs socket.io-client

npm install jszip file-saver

npm install -D tailwindcss postcss autoprefixer @types/file-saver

npx tailwindcss init -p
## **3.1 .env**
VITE\_API\_URL=http://localhost:3001

VITE\_WS\_URL=http://localhost:3001


# **4. TypeScript-типы (src/types/index.ts)**
Эти типы — контракт между всеми модулями. Не изменяй имена полей.

export type ElementType =

`  `| 'header' | 'hero' | 'text' | 'image'

`  `| 'button' | 'card' | 'form' | 'footer'

`  `| 'divider' | 'columns';

export interface ElementStyle {

`  `backgroundColor?: string;

`  `color?: string;

`  `fontSize?: number;      // px

`  `fontWeight?: 'normal' | 'bold';

`  `padding?: string;       // CSS shorthand: '16px 24px'

`  `margin?: string;

`  `borderRadius?: number;  // px

`  `borderWidth?: number;   // px

`  `borderColor?: string;

`  `imageUrl?: string;      // для Image и Card

`  `width?: string;         // '100%' или px

`  `height?: string;

}

export interface CanvasElement {

`  `id: string;             // uuid

`  `type: ElementType;

`  `order: number;          // порядок на холсте (сверху вниз)

`  `content: {

`    `title?: string;

`    `subtitle?: string;

`    `text?: string;

`    `buttonText?: string;

`    `buttonLink?: string;

`    `logoText?: string;

`    `navLinks?: string[];  // ['О нас', 'Контакты']

`    `columns?: CanvasElement[][];  // для columns

`  `};

`  `style: ElementStyle;

}

export interface CanvasState {

`  `elements: CanvasElement[];

`  `version: number;

}

export interface Project {

`  `id: string;

`  `name: string;

`  `description?: string;

`  `canvasData: CanvasState;

`  `ownerId: string;

`  `createdAt: string;

`  `updatedAt: string;

`  `role: 'OWNER' | 'EDITOR';

}

export interface User {

`  `id: string;

`  `email: string;

`  `name: string;

}

export interface Member {

`  `userId: string;

`  `name: string;

`  `email: string;

`  `role: 'OWNER' | 'EDITOR';

`  `color?: string;  // цвет курсора (приходит из WebSocket)

}


# **5. API-клиент (src/api/)**
## **5.1 client.ts — Axios с JWT**
import axios from 'axios';

export const api = axios.create({

`  `baseURL: import.meta.env.VITE\_API\_URL + '/api',

});

// Добавлять токен автоматически

api.interceptors.request.use((config) => {

`  `const token = localStorage.getItem('token');

`  `if (token) config.headers.Authorization = `Bearer ${token}`;

`  `return config;

});

// При 401 — очищать токен и редиректить на /login

api.interceptors.response.use(

`  `(res) => res,

`  `(err) => {

`    `if (err.response?.status === 401) {

`      `localStorage.removeItem('token');

`      `window.location.href = '/login';

`    `}

`    `return Promise.reject(err);

`  `}

);
## **5.2 Функции API**

|**Файл**|**Функция**|**Метод + URL**|**Описание**|
| :- | :- | :- | :- |
|auth.api.ts|register(email, password, name)|POST /auth/register|Регистрация|
|auth.api.ts|login(email, password)|POST /auth/login|Вход|
|auth.api.ts|getMe()|GET /auth/me|Текущий пользователь|
|projects.api.ts|getProjects()|GET /projects|Список проектов|
|projects.api.ts|createProject(data)|POST /projects|Создать проект|
|projects.api.ts|getProject(id)|GET /projects/:id|Один проект|
|projects.api.ts|updateProject(id, data)|PUT /projects/:id|Обновить|
|projects.api.ts|deleteProject(id)|DELETE /projects/:id|Удалить|
|projects.api.ts|inviteMember(id, email)|POST /projects/:id/invite|Пригласить|
|projects.api.ts|getMembers(id)|GET /projects/:id/members|Участники|
|upload.api.ts|uploadImage(file)|POST /upload/image|Загрузить картинку|


# **6. Хранилища состояния (Zustand)**
## **6.1 auth.store.ts**
import { create } from 'zustand';

import { persist } from 'zustand/middleware';

import { User } from '../types';

interface AuthStore {

`  `user: User | null;

`  `token: string | null;

`  `setAuth: (user: User, token: string) => void;

`  `logout: () => void;

}

export const useAuthStore = create<AuthStore>()(

`  `persist(

`    `(set) => ({

`      `user: null, token: null,

`      `setAuth: (user, token) => {

`        `localStorage.setItem('token', token);

`        `set({ user, token });

`      `},

`      `logout: () => {

`        `localStorage.removeItem('token');

`        `set({ user: null, token: null });

`      `},

`    `}),

`    `{ name: 'auth-storage' }

`  `)

);
## **6.2 canvas.store.ts**
import { create } from 'zustand';

import { CanvasElement } from '../types';

interface CanvasStore {

`  `elements: CanvasElement[];

`  `selectedId: string | null;

`  `history: CanvasElement[][];   // для undo

`  `future: CanvasElement[][];    // для redo

`  `setElements: (els: CanvasElement[]) => void;

`  `addElement: (el: CanvasElement) => void;

`  `updateElement: (id: string, patch: Partial<CanvasElement>) => void;

`  `removeElement: (id: string) => void;

`  `selectElement: (id: string | null) => void;

`  `undo: () => void;

`  `redo: () => void;

}

*💡 Каждое изменение (add/update/remove) должно сохранять текущий массив в history перед изменением. Undo восстанавливает последнее состояние из history.*


# **7. Совместное редактирование (Yjs + Socket.io)**
## **7.1 src/collab/yjs.ts — Yjs документ**
import \* as Y from 'yjs';

// Один глобальный документ на сессию редактора

export const ydoc = new Y.Doc();

// Массив элементов холста как Yjs-массив

export const yElements = ydoc.getArray<any>('elements');

// Применить внешнее обновление (от сервера)

export const applyRemoteUpdate = (update: Uint8Array) => {

`  `Y.applyUpdate(ydoc, update);

};

// Получить текущее состояние для отправки

export const getStateUpdate = () => Y.encodeStateAsUpdate(ydoc);
## **7.2 src/collab/socket.ts — Socket.io клиент**
import { io, Socket } from 'socket.io-client';

import { applyRemoteUpdate, ydoc } from './yjs';

import { useCanvasStore } from '../store/canvas.store';

let socket: Socket | null = null;

export function connectToProject(projectId: string, token: string) {

`  `socket = io(import.meta.env.VITE\_WS\_URL, { transports: ['websocket'] });

`  `socket.on('connect', () => {

`    `socket!.emit('join-project', { projectId, token });

`  `});

`  `// Получить начальное состояние

`  `socket.on('sync-state', (update: ArrayBuffer) => {

`    `applyRemoteUpdate(new Uint8Array(update));

`  `});

`  `// Получить обновление от другого участника

`  `socket.on('yjs-update', ({ update }: { update: ArrayBuffer }) => {

`    `applyRemoteUpdate(new Uint8Array(update));

`  `});

`  `// Подписаться на изменения локального Yjs-документа

`  `// и рассылать их серверу

`  `ydoc.on('update', (update: Uint8Array, origin: any) => {

`    `if (origin === 'remote') return; // не отправлять обратно

`    `socket?.emit('yjs-update', {

`      `room: `project:${projectId}`,

`      `update: Array.from(update)

`    `});

`  `});

}

export function sendCursor(projectId: string, x: number, y: number) {

`  `socket?.emit('cursor-move', { room: `project:${projectId}`, x, y });

}

export function disconnectSocket() {

`  `socket?.disconnect();

`  `socket = null;

}
## **7.3 Синхронизация Yjs с canvas.store**
В EditorPage.tsx подпишись на изменения yElements и обновляй canvas.store:

useEffect(() => {

`  `const observer = () => {

`    `const els = yElements.toArray();

`    `setElements(els);   // обновить Zustand без записи в history

`  `};

`  `yElements.observe(observer);

`  `return () => yElements.unobserve(observer);

}, []);


# **8. Компоненты редактора**
## **8.1 EditorPage.tsx — компоновка**
Страница /editor/:projectId. Структура:

<div className='h-screen flex flex-col'>

`  `<Toolbar projectId={id} />

`  `<div className='flex flex-1 overflow-hidden'>

`    `<ComponentPanel />          {/\* w-64, фиксированная ширина \*/}

`    `<Canvas projectId={id} />   {/\* flex-1, скроллируемый \*/}

`    `<PropertiesPanel />         {/\* w-72, фиксированная ширина \*/}

`  `</div>

</div>
## **8.2 Canvas.tsx — холст с dnd-kit**
Холст принимает drop из ComponentPanel и позволяет перемещать элементы. Используй DndContext + useDrop:

import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

// При drop нового компонента с панели -> addElement()

// При reorder существующих элементов -> updateElement() с новым order

const handleDragEnd = (event: DragEndEvent) => {

`  `const { active, over } = event;

`  `if (!over) return;

`  `if (active.data.current?.type === 'new-component') {

`    `// Создать новый элемент с дефолтными значениями

`    `const el = createDefaultElement(active.data.current.componentType);

`    `addElement(el); // -> Yjs -> сервер -> другие клиенты

`  `}

};

*💡 Каждое изменение canvas.store АВТОМАТИЧЕСКИ обновляет Yjs. Сделай middleware в Zustand или явно обновляй yElements при каждом изменении.*
## **8.3 ComponentPanel.tsx — библиотека компонентов**
Левая панель с перетаскиваемыми элементами. Каждый элемент — Draggable с data.type = 'new-component':

|**Компонент**|**Иконка**|**Дефолтный контент**|
| :- | :- | :- |
|Header|Layout|logoText: 'Logo', navLinks: ['Главная', 'О нас']|
|Hero|Star|title: 'Заголовок', subtitle: 'Подзаголовок', buttonText: 'Начать'|
|Text|Type|text: 'Введите текст здесь'|
|Image|Image|imageUrl: '/placeholder.png'|
|Button|MousePointer|buttonText: 'Кнопка', buttonLink: '#'|
|Card|Square|title: 'Карточка', text: 'Описание', imageUrl: ''|
|Form|Mail|title: 'Свяжитесь с нами'|
|Footer|Minus|text: '© 2025 Мой сайт'|
|Divider|SeparatorHorizontal|(нет контента)|
|Columns|Columns|columns: [[], []]|

## **8.4 PropertiesPanel.tsx — панель свойств**
Правая панель. Отображает настройки для selectedId элемента. Изменения должны вызывать updateElement() немедленно (без кнопки 'Сохранить').

|**Поле**|**Тип input**|**Обновляет**|
| :- | :- | :- |
|Цвет фона|color picker|style.backgroundColor|
|Цвет текста|color picker|style.color|
|Размер шрифта|number (8–96)|style.fontSize|
|Жирность|toggle bold|style.fontWeight|
|Отступы (padding)|text '16px 24px'|style.padding|
|Скругление|number slider|style.borderRadius|
|Толщина рамки|number|style.borderWidth|
|Цвет рамки|color picker|style.borderColor|
|Текстовое содержимое|textarea|content.text / content.title / etc.|
|Изображение|file upload|style.imageUrl (через /api/upload/image)|


# **9. Toolbar — верхняя панель**
Компонент Toolbar.tsx должен содержать:

- Название проекта (кликабельное, можно переименовать inline)
- Кнопка Undo (Ctrl+Z) — вызывает undo() из canvas.store
- Кнопка Redo (Ctrl+Y / Ctrl+Shift+Z) — вызывает redo()
- AvatarList — список аватаров онлайн-участников с цветными кружками
- Кнопка 'Предпросмотр' — открывает /preview/:projectId в новой вкладке
- Кнопка 'Экспорт' — вызывает exportToZip()
- Кнопка 'Пригласить' — открывает модалку с полем email

*💡 Горячие клавиши Undo/Redo вешай через useEffect с window.addEventListener('keydown') в EditorPage.*


# **10. Отображение курсоров участников**
## **10.1 CursorOverlay.tsx**
Компонент поверх холста (position: absolute, pointer-events: none). Получает позиции курсоров из Socket.io и рендерит цветные указатели с именами:

interface Cursor { socketId: string; name: string; color: string; x: number; y: number; }

// Слушать событие 'cursor-move' в socket.ts

// и хранить Map<socketId, Cursor> в локальном state

// Рендер каждого курсора:

<div style={{ position: 'absolute', left: cursor.x, top: cursor.y,

`              `pointerEvents: 'none', zIndex: 9999 }}>

`  `<svg>...</svg>  {/\* иконка курсора цвета cursor.color \*/}

`  `<span style={{ background: cursor.color }}>{cursor.name}</span>

</div>
## **10.2 Отправка своего курсора**
В Canvas.tsx отслеживай onMouseMove и отправляй позицию с debounce 50мс:

const handleMouseMove = useMemo(

`  `() => debounce((e: MouseEvent) => {

`    `const rect = canvasRef.current?.getBoundingClientRect();

`    `if (!rect) return;

`    `sendCursor(projectId, e.clientX - rect.left, e.clientY - rect.top);

`  `}, 50),

`  `[projectId]

);


# **11. Компоненты элементов (src/components/elements/)**
Каждый элемент — React-компонент, принимающий props: element: CanvasElement, selected: boolean, onSelect: () => void. Рендерит визуальное представление на холсте.
## **11.1 Пример: HeroElement.tsx**
import { CanvasElement } from '../../types';

interface Props {

`  `element: CanvasElement;

`  `selected: boolean;

`  `onSelect: () => void;

}

export function HeroElement({ element, selected, onSelect }: Props) {

`  `const { content, style } = element;

`  `return (

`    `<section

`      `onClick={onSelect}

`      `style={{

`        `backgroundColor: style.backgroundColor || '#1D4ED8',

`        `padding: style.padding || '80px 40px',

`        `outline: selected ? '2px solid #6366F1' : 'none',

`        `cursor: 'pointer',

`      `}}

`    `>

`      `<h1 style={{ color: style.color || '#fff', fontSize: style.fontSize || 48 }}>

`        `{content.title || 'Заголовок'}

`      `</h1>

`      `<p>{content.subtitle}</p>

`      `{content.buttonText && <button>{content.buttonText}</button>}

`    `</section>

`  `);

}

*💡 Для всех элементов: применяй style из element.style через inline CSS. Используй дефолтные значения если поле пустое.*


# **12. Предпросмотр и экспорт**
## **12.1 PreviewPage.tsx**
Страница /preview/:projectId загружает проект и рендерит все элементы без панелей редактора. Добавь переключатель ширины:

|**Режим**|**Ширина**|**Иконка**|
| :- | :- | :- |
|Desktop|100%|Monitor|
|Tablet|768px (центрирован)|Tablet|
|Mobile|375px (центрирован)|Smartphone|

## **12.2 src/utils/exportHtml.ts — генерация HTML/CSS**
Функция exportToHtml(elements: CanvasElement[]) должна вернуть объект { html: string, css: string }. Алгоритм:

- Для каждого элемента генерируй семантический HTML-тег (section, header, footer, p, button...)
- Каждый элемент получает уникальный class вида vsb-element-{id}
- CSS-правила для каждого класса генерируй из element.style
- Собери итоговый HTML: <!DOCTYPE html> + <head> с подключением style.css + <body> с элементами

export function exportToHtml(elements: CanvasElement[]) {

`  `let css = '';

`  `let bodyHtml = '';

`  `for (const el of elements) {

`    `const cls = `vsb-element-${el.id.slice(0, 8)}`;

`    `css += `.${cls} {\n`;

`    `if (el.style.backgroundColor) css += `  background-color: ${el.style.backgroundColor};\n`;

`    `if (el.style.color) css += `  color: ${el.style.color};\n`;

`    `if (el.style.padding) css += `  padding: ${el.style.padding};\n`;

`    `// ... остальные стили

`    `css += `}\n`;

`    `bodyHtml += renderElementToHtml(el, cls);

`  `}

`  `const html = `<!DOCTYPE html>\n<html lang='ru'>\n<head>\n

`  `<meta charset='UTF-8'>\n  <link rel='stylesheet' href='style.css'>\n

</head>\n<body>\n${bodyHtml}</body>\n</html>`;

`  `return { html, css };

}
## **12.3 src/utils/zipExport.ts — создание ZIP**
import JSZip from 'jszip';

import { saveAs } from 'file-saver';

import { exportToHtml } from './exportHtml';

import { CanvasElement } from '../types';

export async function exportToZip(

`  `elements: CanvasElement[], projectName: string

) {

`  `const { html, css } = exportToHtml(elements);

`  `const zip = new JSZip();

`  `zip.file('index.html', html);

`  `zip.file('style.css', css);

`  `const blob = await zip.generateAsync({ type: 'blob' });

`  `saveAs(blob, `${projectName}.zip`);

}


# **13. Роутинг и защищённые маршруты**
## **13.1 App.tsx**
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// PrivateRoute: если нет токена — редирект на /login

const PrivateRoute = ({ children }) => {

`  `const token = useAuthStore(s => s.token);

`  `return token ? children : <Navigate to='/login' replace />;

};

<BrowserRouter>

`  `<Routes>

`    `<Route path='/login' element={<LoginPage />} />

`    `<Route path='/register' element={<RegisterPage />} />

`    `<Route path='/dashboard' element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

`    `<Route path='/editor/:projectId' element={<PrivateRoute><EditorPage /></PrivateRoute>} />

`    `<Route path='/preview/:projectId' element={<PrivateRoute><PreviewPage /></PrivateRoute>} />

`    `<Route path='/' element={<Navigate to='/dashboard' replace />} />

`  `</Routes>

</BrowserRouter>


# **14. Страницы (Pages)**

|**Страница**|**Маршрут**|**Что должна делать**|
| :- | :- | :- |
|LoginPage|/login|Форма email + пароль. При успехе -> setAuth() -> /dashboard|
|RegisterPage|/register|Форма name + email + пароль. При успехе -> setAuth() -> /dashboard|
|DashboardPage|/dashboard|Загрузить getProjects(), показать карточки, кнопка создать проект, клик на карточку -> /editor/:id|
|EditorPage|/editor/:id|connectToProject(), инициализировать Yjs, рендерить Canvas + Toolbar + панели|
|PreviewPage|/preview/:id|Загрузить getProject(), рендерить только элементы с переключателем ширины|


# **15. Тест-кейсы для самопроверки**

|**ID**|**Сценарий**|**Ожидаемый результат**|
| :- | :- | :- |
|F-01|Открыть /login, ввести данные нового аккаунта|Редирект на /dashboard|
|F-02|На дашборде нажать 'Создать проект'|Новый проект появился в списке|
|F-03|Зайти в редактор, перетащить Hero на холст|Баннер-блок появился на холсте|
|F-04|Выбрать элемент -> изменить цвет фона в панели|Цвет элемента обновился без перезагрузки|
|F-05|Нажать Ctrl+Z после изменения|Изменение отменено|
|F-06|Открыть тот же проект в двух вкладках, добавить элемент в одной|Элемент появился во второй вкладке < 300ms|
|F-07|Переместить мышь на холсте в одной вкладке|Цветной курсор виден в другой вкладке|
|F-08|Нажать 'Предпросмотр'|Открылась страница /preview с рендером страницы|
|F-09|Переключить режим Mobile в предпросмотре|Холст сузился до 375px|
|F-10|Нажать 'Экспорт'|Скачался .zip с index.html и style.css|

*ТЗ для ИИ-агента Frontend  |  Visual Site Builder  |  2025*
Frontend Agent TZ	

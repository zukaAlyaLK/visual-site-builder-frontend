import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportToHtml } from './exportHtml';
import type { CanvasElement } from '../types';

export async function exportToZip(elements: CanvasElement[], projectName: string) {
  const { html, css } = exportToHtml(elements);
  const zip = new JSZip();
  zip.file('index.html', html);
  zip.file('style.css', css);
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${projectName}.zip`);
}

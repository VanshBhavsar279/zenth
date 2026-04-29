export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeRichHtml(input: string): string {
  if (typeof window === 'undefined') return input;
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');
  const allowedTags = new Set([
    'P',
    'BR',
    'STRONG',
    'B',
    'EM',
    'I',
    'U',
    'UL',
    'OL',
    'LI',
    'A',
    'DIV',
    'SPAN',
  ]);

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (!allowedTags.has(el.tagName)) {
        const text = doc.createTextNode(el.textContent || '');
        el.replaceWith(text);
        return;
      }

      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on') || name === 'style') {
          el.removeAttribute(attr.name);
        }
      });

      if (el.tagName === 'A') {
        const href = el.getAttribute('href') || '';
        const safe = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:');
        if (!safe) {
          el.removeAttribute('href');
        } else {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
        }
      }
    }
    Array.from(node.childNodes).forEach(sanitizeNode);
  };

  sanitizeNode(doc.body);
  return doc.body.innerHTML;
}

export function formatRichText(input: string): string {
  const trimmed = (input || '').trim();
  if (!trimmed) return '';
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  if (hasHtml) return sanitizeRichHtml(trimmed);
  return escapeHtml(trimmed).replace(/\r?\n/g, '<br />');
}


export function plainText(html) {
  if (!html) return '';
  if (typeof DOMParser === 'undefined') return html.replace(/<[^>]+>/g, '');
  return new DOMParser().parseFromString(html, 'text/html').body.textContent || '';
}

export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes >= 0 && minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours >= 0 && hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

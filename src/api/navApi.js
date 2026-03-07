import apiClient from './client';

const toArray = (value) => (Array.isArray(value) ? value : []);

const normalizePath = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('#')) {
    return path;
  }
  return path.startsWith('/') ? path : `/${path}`;
};

const normalizeLink = (link, index, prefix) => {
  const childrenRaw = toArray(link?.children || link?.items || link?.links);
  const path = normalizePath(link?.path || link?.url || link?.href || link?.to);
  const label = link?.label || link?.title || link?.name || `Item ${index + 1}`;

  return {
    id: String(link?.nav_id ?? `${prefix}-${index}`),
    label,
    path,
    external: typeof path === 'string' && /^https?:\/\//i.test(path),
    children: childrenRaw.map((child, childIndex) =>
      normalizeLink(child, childIndex, `${prefix}-${index}`)
    ),
  };
};

const pickNavItems = (payload, section) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.[section])) return payload[section];
  if (Array.isArray(payload?.data?.[section])) return payload.data[section];
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
};

export const getHeaderNav = async () => {
  const payload = await apiClient.get('/nav/header');
  return pickNavItems(payload, 'header').map((item, index) => normalizeLink(item, index, 'header'));
};

export const getFooterNav = async () => {
  const payload = await apiClient.get('/nav/footer');
  console.log(payload)

  return Object.entries(payload.data, 'footer').map(([label,links], index) => ({
    id: `footer-${index}`,
    label: label,
    links: toArray(links).map((item, itemIndex) =>
        normalizeLink(item, itemIndex, `footer-${index}`)
    ),
  }));
};

export default {
  getHeaderNav,
  getFooterNav,
};

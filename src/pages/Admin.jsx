import { useState, useEffect, useRef } from 'react';
import classes from './Admin.module.scss';

const TABS = [
  { id: 'jerseys',  label: 'Jerseys',  multi: true  },
  { id: 'products', label: 'Products', multi: true  },
  { id: 'leagues',  label: 'Leagues',  multi: false },
  { id: 'clubs',    label: 'Clubs',    multi: false },
];

const JERSEY_LABELS  = ['front', 'back', 'side', 'model'];
const PRODUCT_LABELS = ['front', 'back', 'side', 'detail'];

const API = 'http://localhost:5000/api/admin';

const AdminPage = () => {
  const [tab, setTab]           = useState('jerseys');
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(null); // `${id}-${label}`
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all'); // all | missing | done
  const fileRefs = useRef({});

  const currentTab = TABS.find((t) => t.id === tab);
  const labels = tab === 'jerseys' ? JERSEY_LABELS : PRODUCT_LABELS;

  const fetchItems = async (type) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/items?type=${type}`);
      const data = await res.json();
      setItems(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(tab); setSearch(''); setFilter('all'); }, [tab]);

  const handleUpload = async (item, file, label = 'front', sortOrder = 0) => {
    if (!file) return;
    const key = `${item.id}-${label}`;
    setUploading(key);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res  = await fetch(
        `${API}/upload?type=${tab}&id=${item.id}&label=${label}&sort_order=${sortOrder}`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.map((i) => {
          if (i.id !== item.id) return i;
          if (!currentTab.multi) return { ...i, image_url: data.image_url };
          const existing = (i.images || []).filter((img) => img.label !== label);
          return {
            ...i,
            image_url: sortOrder === 0 ? data.image_url : i.image_url,
            images: [...existing, { image_url: data.image_url, label, sort_order: sortOrder }]
              .sort((a, b) => a.sort_order - b.sort_order),
          };
        }));
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (item, imageId) => {
    if (!confirm('Delete this image?')) return;
    try {
      await fetch(`${API}/image/${imageId}?type=${tab}`, { method: 'DELETE' });
      setItems((prev) => prev.map((i) =>
        i.id !== item.id ? i : {
          ...i,
          images: (i.images || []).filter((img) => img.image_id !== imageId),
        }
      ));
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  const filtered = items.filter((i) => {
    const matchSearch = !search ||
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.club_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.league_name?.toLowerCase().includes(search.toLowerCase());

    const hasAnyImage = currentTab.multi
      ? (i.images?.length > 0)
      : !!i.image_url;

    if (filter === 'missing') return matchSearch && !hasAnyImage;
    if (filter === 'done')    return matchSearch && hasAnyImage;
    return matchSearch;
  });

  const totalWithImages = items.filter((i) =>
    currentTab.multi ? i.images?.length > 0 : !!i.image_url
  ).length;

  return (
    <main className={classes.page}>
      <div className={classes.header}>
        <h1>Image Manager</h1>
        <p className={classes.subtitle}>Upload images to Cloudinary · {items.length} items</p>
      </div>

      {/* tabs */}
      <div className={classes.tabs}>
        {TABS.map((t) => (
          <button key={t.id}
            className={`${classes.tab} ${tab === t.id ? classes.tabActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* controls */}
      <div className={classes.controls}>
        <input
          className={classes.search}
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={classes.filters}>
          {['all', 'missing', 'done'].map((f) => (
            <button key={f}
              className={`${classes.filterBtn} ${filter === f ? classes.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* stats */}
      <div className={classes.stats}>
        <span>{filtered.length} shown</span>
        <span className={classes.statDot}>·</span>
        <span className={classes.statGreen}>{totalWithImages} with images</span>
        <span className={classes.statDot}>·</span>
        <span className={classes.statMuted}>{items.length - totalWithImages} missing</span>
      </div>

      {loading ? (
        <div className={classes.loading}>Loading...</div>
      ) : (
        <div className={classes.grid}>
          {filtered.map((item) => (
            <div key={item.id} className={`${classes.card} ${
              (currentTab.multi ? item.images?.length > 0 : item.image_url)
                ? classes.hasImage : classes.missingImage
            }`}>
              <div className={classes.cardHeader}>
                <p className={classes.itemMeta}>
                  {item.club_name || item.brand_name || item.league_name || ''}
                  {item.league_name && item.club_name ? ` · ${item.league_name}` : ''}
                </p>
                <p className={classes.itemName} title={item.name}>{item.name}</p>
                {item.jersey_type && <span className={classes.badge}>{item.jersey_type}</span>}
                {item.subcategory_name && <span className={classes.badge}>{item.subcategory_name}</span>}
              </div>

              {/* SINGLE IMAGE (leagues/clubs) */}
              {!currentTab.multi && (
                <div className={classes.singleUpload}>
                  <div className={classes.preview}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} />
                      : <div className={classes.placeholder}><span>No Image</span></div>
                    }
                    {uploading === `${item.id}-front` && <div className={classes.overlay}><div className={classes.spinner} /></div>}
                  </div>
                  <input
                    ref={(el) => { fileRefs.current[`${item.id}-front`] = el; }}
                    type="file" accept="image/*"
                    className={classes.fileInput}
                    onChange={(e) => handleUpload(item, e.target.files[0], 'front', 0)}
                  />
                  <button
                    className={classes.uploadBtn}
                    onClick={() => fileRefs.current[`${item.id}-front`]?.click()}
                    disabled={!!uploading}
                  >
                    {uploading === `${item.id}-front` ? 'Uploading...' : item.image_url ? '↺ Replace' : '↑ Upload'}
                  </button>
                </div>
              )}

              {/* MULTI IMAGE (jerseys/products) */}
              {currentTab.multi && (
                <div className={classes.multiGrid}>
                  {labels.map((label, idx) => {
                    const existing = item.images?.find((img) => img.label === label);
                    const key = `${item.id}-${label}`;
                    return (
                      <div key={label} className={classes.imageSlot}>
                        <div className={classes.slotLabel}>{label}</div>
                        <div className={classes.slotPreview}>
                          {existing
                            ? <img src={existing.image_url} alt={label} />
                            : <div className={classes.placeholder}><span>+</span></div>
                          }
                          {uploading === key && <div className={classes.overlay}><div className={classes.spinner} /></div>}
                          {existing && (
                            <button
                              className={classes.deleteBtn}
                              onClick={() => handleDelete(item, existing.image_id)}
                              title="Delete"
                            >×</button>
                          )}
                        </div>
                        <input
                          ref={(el) => { fileRefs.current[key] = el; }}
                          type="file" accept="image/*"
                          className={classes.fileInput}
                          onChange={(e) => handleUpload(item, e.target.files[0], label, idx)}
                        />
                        <button
                          className={`${classes.slotBtn} ${existing ? classes.slotReplace : ''}`}
                          onClick={() => fileRefs.current[key]?.click()}
                          disabled={!!uploading}
                        >
                          {uploading === key ? '...' : existing ? '↺' : '↑'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminPage;
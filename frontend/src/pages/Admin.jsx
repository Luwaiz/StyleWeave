import React, { useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from 'firebase/auth';
import { db, auth } from '../firebase';
import './Admin.css';

const CATEGORIES = ['Videography', 'Video Editing', 'Animation'];
const CATEGORY_COLORS = {
  Videography: '#00f2ff',
  'Video Editing': '#7000ff',
  Animation: '#e100ff',
};

const EMPTY_FORM = {
  title: '',
  category: 'Videography',
  description: '',
  tags: '',
  videoUrl: '',
  thumbnailUrl: '',
  accentColor: '#00f2ff',
};

function getAutoThumbnail(url) {
  const yt = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s?]+)/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
  return null;
}

function detectVideoSource(url) {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('drive.google.com')) return 'Google Drive';
  if (url.includes('firebasestorage.googleapis.com')) return 'Device Upload';
  return null;
}

/* ── Login Screen ── */
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <span className="admin-login__dot" />
          Admin
        </div>
        <p className="admin-login__sub">Sign in to manage your portfolio</p>
        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoFocus
            />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button
            type="submit"
            className="admin-btn admin-btn--primary admin-btn--full"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ── Video Form Modal ── */
const VideoFormModal = ({ initial, onSave, onClose, saving }) => {
  const [form, setForm] = useState(
    initial
      ? { ...initial, tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : initial.tags || '' }
      : { ...EMPTY_FORM }
  );

  const autoThumb = getAutoThumbnail(form.videoUrl);
  const source = detectVideoSource(form.videoUrl);

  const set = (field) => (e) => {
    const val = e.target.value;
    if (field === 'category') {
      setForm((f) => ({ ...f, category: val, accentColor: CATEGORY_COLORS[val] || f.accentColor }));
    } else {
      setForm((f) => ({ ...f, [field]: val }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2>{initial ? 'Edit Video' : 'Add Video'}</h2>
          <button className="admin-modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal__form">
          <div className="admin-form-grid">
            {/* Title */}
            <div className="admin-field admin-field--full">
              <label>Title *</label>
              <input
                value={form.title}
                onChange={set('title')}
                required
                placeholder="e.g. Cinematic Brand Film"
              />
            </div>

            {/* Category */}
            <div className="admin-field">
              <label>Category *</label>
              <select value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Accent color */}
            <div className="admin-field">
              <label>Accent Color</label>
              <div className="admin-color-row">
                <input type="color" value={form.accentColor} onChange={set('accentColor')} />
                <span>{form.accentColor}</span>
              </div>
            </div>

            {/* Video URL */}
            <div className="admin-field admin-field--full">
              <label>
                Video URL *
                {source && <span className="admin-badge">{source}</span>}
              </label>
              <input
                value={form.videoUrl}
                onChange={set('videoUrl')}
                required
                placeholder="Paste a YouTube or Google Drive link"
              />
            </div>

            {/* Thumbnail */}
            <div className="admin-field admin-field--full">
              <label>
                Thumbnail URL
                {autoThumb && !form.thumbnailUrl && (
                  <span className="admin-badge admin-badge--green">Auto from YouTube</span>
                )}
              </label>
              {autoThumb && !form.thumbnailUrl && (
                <div className="admin-thumb-preview">
                  <img src={autoThumb} alt="auto thumbnail" />
                  <p>YouTube thumbnail auto-detected — no need to add one manually.</p>
                </div>
              )}
              {form.thumbnailUrl && (
                <div className="admin-thumb-preview">
                  <img src={form.thumbnailUrl} alt="thumbnail preview" />
                </div>
              )}
              <input
                value={form.thumbnailUrl}
                onChange={set('thumbnailUrl')}
                placeholder="https://… (optional, auto-extracted for YouTube)"
              />
            </div>

            {/* Description */}
            <div className="admin-field admin-field--full">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={set('description')}
                placeholder="Short description of the project…"
                rows={3}
              />
            </div>

            {/* Tags */}
            <div className="admin-field admin-field--full">
              <label>Tags <span className="admin-hint-inline">(comma-separated)</span></label>
              <input
                value={form.tags}
                onChange={set('tags')}
                placeholder="4K, Color Grade, Brand"
              />
            </div>
          </div>

          <div className="admin-modal__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? 'Saving…' : (initial ? 'Save Changes' : 'Add Video')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Video Row Item ── */
const VideoItem = ({ video, onEdit, onDelete }) => {
  const accent = video.accentColor || CATEGORY_COLORS[video.category] || '#00f2ff';
  const thumb = video.thumbnailUrl || getAutoThumbnail(video.videoUrl);

  return (
    <div className="admin-video-item">
      <div className="admin-video-item__bar" style={{ background: accent }} />
      {thumb && (
        <div className="admin-video-item__thumb">
          <img src={thumb} alt={video.title} />
        </div>
      )}
      <div className="admin-video-item__info">
        <p className="admin-video-item__title">{video.title}</p>
        <p className="admin-video-item__meta">
          <span style={{ color: accent }}>{video.category}</span>
          {video.tags?.length > 0 && ` · ${video.tags.join(', ')}`}
        </p>
        {video.videoUrl && (
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="admin-video-item__link"
          >
            {video.videoUrl.length > 55 ? `${video.videoUrl.slice(0, 55)}…` : video.videoUrl}
          </a>
        )}
      </div>
      <div className="admin-video-item__actions">
        <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => onEdit(video)}>
          Edit
        </button>
        <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => onDelete(video)}>
          Delete
        </button>
      </div>
    </div>
  );
};

/* ── Dashboard ── */
const Dashboard = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('chidera_portfolio_videos');
  const [formOpen, setFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'chidera_portfolio_videos'), (snap) => {
      setVideos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editingVideo) {
        await updateDoc(doc(db, 'chidera_portfolio_videos', editingVideo.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'chidera_portfolio_videos'), {
          ...formData,
          createdAt: serverTimestamp(),
        });
      }
      setFormOpen(false);
      setEditingVideo(null);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormOpen(true);
  };

  const handleDelete = async (video) => {
    if (!window.confirm(`Delete "${video.title}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, 'chidera_portfolio_videos', video.id));
  };

  const displayed = filterCat === 'All'
    ? videos
    : videos.filter((v) => v.category === filterCat);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header__left">
          <span className="admin-header__dot" />
          <h1 className="admin-header__title">Admin</h1>
        </div>
        <div className="admin-header__right">
          <span className="admin-header__email">{user.email}</span>
          <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => signOut(auth)}>
            Sign Out
          </button>
        </div>
      </header>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'chidera_portfolio_videos' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('chidera_portfolio_videos')}
        >
          Videos <span className="admin-tab__count">{videos.length}</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'settings' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Site Settings
        </button>
      </div>

      <main className="admin-main">
        {activeTab === 'chidera_portfolio_videos' && (
          <>
            <div className="admin-toolbar">
              <div className="admin-filters">
                {['All', ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    className={`admin-filter-btn ${filterCat === cat ? 'admin-filter-btn--active' : ''}`}
                    onClick={() => setFilterCat(cat)}
                    style={
                      filterCat === cat && cat !== 'All'
                        ? { borderColor: CATEGORY_COLORS[cat], color: CATEGORY_COLORS[cat] }
                        : {}
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button className="admin-btn admin-btn--primary" onClick={() => { setEditingVideo(null); setFormOpen(true); }}>
                + Add Video
              </button>
            </div>

            {displayed.length === 0 ? (
              <div className="admin-empty-state">
                <p>No videos yet.</p>
                <button className="admin-btn admin-btn--primary" onClick={() => { setEditingVideo(null); setFormOpen(true); }}>
                  Add your first video
                </button>
              </div>
            ) : (
              <div className="admin-video-list">
                {displayed.map((v) => (
                  <VideoItem key={v.id} video={v} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'settings' && (
          <div className="admin-settings">
            <div className="admin-settings__card">
              <h3>Site Settings</h3>
              <p>
                Hero text, stats, and other site-wide content editing is coming soon.
                Your videos above are live on the site immediately after saving.
              </p>
            </div>
          </div>
        )}
      </main>

      {formOpen && (
        <VideoFormModal
          initial={editingVideo}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditingVideo(null); }}
          saving={saving}
        />
      )}
    </div>
  );
};

/* ── Admin (root export) ── */
const Admin = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  if (authLoading) {
    return <div className="admin-splash"><span className="admin-splash__dot" /></div>;
  }

  return user ? <Dashboard user={user} /> : <LoginScreen />;
};

export default Admin;

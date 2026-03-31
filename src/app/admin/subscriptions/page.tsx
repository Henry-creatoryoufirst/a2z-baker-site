'use client'

import { useEffect, useState } from 'react'
import { Plus, Users, TrendingUp, ToggleLeft, ToggleRight, Trash2, Pencil, Download, Image, X, Repeat } from 'lucide-react'
import type { SubscriptionClub, SubscriptionSignup } from '@/lib/types'
import PageHeader from '@/components/admin/PageHeader'

const FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 Weeks' },
  { value: 'monthly', label: 'Monthly' },
]

export default function AdminSubscriptions() {
  const [clubs, setClubs] = useState<SubscriptionClub[]>([])
  const [signups, setSignups] = useState<SubscriptionSignup[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClub, setEditingClub] = useState<SubscriptionClub | null>(null)
  const [viewSignupsFor, setViewSignupsFor] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formFreq, setFormFreq] = useState('monthly')
  const [formItems, setFormItems] = useState('')
  const [formImageUrl, setFormImageUrl] = useState('')
  const [saving, setSaving] = useState(false)

  async function fetchData() {
    const [clubsRes, signupsRes] = await Promise.all([
      fetch('/api/subscriptions').then(r => r.json()),
      fetch('/api/subscriptions/signup').then(r => r.json()),
    ])
    setClubs(Array.isArray(clubsRes) ? clubsRes : [])
    setSignups(Array.isArray(signupsRes) ? signupsRes : [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() {
    setFormName(''); setFormDesc(''); setFormPrice(''); setFormFreq('monthly')
    setFormItems(''); setFormImageUrl(''); setEditingClub(null); setShowForm(false)
  }

  function openEdit(club: SubscriptionClub) {
    setFormName(club.name); setFormDesc(club.description); setFormPrice(String(club.price))
    setFormFreq(club.frequency); setFormItems(club.items.join(', '))
    setFormImageUrl(club.image_url || ''); setEditingClub(club); setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const body = {
      name: formName, description: formDesc, price: Number(formPrice),
      frequency: formFreq, items: formItems.split(',').map(s => s.trim()).filter(Boolean),
      image_url: formImageUrl || null,
    }
    if (editingClub) {
      await fetch('/api/subscriptions', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingClub.id, ...body }) })
    } else {
      await fetch('/api/subscriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    setSaving(false); resetForm(); fetchData()
  }

  async function toggleActive(club: SubscriptionClub) {
    await fetch('/api/subscriptions', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: club.id, active: !club.active }) })
    fetchData()
  }

  async function deleteClub(id: string) {
    await fetch(`/api/subscriptions?id=${id}`, { method: 'DELETE' })
    setDeleteConfirm(null); fetchData()
  }

  function exportCSV(clubId: string, clubName: string) {
    const clubSignupsList = signups.filter(s => s.club_id === clubId)
    if (!clubSignupsList.length) return
    const csv = ['Name,Email,Phone,Date'].concat(
      clubSignupsList.map(s => `"${s.name}","${s.email}","${s.phone || ''}","${new Date(s.created_at).toLocaleDateString()}"`)
    ).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${clubName.replace(/\s+/g, '-').toLowerCase()}-signups.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  const clubSignups = (clubId: string) => signups.filter(s => s.club_id === clubId)
  const totalSignups = signups.length
  const activeClubs = clubs.filter(c => c.active).length

  if (loading) {
    return (
      <div>
        <PageHeader title="Subscription Clubs" subtitle="Loading..." />
        <div className="skeleton-grid">
          {[1,2].map(i => <div key={i} className="skeleton-card" />)}
        </div>
        <style jsx>{`
          .skeleton-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .skeleton-card { height: 240px; background: linear-gradient(90deg, #f0ebe5 25%, #e8e2db 50%, #f0ebe5 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 16px; }
          @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
      </div>
    )
  }

  return (
    <div className="subs-admin">
      <PageHeader
        title="Subscription Clubs"
        subtitle={`${clubs.length} clubs · ${totalSignups} signups`}
        actions={
          <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-new">
            <Plus size={18} /> New Club
          </button>
        }
      />

      {/* Stats */}
      <div className="stats-row">
        <div className="mini-stat">
          <div className="mini-icon active-icon"><Repeat size={18} /></div>
          <div className="mini-value">{activeClubs}</div>
          <div className="mini-label">Active Clubs</div>
        </div>
        <div className="mini-stat">
          <div className="mini-icon users-icon"><Users size={18} /></div>
          <div className="mini-value">{totalSignups}</div>
          <div className="mini-label">Total Signups</div>
        </div>
        <div className="mini-stat">
          <div className="mini-icon trend-icon"><TrendingUp size={18} /></div>
          <div className="mini-value">{clubs.length}</div>
          <div className="mini-label">All Clubs</div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="form-overlay" onClick={resetForm}>
          <div className="form-modal" onClick={e => e.stopPropagation()}>
            <div className="form-header">
              <h3>{editingClub ? 'Edit Club' : 'Create New Club'}</h3>
              <button onClick={resetForm} className="form-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Club Name</label>
                  <input value={formName} onChange={e => setFormName(e.target.value)} required placeholder="e.g., Muffin of the Month" />
                </div>
                <div className="form-field">
                  <label>Price ($)</label>
                  <input type="number" step="0.01" value={formPrice} onChange={e => setFormPrice(e.target.value)} required placeholder="24.99" />
                </div>
                <div className="form-field">
                  <label>Frequency</label>
                  <select value={formFreq} onChange={e => setFormFreq(e.target.value)}>
                    {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div className="form-field full">
                  <label>Description</label>
                  <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} required placeholder="Tell customers what they'll get..." rows={3} />
                </div>
                <div className="form-field full">
                  <label>Items Included (comma-separated)</label>
                  <input value={formItems} onChange={e => setFormItems(e.target.value)} placeholder="6 muffins, recipe card, surprise flavor" />
                </div>
                <div className="form-field full">
                  <label>Cover Image URL (optional)</label>
                  <div className="image-input-row">
                    <input value={formImageUrl} onChange={e => setFormImageUrl(e.target.value)} placeholder="https://..." />
                    {formImageUrl && (
                      <div className="image-preview">
                        <img src={formImageUrl} alt="Preview" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Saving...' : editingClub ? 'Update Club' : 'Create Club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Club Cards */}
      <div className="clubs-grid">
        {clubs.length === 0 && !showForm ? (
          <div className="empty-state">
            <Repeat size={48} strokeWidth={1} />
            <h3>No subscription clubs yet</h3>
            <p>Create your first club to start collecting signups!</p>
            <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-new">
              <Plus size={18} /> Create First Club
            </button>
          </div>
        ) : (
          clubs.map((club, i) => (
            <div key={club.id} className="club-card" style={{ animationDelay: `${i * 80}ms` }}>
              {club.image_url && (
                <div className="club-image">
                  <img src={club.image_url} alt={club.name} />
                  {!club.active && <div className="inactive-overlay">Inactive</div>}
                </div>
              )}
              {!club.image_url && (
                <div className="club-image placeholder-img">
                  <Image size={32} strokeWidth={1} />
                  {!club.active && <div className="inactive-overlay">Inactive</div>}
                </div>
              )}

              <div className="club-content">
                <div className="club-top">
                  <h4>{club.name}</h4>
                  <button onClick={() => toggleActive(club)} className="toggle-btn" title={club.active ? 'Deactivate' : 'Activate'}>
                    {club.active ? <ToggleRight size={28} className="toggle-on" /> : <ToggleLeft size={28} className="toggle-off" />}
                  </button>
                </div>

                <div className="club-price">
                  <span className="price-amount">${club.price}</span>
                  <span className="price-freq">/ {club.frequency}</span>
                </div>

                <p className="club-desc">{club.description}</p>

                {club.items.length > 0 && (
                  <div className="club-items">
                    {club.items.map((item, j) => (
                      <span key={j} className="item-tag">{item}</span>
                    ))}
                  </div>
                )}

                <div className="club-stats-row">
                  <span className="club-stat"><Users size={14} /> {clubSignups(club.id).length} signups</span>
                </div>

                <div className="club-actions">
                  <button onClick={() => openEdit(club)} className="action-btn"><Pencil size={14} /> Edit</button>
                  <button onClick={() => setViewSignupsFor(viewSignupsFor === club.id ? null : club.id)} className="action-btn">
                    <Users size={14} /> Signups
                  </button>
                  {clubSignups(club.id).length > 0 && (
                    <button onClick={() => exportCSV(club.id, club.name)} className="action-btn"><Download size={14} /> CSV</button>
                  )}
                  {deleteConfirm === club.id ? (
                    <div className="delete-inline">
                      <button onClick={() => deleteClub(club.id)} className="btn-confirm-delete">Delete</button>
                      <button onClick={() => setDeleteConfirm(null)} className="btn-cancel-delete">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(club.id)} className="action-btn delete-action"><Trash2 size={14} /></button>
                  )}
                </div>

                {viewSignupsFor === club.id && (
                  <div className="signups-section">
                    <h5>Signups ({clubSignups(club.id).length})</h5>
                    {clubSignups(club.id).length === 0 ? (
                      <p className="no-signups">No signups yet</p>
                    ) : (
                      <div className="signups-list">
                        {clubSignups(club.id).map(s => (
                          <div key={s.id} className="signup-row">
                            <div className="signup-avatar">{s.name.charAt(0).toUpperCase()}</div>
                            <div className="signup-info">
                              <strong>{s.name}</strong>
                              <span>{s.email}</span>
                            </div>
                            <span className="signup-date">{new Date(s.created_at).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .subs-admin { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .btn-new {
          display: flex; align-items: center; gap: 8px; padding: 10px 20px;
          background: #C4907C; color: white; border: none; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-new:hover { background: #3D2B1F; transform: translateY(-1px); }

        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
        .mini-stat {
          background: white; border-radius: 14px; padding: 18px; text-align: center;
          box-shadow: 0 1px 3px rgba(61,43,31,0.04); border: 1px solid rgba(61,43,31,0.06);
        }
        .mini-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
        .active-icon { background: rgba(16,185,129,0.1); color: #10b981; }
        .users-icon { background: rgba(196,144,124,0.1); color: #C4907C; }
        .trend-icon { background: rgba(201,169,110,0.1); color: #C9A96E; }
        .mini-value { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: #3D2B1F; }
        .mini-label { font-size: 0.75rem; color: #5a4638; margin-top: 2px; }

        /* Form Modal */
        .form-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
          z-index: 300; display: flex; align-items: center; justify-content: center; padding: 24px;
        }
        .form-modal {
          background: white; border-radius: 20px; padding: 32px; max-width: 560px; width: 100%;
          max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 60px rgba(0,0,0,0.2);
        }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .form-header h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: #3D2B1F; }
        .form-close { background: none; border: none; color: #999; cursor: pointer; padding: 4px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-field.full { grid-column: 1 / -1; }
        .form-field label {
          display: block; font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: rgba(61,43,31,0.6); margin-bottom: 6px;
        }
        .form-field input, .form-field textarea, .form-field select {
          width: 100%; padding: 12px 14px; border: 1.5px solid rgba(61,43,31,0.1); border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 0.9rem; background: #FBF7F2; color: #3D2B1F;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-field input:focus, .form-field textarea:focus, .form-field select:focus {
          outline: none; border-color: #C4907C; box-shadow: 0 0 0 3px rgba(196,144,124,0.12);
        }
        .form-field textarea { resize: vertical; }
        .image-input-row { display: flex; gap: 12px; align-items: flex-start; }
        .image-input-row input { flex: 1; }
        .image-preview { width: 60px; height: 60px; border-radius: 8px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(61,43,31,0.1); }
        .image-preview img { width: 100%; height: 100%; object-fit: cover; }
        .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
        .btn-cancel { padding: 10px 20px; background: #f5f0eb; border: none; border-radius: 10px; cursor: pointer; font-family: 'Outfit', sans-serif; color: #5a4638; font-size: 0.9rem; }
        .btn-save { padding: 10px 24px; background: #C4907C; color: white; border: none; border-radius: 10px; cursor: pointer; font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 0.9rem; transition: background 0.2s; }
        .btn-save:hover { background: #3D2B1F; }
        .btn-save:disabled { opacity: 0.6; }

        /* Club Cards */
        .clubs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .club-card {
          background: white; border-radius: 16px; overflow: hidden;
          box-shadow: 0 1px 3px rgba(61,43,31,0.04); border: 1px solid rgba(61,43,31,0.06);
          animation: cardIn 0.4s ease forwards; opacity: 0;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .club-card:hover { box-shadow: 0 8px 24px rgba(61,43,31,0.08); transform: translateY(-2px); }

        .club-image { height: 160px; overflow: hidden; position: relative; }
        .club-image img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder-img {
          background: linear-gradient(135deg, #f0ebe5, #e8e2db);
          display: flex; align-items: center; justify-content: center; color: #ccc;
        }
        .inactive-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;
        }

        .club-content { padding: 20px; }
        .club-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .club-top h4 { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; color: #3D2B1F; }
        .toggle-btn { background: none; border: none; cursor: pointer; padding: 2px; }
        :global(.toggle-on) { color: #10b981; }
        :global(.toggle-off) { color: #ccc; }

        .club-price { margin-bottom: 10px; }
        .price-amount { font-size: 1.3rem; font-weight: 600; color: #C4907C; }
        .price-freq { font-size: 0.85rem; color: #5a4638; }
        .club-desc { font-size: 0.88rem; color: #5a4638; line-height: 1.6; margin-bottom: 12px; }

        .club-items { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
        .item-tag { padding: 4px 10px; background: #FBF7F2; border-radius: 20px; font-size: 0.75rem; color: #5a4638; border: 1px solid rgba(61,43,31,0.06); }

        .club-stats-row { display: flex; gap: 16px; margin-bottom: 14px; }
        .club-stat { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #5a4638; }

        .club-actions { display: flex; gap: 6px; flex-wrap: wrap; padding-top: 14px; border-top: 1px solid rgba(61,43,31,0.06); }
        .action-btn {
          display: flex; align-items: center; gap: 5px; padding: 6px 12px;
          background: #f8f5f1; border: 1px solid rgba(61,43,31,0.06); border-radius: 8px;
          font-size: 0.78rem; cursor: pointer; color: #5a4638; font-family: 'Outfit', sans-serif; transition: all 0.2s;
        }
        .action-btn:hover { background: #f0ebe5; }
        .delete-action { color: #ef4444; }
        .delete-action:hover { background: #fef2f2; border-color: rgba(239,68,68,0.15); }

        .delete-inline { display: flex; gap: 4px; }
        .btn-confirm-delete { padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 8px; font-size: 0.78rem; cursor: pointer; font-family: 'Outfit', sans-serif; }
        .btn-cancel-delete { padding: 6px 12px; background: #f5f0eb; color: #5a4638; border: none; border-radius: 8px; font-size: 0.78rem; cursor: pointer; font-family: 'Outfit', sans-serif; }

        .signups-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(61,43,31,0.06); }
        .signups-section h5 { font-family: 'Cormorant Garamond', serif; font-size: 1rem; color: #3D2B1F; margin-bottom: 12px; }
        .signups-list { display: flex; flex-direction: column; gap: 8px; }
        .signup-row {
          display: flex; align-items: center; gap: 12px; padding: 10px;
          background: #FBF7F2; border-radius: 10px;
        }
        .signup-avatar {
          width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #C4907C, #C9A96E);
          color: white; display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif; font-size: 0.85rem; font-weight: 600; flex-shrink: 0;
        }
        .signup-info { flex: 1; }
        .signup-info strong { display: block; font-size: 0.85rem; color: #3D2B1F; }
        .signup-info span { font-size: 0.78rem; color: #5a4638; }
        .signup-date { font-size: 0.75rem; color: #999; }
        .no-signups { font-size: 0.85rem; color: #999; text-align: center; padding: 12px; }

        .empty-state {
          grid-column: 1 / -1; text-align: center; padding: 60px 24px; color: #ccc;
          background: white; border-radius: 16px; border: 2px dashed rgba(61,43,31,0.1);
        }
        .empty-state h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: #3D2B1F; margin: 16px 0 8px; }
        .empty-state p { font-size: 0.9rem; color: #5a4638; margin-bottom: 20px; }

        @media (max-width: 768px) {
          .stats-row { grid-template-columns: 1fr; }
          .clubs-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}

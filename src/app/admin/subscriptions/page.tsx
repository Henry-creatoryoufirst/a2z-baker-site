'use client'

import { useEffect, useState } from 'react'
import type { SubscriptionClub, SubscriptionSignup } from '@/lib/types'

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

  // Form state
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formFreq, setFormFreq] = useState<string>('monthly')
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
    setFormName('')
    setFormDesc('')
    setFormPrice('')
    setFormFreq('monthly')
    setFormItems('')
    setFormImageUrl('')
    setEditingClub(null)
    setShowForm(false)
  }

  function openEdit(club: SubscriptionClub) {
    setFormName(club.name)
    setFormDesc(club.description)
    setFormPrice(String(club.price))
    setFormFreq(club.frequency)
    setFormItems(club.items.join(', '))
    setFormImageUrl(club.image_url || '')
    setEditingClub(club)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const body = {
      name: formName,
      description: formDesc,
      price: Number(formPrice),
      frequency: formFreq,
      items: formItems.split(',').map(s => s.trim()).filter(Boolean),
      image_url: formImageUrl || null,
    }

    if (editingClub) {
      await fetch('/api/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingClub.id, ...body }),
      })
    } else {
      await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }

    setSaving(false)
    resetForm()
    fetchData()
  }

  async function toggleActive(club: SubscriptionClub) {
    await fetch('/api/subscriptions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: club.id, active: !club.active }),
    })
    fetchData()
  }

  async function deleteClub(id: string) {
    if (!confirm('Delete this subscription club? This cannot be undone.')) return
    await fetch(`/api/subscriptions?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  const clubSignups = (clubId: string) => signups.filter(s => s.club_id === clubId)

  if (loading) return <div className="admin-loading">Loading subscriptions...</div>

  return (
    <div>
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-title">Subscription Clubs</h1>
          <p className="admin-page-subtitle">{clubs.length} clubs &middot; {signups.length} total signups</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-create">
          + New Club
        </button>
      </div>

      {showForm && (
        <div className="club-form-card">
          <h3>{editingClub ? 'Edit Club' : 'Create New Club'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label>Club Name</label>
                <input value={formName} onChange={e => setFormName(e.target.value)} required placeholder="e.g., Muffin of the Month" />
              </div>
              <div className="form-field">
                <label>Price</label>
                <input type="number" step="0.01" value={formPrice} onChange={e => setFormPrice(e.target.value)} required placeholder="24.99" />
              </div>
              <div className="form-field">
                <label>Frequency</label>
                <select value={formFreq} onChange={e => setFormFreq(e.target.value)}>
                  {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} required placeholder="What members get, why it's great..." rows={3} />
            </div>
            <div className="form-row">
              <div className="form-field" style={{ flex: 1 }}>
                <label>Items Included (comma-separated)</label>
                <input value={formItems} onChange={e => setFormItems(e.target.value)} placeholder="6 muffins, recipe card, surprise flavor" />
              </div>
              <div className="form-field" style={{ flex: 1 }}>
                <label>Image URL (optional)</label>
                <input value={formImageUrl} onChange={e => setFormImageUrl(e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div className="form-buttons">
              <button type="button" onClick={resetForm} className="btn-cancel">Cancel</button>
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? 'Saving...' : editingClub ? 'Update Club' : 'Create Club'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="clubs-list">
        {clubs.length === 0 && !showForm ? (
          <div className="admin-empty-state">
            No subscription clubs yet. Create your first one to start collecting signups!
          </div>
        ) : (
          clubs.map(club => (
            <div key={club.id} className="club-card">
              <div className="club-header">
                <div className="club-info">
                  <h4>{club.name}</h4>
                  <span className="club-meta">
                    ${club.price} / {club.frequency} &middot; {clubSignups(club.id).length} signups
                  </span>
                </div>
                <div className="club-actions">
                  <span className={`club-status ${club.active ? 'active' : 'inactive'}`}>
                    {club.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <p className="club-desc">{club.description}</p>
              {club.items.length > 0 && (
                <div className="club-items">
                  {club.items.map((item, i) => (
                    <span key={i} className="club-item-tag">{item}</span>
                  ))}
                </div>
              )}
              <div className="club-footer">
                <div className="club-footer-actions">
                  <button onClick={() => openEdit(club)} className="btn-edit">Edit</button>
                  <button onClick={() => toggleActive(club)} className="btn-toggle">
                    {club.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => setViewSignupsFor(viewSignupsFor === club.id ? null : club.id)} className="btn-edit">
                    {viewSignupsFor === club.id ? 'Hide' : 'View'} Signups ({clubSignups(club.id).length})
                  </button>
                  <button onClick={() => deleteClub(club.id)} className="btn-delete-sm">Delete</button>
                </div>
              </div>

              {viewSignupsFor === club.id && (
                <div className="signups-table">
                  {clubSignups(club.id).length === 0 ? (
                    <p className="no-signups">No signups yet for this club.</p>
                  ) : (
                    <table>
                      <thead>
                        <tr><th>Name</th><th>Email</th><th>Phone</th><th>Date</th></tr>
                      </thead>
                      <tbody>
                        {clubSignups(club.id).map(s => (
                          <tr key={s.id}>
                            <td>{s.name}</td>
                            <td>{s.email}</td>
                            <td>{s.phone || '—'}</td>
                            <td>{new Date(s.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .admin-page-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; color: #3D2B1F; margin-bottom: 4px; }
        .admin-page-subtitle { color: #5a4638; font-size: 0.95rem; }
        .admin-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .btn-create {
          padding: 10px 20px; background: #C4907C; color: white; border: none; border-radius: 8px;
          font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: background 0.2s;
        }
        .btn-create:hover { background: #3D2B1F; }
        .club-form-card {
          background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px;
          box-shadow: 0 2px 12px rgba(61,43,31,0.06); border: 2px solid #C4907C;
        }
        .club-form-card h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; color: #3D2B1F; margin-bottom: 16px; }
        .form-row { display: flex; gap: 16px; margin-bottom: 16px; }
        .form-field { flex: 1; }
        .form-field label { display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #C4907C; margin-bottom: 4px; }
        .form-field input, .form-field textarea, .form-field select {
          width: 100%; padding: 10px 12px; border: 1px solid rgba(61,43,31,0.15); border-radius: 6px;
          font-family: 'Outfit', sans-serif; font-size: 0.9rem; background: #FBF7F2; color: #3D2B1F;
        }
        .form-field textarea { resize: vertical; }
        .form-buttons { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
        .btn-cancel { padding: 8px 16px; background: #f5f0eb; border: none; border-radius: 6px; cursor: pointer; font-family: 'Outfit', sans-serif; color: #5a4638; }
        .btn-save { padding: 8px 20px; background: #C4907C; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: 'Outfit', sans-serif; font-weight: 500; }
        .btn-save:disabled { opacity: 0.6; }
        .clubs-list { display: flex; flex-direction: column; gap: 16px; }
        .club-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 12px rgba(61,43,31,0.06); }
        .club-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .club-info h4 { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; color: #3D2B1F; }
        .club-meta { font-size: 0.85rem; color: #5a4638; }
        .club-status { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .club-status.active { background: #d1fae5; color: #065f46; }
        .club-status.inactive { background: #f5f0eb; color: #999; }
        .club-desc { color: #5a4638; font-size: 0.9rem; line-height: 1.5; margin-bottom: 12px; }
        .club-items { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
        .club-item-tag { padding: 4px 10px; background: #FBF7F2; border-radius: 20px; font-size: 0.8rem; color: #5a4638; border: 1px solid rgba(61,43,31,0.08); }
        .club-footer { border-top: 1px solid rgba(61,43,31,0.06); padding-top: 12px; }
        .club-footer-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn-edit { padding: 6px 12px; background: #f5f0eb; border: none; border-radius: 6px; font-size: 0.8rem; cursor: pointer; color: #5a4638; font-family: 'Outfit', sans-serif; }
        .btn-edit:hover { background: #ebe5de; }
        .btn-toggle { padding: 6px 12px; background: #dbeafe; border: none; border-radius: 6px; font-size: 0.8rem; cursor: pointer; color: #1e40af; font-family: 'Outfit', sans-serif; }
        .btn-delete-sm { padding: 6px 12px; background: #fef2f2; border: none; border-radius: 6px; font-size: 0.8rem; cursor: pointer; color: #991b1b; font-family: 'Outfit', sans-serif; }
        .signups-table { margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(61,43,31,0.06); }
        .signups-table table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .signups-table th { text-align: left; padding: 8px; color: #C4907C; font-weight: 600; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em; border-bottom: 1px solid rgba(61,43,31,0.08); }
        .signups-table td { padding: 8px; color: #3D2B1F; border-bottom: 1px solid rgba(61,43,31,0.04); }
        .no-signups { text-align: center; color: #999; font-size: 0.85rem; padding: 12px; }
        .admin-empty-state { text-align: center; padding: 48px; color: #999; background: white; border-radius: 12px; }
        .admin-loading { display: flex; align-items: center; justify-content: center; min-height: 400px; color: #5a4638; }
        @media (max-width: 768px) {
          .admin-header-row { flex-direction: column; gap: 12px; }
          .form-row { flex-direction: column; }
        }
      `}</style>
    </div>
  )
}

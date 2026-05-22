import React, { useState } from 'react';

export default function EventFormModal({ event, onSave, onClose, styles }) {
  const [form, setForm] = useState({
    title: '', description: '', shortDesc: '', date: '', time: '', location: '', capacity: 100, category: 'Conference', organizer: '', ...event,
  });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.title || !form.date || !form.location) return alert('Please fill in all required fields.');
    onSave({ ...form, capacity: parseInt(form.capacity) || 100 });
  };
  const categories = ['Conference', 'Workshop', 'Summit', 'Bootcamp', 'Seminar', 'Networking'];
  return (
    <div style={styles.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modalBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{event ? 'Edit Event' : 'Create New Event'}</h2>
          <button style={{ ...styles.btn('ghost'), padding: '4px 10px' }} onClick={onClose}>✕</button>
        </div>
        {[['Event Title *', 'title', 'text'], ['Short Description', 'shortDesc', 'text'], ['Organizer', 'organizer', 'text'], ['Location *', 'location', 'text']].map(([label, key, type]) => (
          <div key={key} style={styles.formGroup}>
            <label style={styles.label}>{label}</label>
            <input style={styles.formInput} type={type} value={form[key] || ''} onChange={e => update(key, e.target.value)} />
          </div>
        ))}
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Description</label>
          <textarea style={{ ...styles.formInput, minHeight: 80, resize: 'vertical' }} value={form.description || ''} onChange={e => update('description', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date *</label>
            <input style={styles.formInput} type="date" value={form.date || ''} onChange={e => update('date', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Time</label>
            <input style={styles.formInput} type="time" value={form.time || ''} onChange={e => update('time', e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select style={styles.formInput} value={form.category || 'Conference'} onChange={e => update('category', e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Capacity</label>
            <input style={styles.formInput} type="number" min="1" value={form.capacity || 100} onChange={e => update('capacity', e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button style={styles.btn('ghost')} onClick={onClose}>Cancel</button>
          <button style={styles.btn('primary')} onClick={submit}>{event ? 'Save Changes' : 'Create Event'}</button>
        </div>
      </div>
    </div>
  );
}

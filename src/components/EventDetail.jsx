import React from 'react';
import { formatDate, formatTime, seatsLeft, seatsPercent, categoryColor } from '../utils.js';

export default function EventDetail({ ev, isRegistered, registerForEvent, styles, onBack }) {
  const pct = seatsPercent(ev);
  const left = seatsLeft(ev);
  const alreadyReg = isRegistered(ev.id);
  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <button style={{ ...styles.btn('ghost'), marginBottom: '1.5rem', paddingLeft: 0 }} onClick={onBack}>← Back to Events</button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
          <div>
            <div style={{ height: 8, background: ev.color || '#3b82f6', borderRadius: '8px 8px 0 0' }} />
            <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <span style={styles.badge(categoryColor[ev.category] || '#3b82f6')}>{ev.category}</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: '1rem' }}>{ev.title}</h1>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: '1.5rem' }}>{ev.description}</p>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: '1rem' }}>Event Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {
                  [['📅', 'Date', formatDate(ev.date)], ['🕐', 'Time', formatTime(ev.time)], ['📍', 'Location', ev.location], ['🏢', 'Organizer', ev.organizer]].map(([icon, label, value]) => (
                    <div key={label} style={{ background: '#0d1526', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{icon} {label}</div>
                      <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 500 }}>{value}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: 12, padding: '1.5rem', position: 'sticky', top: '1rem' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: '1rem' }}>Registration</h3>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                <span>{ev.registered} / {ev.capacity} registered</span>
                <span style={{ color: left === 0 ? '#ef4444' : left < 10 ? '#f59e0b' : '#10b981' }}>{left === 0 ? 'Full' : `${left} left`}</span>
              </div>
              <div style={styles.progressBar(pct)}>
                <div style={styles.progressFill(pct)} />
              </div>
            </div>
            {alreadyReg ? (
              <div style={{ textAlign: 'center', padding: '1rem', background: '#10b98115', border: '1px solid #10b98133', borderRadius: 10 }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>✅</div>
                <div style={{ color: '#10b981', fontWeight: 600, fontSize: 14 }}>You're registered!</div>
                <button style={{ ...styles.btn('ghost'), fontSize: 12, marginTop: 8, color: '#64748b' }} onClick={() => window.dispatchEvent(new CustomEvent('viewMyEvents'))}>View Your Ticket →</button>
              </div>
            ) : (
              <button
                style={{ ...styles.btn(left === 0 ? 'ghost' : 'primary'), width: '100%', padding: '12px', fontSize: 15, ...(left === 0 ? styles.btnDisabled : {}) }}
                disabled={left === 0}
                onClick={() => registerForEvent(ev)}
              >
                {left === 0 ? 'Event Full' : 'Register for Event'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { formatDate, formatTime, seatsLeft, seatsPercent, categoryColor } from '../utils.js';

export default function EventList({ events, filteredEvents, isRegistered, registerForEvent, setSelectedEvent, styles }) {
  return (
    <div>
      {filteredEvents.length === 0 ? (
        <div style={styles.emptyState}><div style={{ fontSize: 48 }}>🔍</div><div>No events found</div></div>
      ) : (
        <div style={styles.grid3}>
          {filteredEvents.map(ev => {
            const left = seatsLeft(ev);
            const pct = seatsPercent(ev);
            const reg = isRegistered(ev.id);
            return (
              <div key={ev.id} style={styles.card} onClick={() => { setSelectedEvent(ev); window.dispatchEvent(new CustomEvent('openEventDetail', { detail: ev })); }}>
                <div style={styles.eventCardTop(ev.color)} />
                <div style={styles.eventCardBody}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={styles.badge(categoryColor[ev.category] || '#3b82f6')}>{ev.category}</span>
                    {reg && <span style={styles.badge('#10b981')}>✓ Registered</span>}
                  </div>
                  <div style={styles.eventTitle}>{ev.title}</div>
                  <div style={styles.eventDesc}>{ev.shortDesc}</div>
                  <div style={styles.metaRow}><span>📅</span><span><strong>{formatDate(ev.date)}</strong></span></div>
                  <div style={styles.metaRow}><span>🕐</span><span>{formatTime(ev.time)}</span></div>
                  <div style={styles.metaRow}><span>📍</span><span>{ev.location}</span></div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                      <span>👥 {ev.registered}/{ev.capacity} seats</span>
                      <span style={{ color: left === 0 ? '#ef4444' : left < 10 ? '#f59e0b' : '#94a3b8' }}>{left === 0 ? 'Full' : `${left} available`}</span>
                    </div>
                    <div style={styles.progressBar(pct)}><div style={styles.progressFill(pct)} /></div>
                  </div>
                  <button
                    style={{ ...styles.btn(reg ? 'success' : left === 0 ? 'ghost' : 'primary'), width: '100%', marginTop: '0.75rem', ...(left === 0 && !reg ? styles.btnDisabled : {}) }}
                    disabled={left === 0 && !reg}
                    onClick={e => { e.stopPropagation(); if (!reg && left > 0) registerForEvent(ev); else if (reg) { window.dispatchEvent(new CustomEvent('viewMyEvents')); } }}
                  >
                    {reg ? '✓ View Ticket' : left === 0 ? 'Event Full' : 'Register for Event'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

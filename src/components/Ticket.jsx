import React from 'react';
import { formatDate, formatTime } from '../utils.js';

export default function Ticket({ ticket, currentUser, onBack, styles }) {
  if (!ticket) return null;
  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <button style={{ ...styles.btn('ghost'), marginBottom: '1.5rem', paddingLeft: 0 }} onClick={onBack}>← Back to Dashboard</button>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎫</div>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>Registration Confirmed!</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 6 }}>Your ticket has been issued</p>
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>TICKET ID</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#3b82f6', letterSpacing: 2 }}>{ticket.id}</div>
              </div>
              <div style={{ background: '#0d1526', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>{ticket.eventTitle}</div>
                {[
                  ['📅', 'Date', formatDate(ticket.eventDate)],
                  ['🕐', 'Time', formatTime(ticket.eventTime)],
                  ['📍', 'Location', ticket.eventLocation],
                  ['👤', 'Attendee', ticket.userName],
                  ['📧', 'Email', ticket.userEmail],
                ].map(([icon, label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e2d4a', fontSize: 14 }}>
                    <span style={{ color: '#64748b' }}>{icon} {label}</span>
                    <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#10b98115', border: '1px solid #10b98133', borderRadius: 10, padding: '12px 16px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <span style={{ color: '#10b981', fontSize: 14, fontWeight: 500 }}>You're all set! Show this ticket at the event entrance.</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ ...styles.btn('primary'), flex: 1 }} onClick={() => window.dispatchEvent(new CustomEvent('viewMyEvents'))}>View My Events</button>
                <button style={{ ...styles.btn(), flex: 1 }} onClick={() => window.dispatchEvent(new CustomEvent('browseEvents'))}>Browse More Events</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

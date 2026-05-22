import React, { useState, useEffect } from 'react';
import EventFormModal from './components/EventFormModal.jsx';
import styles from './styles.js';
import Nav from './components/Nav.jsx';
import EventList from './components/EventList.jsx';
import EventDetail from './components/EventDetail.jsx';
import Ticket from './components/Ticket.jsx';
import {
  INITIAL_EVENTS,
  INITIAL_USER,
  ORGANIZER,
  formatDate,
  formatTime,
  generateTicketId,
  seatsLeft,
  seatsPercent,
  categoryColor,
} from './utils.js';

export default function App() {
  const [currentUser, setCurrentUser] = useState(INITIAL_USER);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [registrations, setRegistrations] = useState([]);
  const [page, setPage] = useState('login');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [orgTab, setOrgTab] = useState('events');
  const [editingEvent, setEditingEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [userTab, setUserTab] = useState('browse');
  const [loginMode, setLoginMode] = useState('user');
  const [notification, setNotification] = useState(null);

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const login = (mode) => {
    if (mode === 'organizer') {
      setCurrentUser(ORGANIZER);
      setPage('organizer');
    } else {
      setCurrentUser(INITIAL_USER);
      setPage('dashboard');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setPage('login');
    setSelectedEvent(null);
    setTicket(null);
  };

  const registerForEvent = (event) => {
    if (seatsLeft(event) <= 0) return;
    const alreadyReg = registrations.find(r => r.eventId === event.id && r.userEmail === currentUser.email);
    if (alreadyReg) {
      showNotif("You're already registered for this event!", 'info');
      return;
    }
    const newTicket = {
      id: generateTicketId(),
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      userName: currentUser.name,
      userEmail: currentUser.email,
      registeredAt: new Date().toISOString(),
    };
    setRegistrations(prev => [...prev, newTicket]);
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, registered: e.registered + 1 } : e));
    setTicket(newTicket);
    setPage('ticket');
    showNotif('Successfully registered!');
  };

  const cancelRegistration = (ticketId) => {
    const reg = registrations.find(r => r.id === ticketId);
    if (!reg) return;
    setRegistrations(prev => prev.filter(r => r.id !== ticketId));
    setEvents(prev => prev.map(e => e.id === reg.eventId ? { ...e, registered: Math.max(0, e.registered - 1) } : e));
    showNotif('Registration cancelled.', 'info');
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setRegistrations(prev => prev.filter(r => r.eventId !== id));
    showNotif('Event deleted.', 'danger');
  };

  const saveEvent = (eventData) => {
    if (eventData.id) {
      setEvents(prev => prev.map(e => e.id === eventData.id ? { ...e, ...eventData } : e));
      showNotif('Event updated!');
    } else {
      const newEv = { ...eventData, id: Date.now(), registered: 0, image: '📅', color: categoryColor[eventData.category] || '#3b82f6' };
      setEvents(prev => [...prev, newEv]);
      showNotif('Event created!');
    }
    setEditingEvent(null);
    setShowCreateModal(false);
  };

  const categories = ['All', ...Array.from(new Set(events.map(e => e.category)))];
  const filteredEvents = events.filter(e => {
    const matchQ = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'All' || e.category === filterCategory;
    return matchQ && matchCat;
  });

  const userRegs = registrations.filter(r => r.userEmail === currentUser?.email);

  const isRegistered = (eventId) => registrations.some(r => r.eventId === eventId && r.userEmail === currentUser?.email);


  // ── LOGIN PAGE ──
  if (page === 'login') {
    return (
      <div style={{ ...styles.app, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: 20, padding: '2.5rem', width: '100%', maxWidth: 420, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 1.5rem' }}>📅</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>EventPortal</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: '2rem' }}>Virtual Event Registration System</p>
          <div style={styles.tabBar}>
            <button style={styles.tab(loginMode === 'user')} onClick={() => setLoginMode('user')}>Attendee</button>
            <button style={styles.tab(loginMode === 'organizer')} onClick={() => setLoginMode('organizer')}>Organizer</button>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            {loginMode === 'user' ? (
              <>
                <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: '1.25rem' }}>Sign in as <strong style={{ color: '#f1f5f9' }}>John Doe</strong> to browse and register for events</p>
                <button style={{ ...styles.btn('primary'), width: '100%', padding: '12px', fontSize: 15 }} onClick={() => login('user')}>Sign In as Attendee</button>
              </>
            ) : (
              <>
                <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: '1.25rem' }}>Sign in as <strong style={{ color: '#f1f5f9' }}>Admin</strong> to manage events and view attendees</p>
                <button style={{ ...styles.btn('success'), width: '100%', padding: '12px', fontSize: 15 }} onClick={() => login('organizer')}>Sign In as Organizer</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── TICKET PAGE ──
  if (page === 'ticket' && ticket) {
    const ev = events.find(e => e.id === ticket.eventId) || {};
    return (
      <div style={styles.app}>
        {notification && <div style={styles.notif(notification.type)}>{notification.msg}</div>}
        <nav style={styles.nav}>
          <div style={styles.navBrand} onClick={() => setPage('dashboard')}>
            <div style={styles.navLogo}>📅</div>
            <div><div style={styles.navTitle}>EventPortal</div><div style={styles.navSub}>Welcome, {currentUser.name}</div></div>
          </div>
          <button style={styles.btn('ghost')} onClick={logout}>← Logout</button>
        </nav>
        <div style={styles.container}>
          <button style={{ ...styles.btn('ghost'), marginBottom: '1.5rem', paddingLeft: 0 }} onClick={() => setPage('dashboard')}>← Back to Dashboard</button>
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
                  <button style={{ ...styles.btn('primary'), flex: 1 }} onClick={() => { setUserTab('myevents'); setPage('dashboard'); }}>View My Events</button>
                  <button style={{ ...styles.btn(), flex: 1 }} onClick={() => setPage('dashboard')}>Browse More Events</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── EVENT DETAIL PAGE ──
  if (page === 'eventDetail' && selectedEvent) {
    const ev = events.find(e => e.id === selectedEvent.id) || selectedEvent;
    const pct = seatsPercent(ev);
    const left = seatsLeft(ev);
    const alreadyReg = isRegistered(ev.id);
    return (
      <div style={styles.app}>
        {notification && <div style={styles.notif(notification.type)}>{notification.msg}</div>}
        <nav style={styles.nav}>
          <div style={styles.navBrand} onClick={() => setPage('dashboard')}>
            <div style={styles.navLogo}>📅</div>
            <div><div style={styles.navTitle}>EventPortal</div><div style={styles.navSub}>Welcome, {currentUser.name}</div></div>
          </div>
          <button style={styles.btn('ghost')} onClick={logout}>← Logout</button>
        </nav>
        <div style={styles.container}>
          <button style={{ ...styles.btn('ghost'), marginBottom: '1.5rem', paddingLeft: 0 }} onClick={() => setPage('dashboard')}>← Back to Events</button>
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
                  {[
                    ['📅', 'Date', formatDate(ev.date)],
                    ['🕐', 'Time', formatTime(ev.time)],
                    ['📍', 'Location', ev.location],
                    ['🏢', 'Organizer', ev.organizer],
                  ].map(([icon, label, value]) => (
                    <div key={label} style={{ background: '#0d1526', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{icon} {label}</div>
                      <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 500 }}>{value}</div>
                    </div>
                  ))}
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
                  <button style={{ ...styles.btn('ghost'), fontSize: 12, marginTop: 8, color: '#64748b' }} onClick={() => { setUserTab('myevents'); setPage('dashboard'); }}>View Your Ticket →</button>
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

  // ── ORGANIZER DASHBOARD ──
  if (page === 'organizer') {
    const totalAttendees = registrations.length;
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;
    return (
      <div style={styles.app}>
        {notification && <div style={styles.notif(notification.type)}>{notification.msg}</div>}
        {(showCreateModal || editingEvent) && (
          <EventFormModal
            event={editingEvent}
            onSave={saveEvent}
            onClose={() => { setEditingEvent(null); setShowCreateModal(false); }}
            styles={styles}
          />
        )}
        <nav style={styles.nav}>
          <div style={styles.navBrand}>
            <div style={styles.navLogo}>📅</div>
            <div><div style={styles.navTitle}>EventPortal</div><div style={styles.navSub}>Organizer Dashboard</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>Admin User</span>
            <button style={styles.btn('ghost')} onClick={logout}>Logout</button>
          </div>
        </nav>
        <div style={styles.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[["Total Events", totalEvents, "📅", "#3b82f6"], ["Total Attendees", totalAttendees, "👥", "#10b981"], ["Upcoming Events", upcomingEvents, "🚀", "#8b5cf6"]].map(([label, val, icon, color]) => (
              <div key={label} style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: color }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={styles.tabBar}>
            <button style={styles.tab(orgTab === 'events')} onClick={() => setOrgTab('events')}>Manage Events</button>
            <button style={styles.tab(orgTab === 'attendees')} onClick={() => setOrgTab('attendees')}>Attendees</button>
          </div>

          {orgTab === 'events' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionTitle}>All Events</div>
                  <div style={styles.sectionSub}>{events.length} events total</div>
                </div>
                <button style={styles.btn('primary')} onClick={() => setShowCreateModal(true)}>+ Create Event</button>
              </div>
              <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: 12, overflow: 'hidden' }}>
                <table style={styles.table}>
                  <thead><tr><th style={styles.th}>Event</th><th style={styles.th}>Date</th><th style={styles.th}>Location</th><th style={styles.th}>Capacity</th><th style={styles.th}>Status</th><th style={styles.th}>Actions</th></tr></thead>
                  <tbody>
                    {events.map(ev => {
                      const left = seatsLeft(ev);
                      const pct = seatsPercent(ev);
                      return (
                        <tr key={ev.id}>
                          <td style={styles.td}>
                            <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{ev.title}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{ev.category}</div>
                          </td>
                          <td style={styles.td}><div style={{ fontSize: 13 }}>{formatDate(ev.date)}</div><div style={{ fontSize: 12, color: '#64748b' }}>{formatTime(ev.time)}</div></td>
                          <td style={{ ...styles.td, fontSize: 13 }}>{ev.location}</td>
                          <td style={styles.td}>
                            <div style={{ fontSize: 13 }}>{ev.registered}/{ev.capacity}</div>
                            <div style={{ ...styles.progressBar(pct), marginBottom: 0 }}><div style={styles.progressFill(pct)} /></div>
                          </td>
                          <td style={styles.td}><span style={styles.badge(left === 0 ? '#ef4444' : left < 10 ? '#f59e0b' : '#10b981')}>{left === 0 ? 'Full' : `${left} seats left`}</span></td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button style={{ ...styles.btn(), fontSize: 12, padding: '6px 12px' }} onClick={() => setEditingEvent(ev)}>Edit</button>
                              <button style={{ ...styles.btn('danger'), fontSize: 12, padding: '6px 12px' }} onClick={() => deleteEvent(ev.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {events.length === 0 && <div style={styles.emptyState}><div style={{ fontSize: 48 }}>📭</div><div>No events yet</div></div>}
              </div>
            </>
          )}

          {orgTab === 'attendees' && (
            <>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>All Registrations</div>
                <div style={styles.sectionSub}>{registrations.length} registrations total</div>
              </div>
              <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: 12, overflow: 'hidden' }}>
                <table style={styles.table}>
                  <thead><tr><th style={styles.th}>Attendee</th><th style={styles.th}>Event</th><th style={styles.th}>Date</th><th style={styles.th}>Ticket ID</th><th style={styles.th}>Registered</th></tr></thead>
                  <tbody>
                    {registrations.map(reg => (
                      <tr key={reg.id}>
                        <td style={styles.td}><div style={{ fontWeight: 600, color: '#f1f5f9' }}>{reg.userName}</div><div style={{ fontSize: 12, color: '#64748b' }}>{reg.userEmail}</div></td>
                        <td style={{ ...styles.td, fontWeight: 500 }}>{reg.eventTitle}</td>
                        <td style={{ ...styles.td, fontSize: 13 }}>{formatDate(reg.eventDate)}</td>
                        <td style={styles.td}><span style={{ fontFamily: 'monospace', color: '#3b82f6', fontSize: 13 }}>{reg.id}</span></td>
                        <td style={{ ...styles.td, fontSize: 12, color: '#64748b' }}>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {registrations.length === 0 && <div style={styles.emptyState}><div style={{ fontSize: 48 }}>👥</div><div>No registrations yet</div></div>}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── USER DASHBOARD ──
  return (
    <div style={styles.app}>
      {notification && <div style={styles.notif(notification.type)}>{notification.msg}</div>}
      <Nav title="User Dashboard" sub={`Welcome, ${currentUser.name}`} onBrandClick={() => setPage('dashboard')} onLogout={logout} />
      <div style={styles.container}>
        <div style={styles.tabBar}>
          <button style={styles.tab(userTab === 'browse')} onClick={() => setUserTab('browse')}>Browse Events</button>
          <button style={styles.tab(userTab === 'myevents')} onClick={() => setUserTab('myevents')}>My Events {userRegs.length > 0 && `(${userRegs.length})`}</button>
        </div>

        {userTab === 'browse' && (
          <>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitle}>Available Events</div>
              <div style={styles.sectionSub}>Browse and register for upcoming events</div>
            </div>
            <div style={styles.searchRow}>
              <input style={styles.input} placeholder="🔍  Search events..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <select style={styles.select} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <EventList
              events={events}
              filteredEvents={filteredEvents}
              isRegistered={isRegistered}
              registerForEvent={registerForEvent}
              setSelectedEvent={(ev) => { setSelectedEvent(ev); setPage('eventDetail'); }}
              styles={styles}
            />
          </>
        )}

        {userTab === 'myevents' && (
          <>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitle}>My Registered Events</div>
              <div style={styles.sectionSub}>Events you have registered for</div>
            </div>
            {userRegs.length === 0 ? (
              <div style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: 12, padding: '2rem', color: '#94a3b8', fontSize: 14 }}>
                You haven't registered for any events yet. Browse available events to get started!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {userRegs.map(reg => {
                  const ev = events.find(e => e.id === reg.eventId);
                  return (
                    <div key={reg.id} style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: 12, overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: 6, background: ev?.color || '#3b82f6', flexShrink: 0 }} />
                      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{reg.eventTitle}</div>
                          <div style={{ display: 'flex', gap: '1.25rem', fontSize: 13, color: '#64748b' }}>
                            <span>📅 {formatDate(reg.eventDate)}</span>
                            <span>🕐 {formatTime(reg.eventTime)}</span>
                            <span>📍 {reg.eventLocation}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ textAlign: 'right', marginRight: 8 }}>
                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>TICKET ID</div>
                            <div style={{ fontFamily: 'monospace', color: '#3b82f6', fontWeight: 700 }}>{reg.id}</div>
                          </div>
                          <button style={{ ...styles.btn('danger'), fontSize: 12, padding: '6px 14px' }} onClick={() => cancelRegistration(reg.id)}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

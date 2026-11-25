import React from 'react'
export default function AppointmentList({ appts, onCancel }) {
  return (
    <section className="card"><h2>My appointments</h2>
      {appts.length === 0 ? <p className="muted">No appointments yet (demo data, stored on this device only).</p> :
        <ul className="appts">{[...appts].sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot)).map(a => (
          <li key={a.id}><div><b>{a.doc}</b><small>{a.dept} · {a.date} · {a.slot}</small></div><button className="link" onClick={() => onCancel(a.id)}>Cancel</button></li>))}</ul>}
    </section>
  )
}

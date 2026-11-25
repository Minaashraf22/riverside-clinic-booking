import React, { useEffect, useState } from 'react'

export const DEPTS = [
  { id: 'gp', name: 'General practice', img: 'd1.jpg', doctors: ['Dr. Salma Hany', 'Dr. Omar Fathy'] },
  { id: 'dental', name: 'Dental care', img: 'd2.jpg', doctors: ['Dr. Layla Samir'] },
  { id: 'peds', name: 'Pediatrics', img: 'd3.jpg', doctors: ['Dr. Karim Adel', 'Dr. Nour Magdy'] },
]
const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00']
// deterministic pre-booked slots so availability looks real
const seeded = (doc, date, slot) => { let h = 7; for (const c of doc + date + slot) h = (h * 31 + c.charCodeAt(0)) % 997; return h % 4 === 0 }
const iso = d => d.toISOString().slice(0, 10)
const load = () => { try { return JSON.parse(localStorage.getItem('rc-appts')) || [] } catch { return [] } }

export default function App() {
  const [dept, setDept] = useState(DEPTS[0])
  const [doc, setDoc] = useState(DEPTS[0].doctors[0])
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [appts, setAppts] = useState(load)
  const [f, setF] = useState({ name: '', phone: '', reason: '' })
  const [errs, setErrs] = useState({})
  const [msg, setMsg] = useState('')
  useEffect(() => localStorage.setItem('rc-appts', JSON.stringify(appts)), [appts])

  const today = new Date(); today.setHours(12)
  const min = iso(today)
  const isFri = date && new Date(date + 'T12:00:00').getDay() === 5
  const taken = s => seeded(doc, date, s) || appts.some(a => a.doc === doc && a.date === date && a.slot === s)
  const pickDept = d => { setDept(d); setDoc(d.doctors[0]); setSlot(''); setMsg('') }
  const book = e => {
    e.preventDefault()
    const er = {}
    if (f.name.trim().length < 2) er.name = 'Enter patient name'
    if (!/^\+?[0-9 ]{8,15}$/.test(f.phone.trim())) er.phone = 'Enter a valid phone number'
    if (!date) er.date = 'Choose a date'; else if (date < min) er.date = 'Date is in the past'; else if (isFri) er.date = 'Closed on Fridays'
    if (!slot && !er.date) er.slot = 'Choose a time slot'
    setErrs(er); setMsg('')
    if (Object.keys(er).length) return
    if (taken(slot)) { setErrs({ slot: 'That slot was just taken' }); return }
    setAppts([...appts, { id: Date.now(), dept: dept.name, doc, date, slot, name: f.name.trim() }])
    setMsg(`Demo booking saved on this device only: ${doc}, ${date} at ${slot}. No real appointment was made.`); setSlot(''); setF({ name: '', phone: '', reason: '' })
  }
  const cancel = id => setAppts(appts.filter(a => a.id !== id))

  return (
    <div>
      <header className="top"><div className="brand"><img src="logo.svg" alt="" /> Riverside Clinic</div><span>Demo, fictional clinic. No real medical data.</span></header>
      <section className="hero"><h1>Book your visit online</h1><p>Choose a department and doctor, pick a time that suits you.</p></section>
      <main>
        <div className="depts">{DEPTS.map(d => (
          <button key={d.id} className={'dept' + (d.id === dept.id ? ' on' : '')} onClick={() => pickDept(d)}>
            <img src={d.img} alt="" /><span>{d.name}</span></button>))}</div>
        <div className="cols">
          <form onSubmit={book} noValidate className="card">
            <h2>New appointment</h2>
            <label>Doctor<select aria-label="Doctor" value={doc} onChange={e => { setDoc(e.target.value); setSlot('') }}>{dept.doctors.map(d => <option key={d}>{d}</option>)}</select></label>
            <label>Date<input type="date" name="date" min={min} value={date} onChange={e => { setDate(e.target.value); setSlot('') }} />{errs.date && <em>{errs.date}</em>}</label>
            {date && !isFri && date >= min && <div className="slots" role="group" aria-label="Time slots">{SLOTS.map(s => (
              <button type="button" key={s} disabled={taken(s)} className={'slot' + (slot === s ? ' on' : '')} onClick={() => setSlot(s)}>{s}</button>))}</div>}
            {errs.slot && <em>{errs.slot}</em>}
            <label>Patient name<input name="name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />{errs.name && <em>{errs.name}</em>}</label>
            <label>Phone<input name="phone" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />{errs.phone && <em>{errs.phone}</em>}</label>
            <button className="btn" type="submit">Book appointment</button>
            {msg && <p className="ok" data-testid="ok">{msg}</p>}
          </form>
          <section className="card"><h2>My appointments</h2>
            {appts.length === 0 ? <p className="muted">No appointments yet (demo data, stored on this device only).</p> :
              <ul className="appts">{[...appts].sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot)).map(a => (
                <li key={a.id}><div><b>{a.doc}</b><small>{a.dept} · {a.date} · {a.slot}</small></div><button className="link" onClick={() => cancel(a.id)}>Cancel</button></li>))}</ul>}
          </section>
        </div>
      </main>
      <footer>Riverside Clinic is a fictional brand created for this portfolio demo. Photos are AI-generated.</footer>
    </div>
  )
}

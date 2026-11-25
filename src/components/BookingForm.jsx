import React, { useState } from 'react'
import SlotPicker from './SlotPicker.jsx'
import { isFriday, isTaken, todayIso, validateBooking } from '../booking.js'

export default function BookingForm({ dept, doc, setDoc, appts, onBook }) {
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [f, setF] = useState({ name: '', phone: '', reason: '' })
  const [errs, setErrs] = useState({})
  const [msg, setMsg] = useState('')
  const min = todayIso()
  const taken = s => isTaken(appts, doc, date, s)
  const bookable = date && !isFriday(date) && date >= min
  // changing department resets the slot and message (doc changes with dept)
  const key = dept.id
  const [seen, setSeen] = useState(key)
  if (seen !== key) { setSeen(key); setSlot(''); setMsg('') }

  const submit = e => {
    e.preventDefault()
    const er = validateBooking({ f, date, slot, min })
    setErrs(er); setMsg('')
    if (Object.keys(er).length) return
    if (taken(slot)) { setErrs({ slot: 'That slot was just taken' }); return }
    onBook({ id: Date.now(), dept: dept.name, doc, date, slot, name: f.name.trim() })
    setMsg(`Demo booking saved on this device only: ${doc}, ${date} at ${slot}. No real appointment was made.`); setSlot(''); setF({ name: '', phone: '', reason: '' })
  }
  return (
    <form onSubmit={submit} noValidate className="card">
      <h2>New appointment</h2>
      <label>Doctor<select aria-label="Doctor" value={doc} onChange={e => { setDoc(e.target.value); setSlot('') }}>{dept.doctors.map(d => <option key={d}>{d}</option>)}</select></label>
      <label>Date<input type="date" name="date" min={min} value={date} onChange={e => { setDate(e.target.value); setSlot('') }} />{errs.date && <em>{errs.date}</em>}</label>
      {bookable && <SlotPicker slot={slot} isTaken={taken} onPick={setSlot} />}
      {errs.slot && <em>{errs.slot}</em>}
      <label>Patient name<input name="name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />{errs.name && <em>{errs.name}</em>}</label>
      <label>Phone<input name="phone" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />{errs.phone && <em>{errs.phone}</em>}</label>
      <button className="btn" type="submit">Book appointment</button>
      {msg && <p className="ok" data-testid="ok">{msg}</p>}
    </form>
  )
}

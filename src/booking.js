// Pure booking rules: availability, date checks and form validation.
export const iso = d => d.toISOString().slice(0, 10)
// deterministic pre-booked slots so availability looks real
export const seeded = (doc, date, slot) => { let h = 7; for (const c of doc + date + slot) h = (h * 31 + c.charCodeAt(0)) % 997; return h % 4 === 0 }
export const isFriday = date => !!date && new Date(date + 'T12:00:00').getDay() === 5
export const todayIso = () => { const t = new Date(); t.setHours(12); return iso(t) }
export const isTaken = (appts, doc, date, slot) => seeded(doc, date, slot) || appts.some(a => a.doc === doc && a.date === date && a.slot === slot)
export function validateBooking({ f, date, slot, min }) {
  const er = {}
  if (f.name.trim().length < 2) er.name = 'Enter patient name'
  if (!/^\+?[0-9 ]{8,15}$/.test(f.phone.trim())) er.phone = 'Enter a valid phone number'
  if (!date) er.date = 'Choose a date'; else if (date < min) er.date = 'Date is in the past'; else if (isFriday(date)) er.date = 'Closed on Fridays'
  if (!slot && !er.date) er.slot = 'Choose a time slot'
  return er
}

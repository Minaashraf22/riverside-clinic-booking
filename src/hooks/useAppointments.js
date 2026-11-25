import { useEffect, useState } from 'react'
const load = () => { try { return JSON.parse(localStorage.getItem('rc-appts')) || [] } catch { return [] } }
export function useAppointments() {
  const [appts, setAppts] = useState(load)
  useEffect(() => localStorage.setItem('rc-appts', JSON.stringify(appts)), [appts])
  const add = a => setAppts(list => [...list, a])
  const cancel = id => setAppts(list => list.filter(a => a.id !== id))
  return { appts, add, cancel }
}

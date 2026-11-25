import React, { useState } from 'react'
import { DEPTS } from './data.js'
import { useAppointments } from './hooks/useAppointments.js'
import Header from './components/Header.jsx'
import DeptPicker from './components/DeptPicker.jsx'
import BookingForm from './components/BookingForm.jsx'
import AppointmentList from './components/AppointmentList.jsx'

export { DEPTS }

export default function App() {
  const [dept, setDept] = useState(DEPTS[0])
  const [doc, setDoc] = useState(DEPTS[0].doctors[0])
  const { appts, add, cancel } = useAppointments()
  const pickDept = d => { setDept(d); setDoc(d.doctors[0]) }
  return (
    <div>
      <Header />
      <section className="hero"><h1>Book your visit online</h1><p>Choose a department and doctor, pick a time that suits you.</p></section>
      <main>
        <DeptPicker dept={dept} onPick={pickDept} />
        <div className="cols">
          <BookingForm dept={dept} doc={doc} setDoc={setDoc} appts={appts} onBook={add} />
          <AppointmentList appts={appts} onCancel={cancel} />
        </div>
      </main>
      <footer>Riverside Clinic is a fictional brand created for this portfolio demo. Photos are AI-generated.</footer>
    </div>
  )
}

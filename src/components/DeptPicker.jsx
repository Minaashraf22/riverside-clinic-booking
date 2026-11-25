import React from 'react'
import { DEPTS } from '../data.js'
export default function DeptPicker({ dept, onPick }) {
  return (
    <div className="depts">{DEPTS.map(d => (
      <button key={d.id} className={'dept' + (d.id === dept.id ? ' on' : '')} onClick={() => onPick(d)}>
        <img src={d.img} alt="" /><span>{d.name}</span></button>))}</div>
  )
}

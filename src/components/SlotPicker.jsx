import React from 'react'
import { SLOTS } from '../data.js'
export default function SlotPicker({ slot, isTaken, onPick }) {
  return (
    <div className="slots" role="group" aria-label="Time slots">{SLOTS.map(s => (
      <button type="button" key={s} disabled={isTaken(s)} className={'slot' + (slot === s ? ' on' : '')} onClick={() => onPick(s)}>{s}</button>))}</div>
  )
}

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAppointments } from '../api'

export default function Dashboard(){
  const nav = useNavigate()
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')

  useEffect(()=>{
    const t = localStorage.getItem('token')
    if(!t){ nav('/'); return }
    getAppointments(t).then(setRows).catch(()=>setErr('Failed to load appointments'))
  }, [])

  function logout(){
    localStorage.clear()
    nav('/')
  }

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>
      {err && <div className="error">{err}</div>}
      {!err && rows.length===0 && <div>No appointments yet.</div>}
      {rows.map(a => (
        <div key={a.id} className="row">
          <b>{a.status}</b> — {new Date(a.scheduled_at).toLocaleString()} — {a.id}
        </div>
      ))}
    </div>
  )
}

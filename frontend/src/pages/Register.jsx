import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [msg, setMsg] = useState('')
  const nav = useNavigate()

  async function onRegister(e){
    e.preventDefault()
    setMsg('')
    try{
      await registerUser(email, password, role, fullName)
      setMsg('Registered! Please log in.')
      setTimeout(()=>nav('/'), 800)
    }catch{
      setMsg('Registration failed')
    }
  }

  return (
    <div className="card">
      <h2>Register</h2>
      {msg && <div className="info">{msg}</div>}
      <form onSubmit={onRegister}>
        <input placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        <button type="submit">Create Account</button>
      </form>
      <p><Link to="/">Back to Login</Link></p>
    </div>
  )
}

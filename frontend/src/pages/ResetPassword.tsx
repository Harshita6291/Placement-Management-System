import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return alert('Missing token');
    setLoading(true);
    try {
      const res = await fetch(`/api/${role}s/reset/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      let data: any;
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text().catch(() => null);
        data = { message: text || (res.ok ? 'OK' : 'Request failed') };
      }
      setLoading(false);
      if (!res.ok) return alert(data.message || 'Reset failed');
      alert('Password reset successful. Please login.');
      navigate('/login/student');
    } catch (err: any) {
      setLoading(false);
      alert(err.message || 'Request failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 px-6">
      <h2 className="text-2xl font-semibold mb-4">Reset password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full border rounded px-2 py-2">
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="tpo">TPO</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">New password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border rounded px-2 py-2" />
        </div>
        <div>
          <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;

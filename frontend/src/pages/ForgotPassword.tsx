import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
      const endpoint = `${apiBase}/api/${role}s/forgot`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = { message: await res.text().catch(() => 'Request failed') };
      }
      setLoading(false);
      if (!res.ok) return alert(data.message || 'Request failed');
      // in dev the API may return resetToken; show note and navigate to reset page if present
      if (data.resetToken) {
        alert('Reset token generated. You will be redirected to reset page.');
        navigate(`/reset-password/${data.resetToken}`);
      } else {
        alert(data.message || 'Reset token sent (check email)');
        navigate('/login/student');
      }
    } catch (err: any) {
      setLoading(false);
      alert(err.message || 'Request failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 px-6">
      <h2 className="text-2xl font-semibold mb-4">Forgot password</h2>
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
          <label className="block text-sm font-medium">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded px-2 py-2" />
        </div>
        <div>
          <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;

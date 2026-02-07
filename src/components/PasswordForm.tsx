import React, { useState } from 'react';
import { updatePassword } from '../api/auth.api';
import type { UpdatePasswordPayload } from '../@types/auth';

export default function PasswordForm() {
  const [form, setForm] = useState<UpdatePasswordPayload>({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updatePassword(form);
      alert(res.data.message);
      setErrors({});
      setForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (err: any) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Current Password</label>
        <input type="password" name="current_password" value={form.current_password} onChange={handleChange} />
        {errors.current_password && <span style={{color:'red'}}>{errors.current_password}</span>}
      </div>

      <div>
        <label>New Password</label>
        <input type="password" name="new_password" value={form.new_password} onChange={handleChange} />
        {errors.new_password && <span style={{color:'red'}}>{errors.new_password}</span>}
      </div>

      <div>
        <label>Confirm New Password</label>
        <input type="password" name="new_password_confirmation" value={form.new_password_confirmation} onChange={handleChange} />
        {errors.new_password_confirmation && <span style={{color:'red'}}>{errors.new_password_confirmation}</span>}
      </div>

      <button disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
    </form>
  );
}

import React, { useState } from "react";
import { updateProfile } from "../api/auth.api";
import type { UpdateProfilePayload } from "../@types/auth";
import { useAuth } from "../hooks/useAuth";

export default function ProfileForm() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState<UpdateProfilePayload>({
    name: user?.nom || "",
    email: user?.email || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      refreshUser(); 
      alert(res.data.message);
      setErrors({});
    } catch (err: any) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
      </div>

      <div>
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />
        {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
      </div>

      <button disabled={loading}>
        {loading ? "Updating..." : "Update"}
      </button>
    </form>
  );
}

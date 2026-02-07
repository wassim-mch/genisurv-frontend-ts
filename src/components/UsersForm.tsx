import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createUser, updateUser } from "../api/users.api";
import { getRoles } from "../api/roles.api";
import { getWilayas } from "../api/wilayas.api.ts";
import type { User } from "../@types/user";

interface Props {
  user?: User;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function UsersForm({ user, onSuccess, onCancel }: Props) {
  const { t } = useTranslation();

  const [name, setName] = useState(user?.nom || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState<number | "">(user?.role_id || "");
  const [wilayaId, setWilayaId] = useState<number | "">(user?.wilaya_id || "");
  const [roles, setRoles] = useState<any[]>([]);
  const [wilayas, setWilayas] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getRoles().then(setRoles);
    getWilayas().then(setWilayas);
  }, []);

  const validate = () => {
    const errs: any = {};
    if (!name) errs.name = t("validation_required");
    if (!email) errs.email = t("validation_required");
    if (!user && !password) errs.password = t("validation_required");
    if (password && password.length < 8) errs.password = t("validation_min_8");
    if (password !== confirmPassword)
      errs.confirmPassword = t("validation_password_mismatch");
    if (!roleId) errs.role_id = t("validation_required");

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: any = { name, email, role_id: roleId };
    if (wilayaId) payload.wilaya_id = wilayaId;
    if (password) payload.password = password;

    if (user) await updateUser(user.id, payload);
    else await createUser(payload);

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>{t("name")}</label>
      <input value={name} onChange={e => setName(e.target.value)} />
      {errors.name && <div style={{color:"red"}}>{errors.name}</div>}

      <label>{t("email")}</label>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      {errors.email && <div style={{color:"red"}}>{errors.email}</div>}

      <label>{t("password")}</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      {errors.password && <div style={{color:"red"}}>{errors.password}</div>}

      <label>{t("confirm_password")}</label>
      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      {errors.confirmPassword && <div style={{color:"red"}}>{errors.confirmPassword}</div>}

      <label>{t("role")}</label>
      <select value={roleId} onChange={e => setRoleId(Number(e.target.value))}>
        <option value="">{t("select_role")}</option>
        {roles.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <label>{t("wilaya")}</label>
      <select value={wilayaId} onChange={e => setWilayaId(Number(e.target.value))}>
        <option value="">{t("select_wilaya")}</option>
        {wilayas.map(w => (
          <option key={w.id} value={w.id}>{w.nom}</option>
        ))}
      </select>

      <button type="submit">{user ? t("update") : t("create")}</button>
      {onCancel && <button onClick={onCancel}>{t("cancel")}</button>}
    </form>
  );
}

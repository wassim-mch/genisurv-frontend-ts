import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createRole, updateRole, getPermissions } from "../api/roles.api.ts";
import type { Role } from "../@types/role";

interface Props {
  role?: Role;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function RolesForm({ role, onSuccess, onCancel }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState(role?.name || "");
  const [permissions, setPermissions] = useState<string[]>(role?.permissions || []);
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getPermissions().then(setAllPermissions);
  }, []);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name) errs.name = t("validation_required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (role) await updateRole(role.id, { name, permissions });
      else await createRole({ name, permissions });
      onSuccess();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
      console.error(err);
    }
  };

  const togglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div>
        <label>{t("role")}</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
      </div>

      <div>
        <label>{t("permissions")}</label>
        <div>
          {allPermissions.map((p) => (
            <label key={p} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={permissions.includes(p)}
                onChange={() => togglePermission(p)}
              />
              {p}
            </label>
          ))}
        </div>
        {errors.permissions && <div style={{ color: "red" }}>{errors.permissions}</div>}
      </div>

      <button type="submit">{role ? t("update") : t("create")}</button>
      {onCancel && <button onClick={onCancel}>{t("cancel")}</button>}
    </form>
  );
}

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
  const [permissions, setPermissions] = useState<string[]>(
    role?.permissions || [],
  );
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getPermissions().then(setAllPermissions);
  }, []);
  console.log(allPermissions)

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
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  return (
    <div className="roles-form-card">
      <form onSubmit={handleSubmit} className="roles-form">
        {/* Name */}
        <div className="form-group">
          <label>{t("role")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "input error" : "input"}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Permissions */}
        <div className="form-group">
          <label>{t("permissions")}</label>
          <div className="checkbox-group">
            {allPermissions.map((p) => (
              <label key={p}>
                <input
                  type="checkbox"
                  checked={permissions.includes(p)}
                  onChange={() => togglePermission(p)}
                />
                {p}
              </label>
            ))}
          </div>
          {errors.permissions && (
            <span className="error-text">{errors.permissions}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {role ? t("update") : t("create")}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              {t("cancel")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

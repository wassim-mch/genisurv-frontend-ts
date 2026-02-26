import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { createWilaya, updateWilaya } from "../api/wilayas.api";
import type { Wilaya } from "../@types/wilaya";

interface Props {
  wilaya?: Wilaya;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function WilayaForm({ wilaya, onSuccess, onCancel }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState(wilaya?.nom || "");
  const [error, setError] = useState("");

  const validate = () => {
    if (!name || name.length < 2) {
      setError(t("validation_min_2"));
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (wilaya) await updateWilaya(wilaya.id, { name });
      else await createWilaya({ name });
      onSuccess();
    } catch (err: any) {
      if (err.response?.data?.errors?.name) setError(err.response.data.errors.name[0]);
      else alert("API error");
    }
  };

  return (
    <div className="wilaya-form-card">
      <form onSubmit={handleSubmit} className="wilaya-form">
        <div className="form-group">
          <label>{t("wilaya")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={error ? "input error" : "input"}
          />
          {error && <span className="error-text">{error}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {wilaya ? t("update") : t("create")}
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
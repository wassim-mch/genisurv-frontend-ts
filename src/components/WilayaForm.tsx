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
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div>
        <label>{t("wilaya")}</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>

      <button type="submit">{wilaya ? t("update") : t("create")}</button>
      {onCancel && <button type="button" onClick={onCancel}>{t("cancel")}</button>}
    </form>
  );
}

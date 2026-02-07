import React, { useState, useEffect } from "react";
import type { Encaissement } from "../@types/encaissement";
import { createEncaissement, updateEncaissement } from "../api/encaissements.api";
import { useTranslation } from "react-i18next";

interface Props {
  encaissement?: Encaissement;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function EncaissementForm({ encaissement, onSuccess, onCancel }: Props) {
  const [montant, setMontant] = useState(encaissement?.montant || 0);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;

  const caisseId = user?.caisse_id || 0;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    if (encaissement) {
      await updateEncaissement(encaissement.id, { caisse_id: caisseId, montant });
    } else {
      await createEncaissement({ caisse_id: caisseId, montant , user_id: user.id });
    }
    onSuccess();
  } catch (error: any) {
    // عرض كل المعلومات الممكنة في console
    console.error("Erreur lors de l'encaissement :", error);

    // إذا كان الخطأ من API مع response
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      // إذا لم يصل الرد من السيرفر
      console.error("Request:", error.request);
    } else {
      // خطأ في الكود أو شيء آخر
      console.error("Message:", error.message);
    }

    alert("Une erreur est survenue, veuillez réessayer.");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <div>
        <label className="block mb-1">{t("montant")}</label>
        <input
          type="number"
          value={montant}
          onChange={(e) => setMontant(Number(e.target.value))}
          className="w-full border p-2 rounded"
          min={0}
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {encaissement ? t("update") : t("create")}
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onCancel}
          >
            {t("cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { createAlimentation, updateAlimentation } from "../api/alimentations.api.ts";
import type { Alimentation } from "../@types/alimentation.ts";
import { getCaisses } from "../api/caisses.api.ts";
import type { Caisse } from "../@types/caisse.ts";
import { useEffect } from "react";  

interface Props {
  alimentation?: Alimentation;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function AlimentationForm({ alimentation, onSuccess, onCancel }: Props) {
  const { t } = useTranslation();

  const [caisses, setCaisses] = useState<Caisse[]>([]);
  const [caisseId, setCaisseId] = useState<number>(alimentation?.caisse_id || 0);
  const [montant, setMontant] = useState<number>(
    parseFloat(alimentation?.montant.replace(/\s/g, '').replace(',', '.') || '0')
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCaisses = async () => {
      try {
        const data = await getCaisses();
        setCaisses(data);
        // اذا ما عندنا caisseId مسبق، نخليه أول خيار
        if (!caisseId && data.length > 0) setCaisseId(data[0].id);
      } catch (err: any) {
        console.error(err);
        alert("Error fetching caisses");
      }
    };

    fetchCaisses();
  }, []);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!caisseId) errs.caisseId = t("validation_required");
    if (!montant || montant <= 0) errs.montant = t("validation_min_0");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (alimentation) {
        await updateAlimentation(alimentation.id, { caisse_id: caisseId, montant });
      } else {
        await createAlimentation({ caisse_id: caisseId, montant });
      }
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || "API error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "10px" }}>
        <label>{t("caisse")}</label>
        <select
          value={caisseId}
          onChange={e => setCaisseId(Number(e.target.value))}
          style={{ display: "block", padding: "5px", width: "100%" }}
        >
          {caisses.map(c => (
            <option key={c.id} value={c.id}>
              {c.wilaya} - {c.gestionnaire} (Solde: {c.solde_actuel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DA)
            </option>
          ))}
        </select>
        {errors.caisseId && <div style={{ color: "red" }}>{errors.caisseId}</div>}
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>{t("montant")}</label>
        <input
          type="number"
          value={montant}
          onChange={e => setMontant(Number(e.target.value))}
          style={{ display: "block", padding: "5px", width: "100%" }}
        />
        {errors.montant && <div style={{ color: "red" }}>{errors.montant}</div>}
      </div>

      <button type="submit" disabled={loading} style={{ marginRight: "10px" }}>
        {alimentation ? t("update") : t("create")}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          {t("cancel")}
        </button>
      )}
    </form>
  );
}

import React, { useState } from "react";
import type { Decaissement } from "../@types/decaissement";
import { createDecaissement, updateDecaissement } from "../api/decaissements.api";

interface Props {
  decaissement?: Decaissement;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function DecaissementForm({ decaissement, onSuccess, onCancel }: Props) {
  const [montant, setMontant] = useState(decaissement?.montant || 0);
  const [designation, setDesignation] = useState(decaissement?.designation || "");
  const [observation, setObservation] = useState(decaissement?.observation || "");
  const [typeJustif, setTypeJustif] = useState(decaissement?.type_justificatif || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
  const caisseId = user?.caisse_id || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const formData = new FormData();
      formData.append("montant", montant.toString());
      formData.append("designation", designation);
      formData.append("observation", observation);
      formData.append("type_justif", typeJustif);
      formData.append("caisse_id", caisseId.toString());
      if (file) formData.append("file_path", file);

      if (decaissement) {
        await updateDecaissement(decaissement.id, formData);
      } else {
        await createDecaissement(formData);
      }

      onSuccess();
    } catch (error: any) {
      console.error("Erreur décaissement:", error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        console.error("Détails des erreurs:", error.response.data.errors);
      } else {
        alert("Une erreur est survenue, veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <div>
        <label>Montant</label>
        <input
          type="number"
          value={montant}
          onChange={(e) => setMontant(Number(e.target.value))}
          className="w-full border p-2 rounded"
          min={0}
          required
        />
        {errors.montant && <p className="text-red-600 text-sm">{errors.montant[0]}</p>}
      </div>

      <div>
        <label>Désignation</label>
        <input
          type="text"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        {errors.designation && <p className="text-red-600 text-sm">{errors.designation[0]}</p>}
      </div>

      <div>
        <label>Observation</label>
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          className="w-full border p-2 rounded"
        />
        {errors.observation && <p className="text-red-600 text-sm">{errors.observation[0]}</p>}
      </div>

      <div>
        <label>Type de justificatif</label>
        <select value={typeJustif} onChange={(e) => setTypeJustif(e.target.value)} className="w-full border p-2 rounded">
          <option value="">Sélectionner</option>
          <option value="facture">Facture</option>
          <option value="reçu">Reçu</option>
          <option value="autre">Autre</option>
        </select>
        {errors.type_justif && <p className="text-red-600 text-sm">{errors.type_justif[0]}</p>}
      </div>

      <div>
        <label>Justificatif (fichier)</label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        {errors.file_path && <p className="text-red-600 text-sm">{errors.file_path[0]}</p>}
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {decaissement ? "Mettre à jour" : "Ajouter"}
        </button>
        {onCancel && (
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

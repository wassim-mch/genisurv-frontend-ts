import React, { useState, useEffect } from "react";
import { getDecaissements, deleteDecaissement } from "../api/decaissements.api";
import DecaissementForm from "../components/DecaissementForm";
import type { Decaissement } from "../@types/decaissement";
import Layout from "../templates/Layout";

export default function Decaissements() {
  const [decaissements, setDecaissements] = useState<Decaissement[]>([]);
  const [editing, setEditing] = useState<Decaissement | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    const data = await getDecaissements();
    setDecaissements(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce décaissement ?")) return;
    await deleteDecaissement(id);
    fetchData();
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-xl mb-4">Décaissements</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => { setEditing(null); setShowForm(true); }}
        >
          Ajouter un décaissement
        </button>

        {showForm && (
          <DecaissementForm
            decaissement={editing || undefined}
            onSuccess={() => { fetchData(); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Montant</th>
              <th className="border p-2">Désignation</th>
              <th className="border p-2">Caisse</th>
              <th className="border p-2">Par</th>
              <th className="border p-2">Lien Justificatif</th>
              <th className="border p-2">Type Justificatif</th>
              <th className="border p-2">Etat Justificatif</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {decaissements.map((d) => (
              <tr key={d.id}>
                <td className="border p-2">{d.id}</td>
                <td className="border p-2">{d.montant}</td>
                <td className="border p-2">{d.designation}</td>
                <td className="border p-2">{d.caisse}</td>
                <td className="border p-2">{d.par}</td>
                <td className="border p-2">
                  {d.lien_justificatif ? (
                    <a href={d.lien_justificatif} target="_blank" rel="noopener noreferrer">
                      Voir le justificatif
                    </a>
                  ) : (
                    "Aucun justificatif"
                  )}
                </td>
                <td className="border p-2">{d.type_justificatif}</td>
                <td className="border p-2">{d.etat_justificatif}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    className="bg-yellow-500 px-2 py-1 text-white rounded"
                    onClick={() => { setEditing(d); setShowForm(true); }}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-red-600 px-2 py-1 text-white rounded"
                    onClick={() => handleDelete(d.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

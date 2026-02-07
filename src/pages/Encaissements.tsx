import React, { useEffect, useState } from "react";
import { getEncaissements, deleteEncaissement } from "../api/encaissements.api";
import type { Encaissement } from "../@types/encaissement";
import EncaissementForm from "../components/EncaissementForm";
import Layout from "../templates/Layout";
import { useTranslation } from "react-i18next";

export default function Encaissements() {
  const [encaissements, setEncaissements] = useState<Encaissement[]>([]);
  const [editing, setEditing] = useState<Encaissement | null>(null);
  const [showForm, setShowForm] = useState(false);
    const { t } = useTranslation();

  const fetchData = async () => {
    const data = await getEncaissements();
    setEncaissements(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirm_delete"))) {
      await deleteEncaissement(id);
      fetchData();
    }
  };

  return (
    <Layout>
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{t("encaissements")}</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => { setEditing(null); setShowForm(true); }}
        >
          {t("create")} 
        </button>
      </div>

      {showForm && (
        <EncaissementForm
          encaissement={editing || undefined}
          onSuccess={() => { fetchData(); setShowForm(false); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">{t("caisse")}</th>
            <th className="border px-2 py-1">{t("par")}</th>
            <th className="border px-2 py-1">{t("montant")}</th>
            <th className="border px-2 py-1">{t("date_creation")}</th>
            <th className="border px-2 py-1">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {encaissements.map((e) => (
            <tr key={e.id}>
              <td className="border px-2 py-1">{e.id}</td>
              <td className="border px-2 py-1">{e.solde}</td>
              <td className="border px-2 py-1">{e.par}</td>
              <td className="border px-2 py-1">{e.montant}</td>
              <td className="border px-2 py-1">{e.date_creation}</td>
              <td className="border px-2 py-1 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => { setEditing(e); setShowForm(true); }}
                >
                  تعديل
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(e.id)}
                >
                  حذف
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

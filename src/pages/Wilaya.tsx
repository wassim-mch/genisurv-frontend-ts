import React, { useEffect, useRef, useState } from "react";
import Layout from "../templates/Layout";
import { getWilayas, deleteWilaya } from "../api/wilayas.api";
import type { Wilaya } from "../@types/wilaya";
import WilayaForm from "../components/WilayaForm";
import { usePermissions } from "../hooks/usePermissions";
import { useTranslation } from "react-i18next";

export default function Wilayas() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingWilaya, setEditingWilaya] = useState<Wilaya | null>(null);
  const permissions = usePermissions();
  const { t } = useTranslation();

  const fetchWilayas = async () => {
    setLoading(true);
    try {
      const data = await getWilayas();
      setWilayas(data ?? []); // fallback لمصفوفة فارغة
    } catch (error) {
      console.error(error);
      setWilayas([]); // safety
    } finally {
      setLoading(false);
    }
  };

  const fetched = useRef(false);

  useEffect(() => {
    if (!permissions.includes("gerer_wilaya")) return;
    if (fetched.current) return;

    fetched.current = true;
    fetchWilayas();
  }, [permissions]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      await deleteWilaya(id);
      fetchWilayas();
    }
  };

  return (
    <Layout>
      <h1>{t("wilayas")}</h1>

      <WilayaForm
        wilaya={editingWilaya || undefined}
        onSuccess={() => {
          setEditingWilaya(null);
          fetchWilayas();
        }}
        onCancel={() => setEditingWilaya(null)}
      />

      {loading ? (
        <p>{t("loading")}</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("wilaya")}</th>
              <th className="actions-col-td">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {wilayas?.map((w) => (
              <tr key={w.id}>
                <td>{w.id}</td>
                <td>{w.nom}</td>
                <td className="actions-col">
                  <button
                    onClick={() => setEditingWilaya(w)}
                    className="btn-primary"
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="btn-secondary"
                  >
                    {t("delete")}
                  </button>
                </td>
              </tr>
            )) || null}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

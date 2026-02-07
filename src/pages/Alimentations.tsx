import React, { useEffect, useRef, useState } from "react";
import Layout from "../templates/Layout.tsx";
import { getAlimentations } from "../api/alimentations.api.ts";
import type { Alimentation } from "../@types/alimentation.ts";
import AlimentationForm from "../components/AlimentationForm.tsx";
import { usePermissions } from "../hooks/usePermissions.ts";
import { useTranslation } from "react-i18next";

export default function Alimentations() {
  const [alimentations, setAlimentations] = useState<Alimentation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Alimentation | null>(null);

  const permissions = usePermissions();
  const { t } = useTranslation();

  const fetchAlimentations = async () => {
    setLoading(true);
    try {
      const data = await getAlimentations();
      setAlimentations(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetched = useRef(false);

  useEffect(() => {
    if (!permissions.includes("gerer_alimentation")) return;
    if (fetched.current) return;

    fetched.current = true;
    fetchAlimentations();
  }, [permissions]);

  return (
    <Layout>
      <h1>{t("alimentations")}</h1>

      <AlimentationForm
        alimentation={editing || undefined}
        onSuccess={() => {
          setEditing(null);
          fetchAlimentations();
        }}
        onCancel={() => setEditing(null)}
      />

      {loading ? (
        <p>{t("loading")}</p>
      ) : (
        <table border={1} style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("caisse")}</th>
              <th>{t("par")}</th>
              <th>{t("montant")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {alimentations.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.solde}</td>
                <td>{a.par}</td>
                <td>{a.montant}</td>
                <td>
                  <button onClick={() => setEditing(a)}>
                    {t("edit")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

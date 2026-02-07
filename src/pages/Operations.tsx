import { useEffect, useState } from "react";
import { getEncaissements, getDecaissements } from "../api/operations.api";
import { usePermissions } from "../hooks/usePermissions";
import { useTranslation } from "react-i18next";
import type { Encaissement } from "../@types/encaissement";
import type { Decaissement } from "../@types/decaissement";
import Layout from "../templates/Layout";

export default function Operations() {
  const permissions = usePermissions();

  const canEncaissement = permissions.includes("voir_encaissement");
  const canDecaissement = permissions.includes("voir_decaissement");
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<
    "encaissement" | "decaissement"
  >(canEncaissement ? "encaissement" : "decaissement");

  const [encaissements, setEncaissements] = useState<Encaissement[]>([]);
  const [decaissements, setDecaissements] = useState<Decaissement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const promises: Promise<void>[] = [];

    if (canEncaissement) {
      promises.push(
        getEncaissements().then((data) => setEncaissements(data))
      );
    }

    if (canDecaissement) {
      promises.push(
        getDecaissements().then((data) => setDecaissements(data))
      );
    }

    Promise.all(promises).finally(() => setLoading(false));
  }, []);



  return (
    <Layout>
        <div>
        <h2>{t("operations")}</h2>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            {canEncaissement && (
            <button
                onClick={() => setActiveTab("encaissement")}
                style={{
                padding: "8px 14px",
                background:
                    activeTab === "encaissement" ? "#2563eb" : "#e5e7eb",
                color: activeTab === "encaissement" ? "white" : "black",
                }}
            >
                {t("encaissements")}
            </button>
            )}

            {canDecaissement && (
            <button
                onClick={() => setActiveTab("decaissement")}
                style={{
                padding: "8px 14px",
                background:
                    activeTab === "decaissement" ? "#2563eb" : "#e5e7eb",
                color: activeTab === "decaissement" ? "white" : "black",
                }}
            >
                {t("decaissements")}
            </button>
            )}
        </div>

        {/* Content */}
        {loading && <p>{t("loading")}</p>}

        {!loading && activeTab === "encaissement" && canEncaissement && (
            <table border={1} cellPadding={8}>
            <thead>
                <tr>
                <th>ID</th>
                <th>{t("montant")}</th>
                <th>{t("date_creation")}</th>
                </tr>
            </thead>
            <tbody>
                {encaissements.map((item) => (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.montant}</td>
                    <td>{item.date_creation}</td>
                </tr>
                ))}
            </tbody>
            </table>
        )}

        {!loading && activeTab === "decaissement" && canDecaissement && (
            <table border={1} cellPadding={8}>
            <thead>
                <tr>
                <th>ID</th>
                <th>{t("montant")}</th>
                <th>{t("date_creation")}</th>
                </tr>
            </thead>
            <tbody>
                {decaissements.map((item) => (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.montant}</td>
                    <td>{item.date_creation}</td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    </Layout>
  );
}

import React, { useEffect, useState } from "react"; 
import Layout from "../templates/Layout"; 
import { getCaisses } from "../api/caisses.api"; 
import { usePermissions } from "../hooks/usePermissions"; 
import { useTranslation } from "react-i18next"; 
import type { Caisse } from "../@types/caisse"; 

export default function Caisses() { 
    const th: React.CSSProperties = {
  borderBottom: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
  background: "#f5f5f5",
};

const td: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  padding: "8px",
};

    const [caisses, setCaisses] = useState<Caisse[]>([]); 
    const permissions = usePermissions(); 
    const { t } = useTranslation(); 
    const fetched = React.useRef(false); 
    useEffect(() => { 
        if (!permissions.includes("voir_tous_caisses")) return; 
        if (fetched.current) return; 
        fetched.current = true; 
        getCaisses().then(setCaisses); 
    }, [permissions]); 
  return (
  <Layout>
    <h1>{t("caisses")}</h1>

    {caisses.length === 0 ? (
      <p>{t("no_data")}</p>
    ) : (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>{t("id")}</th>
            <th style={th}>{t("wilaya")}</th>
            <th style={th}>{t("gestionnaire")}</th>
            <th style={th}>{t("solde_actuel")}</th>
            <th style={th}>{t("total_encaissements")}</th>
            <th style={th}>{t("total_alimentations")}</th>
            <th style={th}>{t("total_decaissements")}</th>
          </tr>
        </thead>
        <tbody>
          {caisses.map((c) => (
            <tr key={c.id}>
              <td style={td}>{c.id}</td>
              <td style={td}>{c.wilaya ?? t("not_defined")}</td>
              <td style={td}>{c.gestionnaire ?? t("not_defined")}</td>
              <td style={td}>{c.solde_actuel}</td>
              <td style={td}>{c.total_encaissements}</td>
              <td style={td}>{c.total_alimentations}</td>
              <td style={td}>{c.total_decaissements}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </Layout>
);

}

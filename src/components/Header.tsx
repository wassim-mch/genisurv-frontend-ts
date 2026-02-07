import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { resendEmailVerification } from "../api/auth.api";
import { FiAlertCircle } from "react-icons/fi";
import type { Caisse } from "../@types/caisse";
import { getMyCaisse } from "../api/caisses.api";

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const [caisse, setCaisse] = useState<Caisse | null>(null);

  useEffect(() => {
    getMyCaisse().then(setCaisse);
  }, []);

  const [showPopover, setShowPopover] = useState(false);
  const [showCaisse, setShowCaisse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await resendEmailVerification();
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header
      style={{
        height: "60px",
        background: "#111827",
        color: "white",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        justifyContent: "space-between",
      }}
    >
      <strong>Genisurv</strong>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {caisse && (
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onMouseEnter={() => setShowCaisse(true)}
            onMouseLeave={() => setShowCaisse(false)}
          >
            <strong>{t("balance")}: {caisse.solde_actuel} DA</strong>

            {showCaisse && (
              <div
                style={{
                  position: "absolute",
                  top: "30px",
                  right: 0,
                  background: "white",
                  color: "black",
                  padding: "10px",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  width: "220px",
                }}
              >
                <p><b>{t("total_alimentation")}:</b> {caisse.total_alimentations}</p>
                <p><b>{t("total_decaissement")}:</b> {caisse.total_decaissements}</p>
                <p><b>{t("total_encaissement")}:</b> {caisse.total_encaissements}</p>
                <p><b>{t("balance")}:</b> {caisse.solde_actuel} DA</p>
              </div>
            )}
          </div>
        )}

        <span>{user ? user.nom : ""}</span>

        <button onClick={logout}>{t("logout")}</button>

        <button onClick={() => i18n.changeLanguage("en")}>EN</button>
        <button onClick={() => i18n.changeLanguage("fr")}>FR</button>
        <button onClick={() => i18n.changeLanguage("ar")}>AR</button>

        {user && user.email_verification === false && (
          <div style={{ position: "relative" }}>
            <FiAlertCircle
              color="orange"
              size={20}
              style={{ cursor: "pointer" }}
              onClick={() => setShowPopover(!showPopover)}
            />

            {showPopover && (
              <div
                style={{
                  position: "absolute",
                  top: "30px",
                  right: 0,
                  background: "white",
                  color: "black",
                  padding: "10px",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  width: "220px",
                }}
              >
                <p style={{ marginBottom: 10 }}>
                  {t("verify_email_msg")}
                </p>
                <button
                  onClick={handleResend}
                  disabled={loading}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: 4,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  {loading ? t("sending") : t("send_verification")}
                </button>

                {message && <p style={{ color: "green", marginTop: 8 }}>{message}</p>}
                {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

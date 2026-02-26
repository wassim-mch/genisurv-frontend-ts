import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { resendEmailVerification } from "../api/auth.api";
import type { Caisse } from "../@types/caisse";
import { getMyCaisse } from "../api/caisses.api";
import {
  FiAlertCircle,
  FiLogOut,
  FiDollarSign,
  FiUser,
  FiGlobe,
} from "react-icons/fi";

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
    <header className="app-header">
      {/* Brand / Logo */}
      <div className="brand">Genisurv</div>

      <div className="header-actions">
        {/* Caisse with icon */}
        {caisse && (
          <div
            className="header-popover"
            onMouseEnter={() => setShowCaisse(true)}
            onMouseLeave={() => setShowCaisse(false)}
          >
            <strong>
              <FiDollarSign style={{ marginRight: 5 }} />
              {t("balance")}: {caisse.solde_actuel} DA
            </strong>

            {showCaisse && (
              <div className="popover-content">
                <p>
                  <FiDollarSign style={{ marginRight: 5 }} />
                  <b>{t("total_alimentation")}:</b> {caisse.total_alimentations}
                </p>
                <p>
                  <FiDollarSign style={{ marginRight: 5 }} />
                  <b>{t("total_decaissement")}:</b> {caisse.total_decaissements}
                </p>
                <p>
                  <FiDollarSign style={{ marginRight: 5 }} />
                  <b>{t("total_encaissement")}:</b> {caisse.total_encaissements}
                </p>
                <p>
                  <FiDollarSign style={{ marginRight: 5 }} />
                  <b>{t("balance")}:</b> {caisse.solde_actuel} DA
                </p>
              </div>
            )}
          </div>
        )}

        {/* User name with icon */}
        {/* <span>
          <FiUser style={{ marginRight: 5 }} />
          {user ? user.nom : ""}
        </span> */}

        

        {/* Language buttons with globe icon */}
        <button onClick={() => i18n.changeLanguage("en")} className="btn-lang">
          <FiGlobe style={{ marginRight: 3 }} /> EN
        </button>
        <button onClick={() => i18n.changeLanguage("fr")} className="btn-lang">
          <FiGlobe style={{ marginRight: 3 }} /> FR
        </button>
        <button onClick={() => i18n.changeLanguage("ar")} className="btn-lang">
          <FiGlobe style={{ marginRight: 3 }} /> AR
        </button>

        {/* Logout with icon */}
        <button onClick={logout} className="btn-logout">
          <FiLogOut style={{ marginRight: 5 }} />
          {t("logout")}
        </button>

        {/* Email verification alert with icon */}
        {user && user.email_verification === false && (
          <div
            className="email-alert"
            onClick={() => setShowPopover(!showPopover)}
          >
            <FiAlertCircle size={20} />

            {showPopover && (
              <div className="popover-content">
                <p>{t("verify_email_msg")}</p>
                <button onClick={handleResend} disabled={loading}>
                  {loading ? t("sending") : t("send_verification")}
                </button>
                {message && (
                  <p style={{ color: "green", marginTop: 5 }}>{message}</p>
                )}
                {error && <p style={{ color: "red", marginTop: 5 }}>{error}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

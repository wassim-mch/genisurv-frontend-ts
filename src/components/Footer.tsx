import { useTranslation } from "react-i18next";

export default function Footer() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <footer className={`app-footer ${isRTL ? "rtl" : ""}`}>
      <div className="footer-left">
        © {new Date().getFullYear()} Genisurv
      </div>

      <div className="footer-center">
        v1.0.0
      </div>

      <div className="footer-right">
        All rights reserved.
      </div>
    </footer>
  );
}
import { Link } from "react-router-dom";
import { sidebarMenu } from "../utils/sidebarMenu";
import { usePermissions } from "../hooks/usePermissions";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const permissions = usePermissions();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  return (
    <aside
      style={{
        width: "220px",
        background: "#1f2937",
        color: "white",
        padding: "20px",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <h3>{t("dashboard")}</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {sidebarMenu.map((item) => {
          const hasPermission = Array.isArray(item.permission)
            ? item.permission.some(p => permissions.includes(p))
            : permissions.includes(item.permission);

          if (!hasPermission) return null;

          return (
            <li key={item.path} style={{ marginBottom: "10px" }}>
              <Link
                to={item.path}
                style={{ color: "white", textDecoration: "none" }}
              >
                {t(item.label.toLowerCase())}
              </Link>
            </li>
          );
        })}
      </ul>

    </aside>
  );
}

import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { sidebarMenu } from "../utils/sidebarMenu";
import { usePermissions } from "../hooks/usePermissions";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const permissions = usePermissions();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  return (
    <aside className={`sidebar ${isRTL ? "rtl" : ""}`}>
      <h3 className="sidebar-title">{t("dashboard")}</h3>

      <ul className="sidebar-menu">
        {sidebarMenu.map((item) => {
          const hasPermission = Array.isArray(item.permission)
            ? item.permission.some((p) => permissions.includes(p))
            : permissions.includes(item.permission);

          if (!hasPermission) return null;

          const Icon = item.icon;

          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                {Icon && <Icon className="sidebar-icon" />}
                <span>{t(item.label.toLowerCase())}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

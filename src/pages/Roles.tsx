import React, { use, useEffect, useRef, useState } from "react";
import Layout from "../templates/Layout";
import { getRoles, deleteRole } from "../api/roles.api";
import type { Role } from "../@types/role";
import RolesForm from "../components/RolesForm";
import { usePermissions } from "../hooks/usePermissions";
import { useTranslation } from "react-i18next";

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const permissions = usePermissions();
  const { t } = useTranslation();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
    } finally {
      setLoading(false);
    }
  };
  
  const fetched = useRef(false);

  useEffect(() => {
    if (!permissions.includes("gerer_role")) return;
    if (fetched.current) return;

    fetched.current = true;
    fetchRoles();
  }, [permissions]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      await deleteRole(id);
      fetchRoles();
    }
  };

  return (
    <Layout>
      <h1>{t("roles")}</h1>

      {/* Form create / edit */}
      <RolesForm
        role={editingRole || undefined}
        onSuccess={() => {
          setEditingRole(null);
          fetchRoles();
        }}
        onCancel={() => setEditingRole(null)}
      />

      {loading ? (
        <p>{t("loading")}</p>
      ) : (
        <table border={1} style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("role")}</th>
              <th>{t("permissions")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.permissions.join(", ")}</td>
                <td>
                  <button onClick={() => setEditingRole(r)}>{t("edit")}</button>
                  <button onClick={() => handleDelete(r.id)}>{t("delete")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

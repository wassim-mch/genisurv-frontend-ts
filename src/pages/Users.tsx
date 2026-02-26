import React, { useEffect, useRef, useState } from "react";
import Layout from "../templates/Layout";
import { getUsers, deleteUser } from "../api/users.api";
import { usePermissions } from "../hooks/usePermissions";
import type { User } from "../@types/user";
import UsersForm from "../components/UsersForm";
import { useTranslation } from "react-i18next";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const permissions = usePermissions();
  const { t } = useTranslation();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const fetched = useRef(false);

  useEffect(() => {
    if (!permissions.includes("gerer_user")) return;
    if (fetched.current) return;

    fetched.current = true;
    fetchUsers();
  }, [permissions]);

  const handleDelete = async (id: number) => {
    if (confirm(t("confirm_delete"))) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  return (
    <Layout>
      <div className="users-container">
        <div className="users-header">
          <h1>{t("users")}</h1>
        </div>

        <div className="users-form-wrapper">
          <UsersForm
            user={editingUser || undefined}
            onSuccess={() => {
              setEditingUser(null);
              fetchUsers();
            }}
            onCancel={() => setEditingUser(null)}
          />
        </div>

        {loading ? (
          <div className="users-loading">{t("loading")}...</div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t("name")}</th>
                  <th>{t("email")}</th>
                  <th>{t("role")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nom}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="role-badge">{u.role}</span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-edit"
                        onClick={() => setEditingUser(u)}
                      >
                        {t("edit")}
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(u.id)}
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

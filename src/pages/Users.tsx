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
      <h1>{t("users")}</h1>

      <UsersForm
        user={editingUser || undefined}
        onSuccess={() => {
          setEditingUser(null);
          fetchUsers();
        }}
        onCancel={() => setEditingUser(null)}
      />

      {loading ? (
        <p>{t("loading")}</p>
      ) : (
        <table border={1} style={{ width: "100%", marginTop: "10px" }}>
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
                <td>{u.role}</td>
                <td>
                  <button onClick={() => setEditingUser(u)}>
                    {t("edit")}
                  </button>

                  <button onClick={() => handleDelete(u.id)}>
                    {t("delete")}
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

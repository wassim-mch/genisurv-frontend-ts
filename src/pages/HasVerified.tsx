import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyEmail } from "../api/auth.api";
import Layout from "../templates/Layout";
import { useAuth } from "../hooks/useAuth";

export default function HasVerified() {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState("Vérification en cours...");
  const [error, setError] = useState("");
  const { refreshUser } = useAuth(); 

  useEffect(() => {
    if (!token) {
      setError("Token manquant");
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyEmail(token);
        setMessage(res.data.message || "Email vérifié avec succès");
        await refreshUser(); 
      } catch (err: any) {
        setError(err.response?.data?.message || "Erreur de vérification de l'email");
      }
    };

    verify();
  }, [token]);

  return (
    <Layout>
      <h2>Email Verification</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Layout>
  );
}

import PasswordForm from "../components/PasswordForm";
import Layout from "../templates/Layout";

export default function ChangePassword() {

  return (
    <Layout>
      <div style={{ maxWidth: "400px", margin: "50px auto" }}>
        <h2>Changer le mot de passe</h2>
        <PasswordForm />
      </div>
    </Layout>
  );
}

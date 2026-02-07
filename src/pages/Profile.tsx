import ProfileForm from "../components/ProfileForm";
import Layout from "../templates/Layout";

export default function Profile() {
  return (
    <Layout>
      <div style={{ maxWidth: "500px", margin: "50px auto" }}>
        <h2>Profil utilisateur</h2>
        <ProfileForm />
      </div>
    </Layout>
  );
}

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Users from "./pages/Users.tsx";
import Caisses from "./pages/Caisses.tsx";
import ProtectedRoute, { ProtectedLogin } from "./routes/ProtectedRoute";
import PermissionRoute from "./routes/PermissionRoute";
import Roles from "./pages/Roles.tsx";
import Wilayas from "./pages/Wilaya.tsx";
import Alimentations from "./pages/Alimentations.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import HasVerified from "./pages/HasVerified.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import ChangePassword from "./pages/ChangePassword.tsx";
import Profile from "./pages/Profile.tsx";
import Operations from "./pages/Operations.tsx";
import Encaissements from "./pages/Encaissements.tsx";
import Decaissements from "./pages/Decaissement.tsx";

function App() {
  return (
    <Routes>
      
      <Route
        path="/forget-password"
        element={<ForgotPassword />}
      />

      <Route path="/login" element={<ProtectedLogin><Login /></ProtectedLogin>} />

      <Route
        path="/change-password"
        element={<ProtectedRoute><ChangePassword /></ProtectedRoute>}
      />

      <Route
        path="/profile"
        element={<ProtectedRoute><Profile /></ProtectedRoute>}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operations"
        element={
          <ProtectedRoute>
            <PermissionRoute permission="voir_encaissement">
              <Operations />
            </PermissionRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <PermissionRoute permission="gerer_user">
              <Users />
            </PermissionRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/caisses"
        element={
          <ProtectedRoute>
            <PermissionRoute permission="voir_tous_caisses">
              <Caisses />
            </PermissionRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/roles"
        element={
          <ProtectedRoute>
            <PermissionRoute permission="gerer_role">
              <Roles />
            </PermissionRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/wilayas"
        element={
          <ProtectedRoute>
            <PermissionRoute permission="gerer_wilaya">
              <Wilayas />
            </PermissionRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/verify-email/:token"
        element={<HasVerified />}
      />


      <Route
        path="/alimentation"
        element={
          <ProtectedRoute>
            <PermissionRoute permission="gerer_alimentation">
              <Alimentations />
            </PermissionRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/encaissement"
        element={
          <ProtectedRoute>
            <PermissionRoute permission="gerer_encaissement">
              <Encaissements />
            </PermissionRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/decaissement"
        element={
          <ProtectedRoute>
            <PermissionRoute permission="gerer_decaissement">
              <Decaissements />
            </PermissionRoute>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}


export default App;

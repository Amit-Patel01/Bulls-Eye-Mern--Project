import { Navigate } from "react-router-dom";

// sign-up handled via Google on the login page
export default function Signup() {
  return <Navigate to="/" replace />;
}

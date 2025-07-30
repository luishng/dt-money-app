import "./src/styles/global.css";

import NavigationRoutes from "@/routes";

import { AuthContextProvider } from "@/context/auth.context";
import { SnackbarContextProvider } from "@/context/snackbar.context";
import { SnackBar } from "@/components/Snackbar";

export default function App() {
  return (
    <SnackbarContextProvider>
      <AuthContextProvider>
        <NavigationRoutes />
        <SnackBar />
      </AuthContextProvider>
    </SnackbarContextProvider>
  );
}

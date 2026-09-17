import AppRouter from './routes';
import { AuthProvider } from './modules/auth/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

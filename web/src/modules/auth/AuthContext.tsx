// AuthContext — cung cấp { user, token, login, logout, isAuthenticated }
// Dev 2 & Dev 3 import và dùng hook useAuth() từ file này
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'admin' | 'parent' | 'child' | 'grandparent';
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  loginWithGoogle: (idToken: string) => Promise<AuthUser>;
  register: (data: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  // accessToken chỉ lưu in-memory (biến state)
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  // isLoading = true khi đang thử restore session qua refreshToken
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session khi reload trang ──────────────────────────────────────
  useEffect(() => {
    const savedRefreshToken = sessionStorage.getItem('kl_rt');
    if (!savedRefreshToken) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: savedRefreshToken }),
        });
        const json = await res.json();
        if (json.success && json.data?.token) {
          const payload = parseJwtPayload(json.data.token);
          if (payload) {
            setToken(json.data.token);
            setUser({
              id: payload.id,
              email: payload.email || '',
              fullName: payload.fullName || '',
              role: payload.role,
            });
          }
        } else {
          sessionStorage.removeItem('kl_rt');
        }
      } catch {
        sessionStorage.removeItem('kl_rt');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();

    if (!json.success) {
      const msg =
        json.error?.code === 'INVALID_CREDENTIALS'
          ? 'Email hoặc mật khẩu không đúng'
          : json.error?.message || 'Đăng nhập thất bại';
      throw new Error(msg);
    }

    const { token: accessToken, refreshToken, user: userData } = json.data;
    setToken(accessToken);
    setUser(userData);
    sessionStorage.setItem('kl_rt', refreshToken);
    return userData;
  }, []);

  // ── Google Login ──────────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async (idToken: string) => {
    const res = await fetch(`${API_BASE}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    const json = await res.json();

    if (!json.success) {
      throw new Error(json.error?.message || 'Đăng nhập Google thất bại');
    }

    const { token: accessToken, refreshToken, user: userData } = json.data;
    setToken(accessToken);
    setUser(userData);
    sessionStorage.setItem('kl_rt', refreshToken);
    return userData;
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(async (data: RegisterPayload) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (!json.success) {
      const msg =
        json.error?.code === 'EMAIL_ALREADY_EXISTS'
          ? 'Email này đã được sử dụng'
          : json.error?.message || 'Đăng ký thất bại';
      throw new Error(msg);
    }

    const { token: accessToken, refreshToken, user: userData } = json.data;
    setToken(accessToken);
    setUser(userData);
    sessionStorage.setItem('kl_rt', refreshToken);
    return userData;
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('kl_rt');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseJwtPayload(token: string): any {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default AuthContext;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authApi from '../api/authApi';
import type { AuthUser } from '../api/authApi';

// ─── State ───
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // true after checking stored token
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

// ─── Thunks ───
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await authApi.login(credentials.email, credentials.password);
      return result.user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; fullName: string; role: 'PARENT' | 'EXPERT' }, { rejectWithValue }) => {
    try {
      return await authApi.register(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    await authApi.logout();
  }
);

export const initAuthThunk = createAsyncThunk(
  'auth/init',
  async (_, { rejectWithValue }) => {
    try {
      const token = await authApi.getAccessToken();
      if (!token) return null;

      // Try to get user profile with stored token
      const { fetchApi } = await import('../api/client');
      const response = await fetchApi<AuthUser>('/api/v1/users/me');
      return response;
    } catch {
      // Token invalid or expired — try refresh
      try {
        await authApi.refreshTokens();
        const { fetchApi } = await import('../api/client');
        const response = await fetchApi<AuthUser>('/api/v1/users/me');
        return response;
      } catch {
        await authApi.clearTokens();
        return rejectWithValue('Session expired');
      }
    }
  }
);

// ─── Slice ───
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // Init Auth (check stored token on app launch)
    builder
      .addCase(initAuthThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initAuthThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(initAuthThunk.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;

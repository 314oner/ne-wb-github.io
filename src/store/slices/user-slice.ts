import { userMapper } from "@/entities/user/model/user.mapper";
import { authApi } from "@/shared/api/auth-api";
import { userApi } from "@/shared/api/user-api";
import type { UpdateUserDto, User } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface UserState {
  current: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: UserState = {
  current: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
};

export const fetchCurrentUser = createAsyncThunk("user/fetchCurrent", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getCurrentUser();
    return userMapper.toEntity(response.data);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Not authenticated");
  }
});

export const updateUserProfile = createAsyncThunk<User, UpdateUserDto, { rejectValue: string }>(
  "user/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userApi.updateProfile(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  },
);

export const deleteUserAccount = createAsyncThunk("user/deleteAccount", async (_, { rejectWithValue, dispatch }) => {
  try {
    await userApi.deleteAccount();
    dispatch(logout());
    return true;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Delete failed");
  }
});

export const logoutUser = createAsyncThunk("user/logout", async (_, { dispatch }) => {
  try {
    await authApi.logout();
  } catch (err) {
    console.error("Logout request failed, clearing local state anyway", err);
  }
  dispatch(logout());
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User }>) {
      state.current = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout(state) {
      state.current = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.current = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.initialized = true;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setCredentials, logout, clearError } = userSlice.actions;
export default userSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.user.current;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserInitialized = (state: RootState) => state.user.initialized;

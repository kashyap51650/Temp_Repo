import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserUIState {
  isLoading: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";
  preferences: {
    tablePageSize: number;
    defaultView: string;
    notifications: boolean;
  };
}

const initialState: UserUIState = {
  isLoading: false,
  sidebarCollapsed: false,
  theme: "light",
  preferences: {
    tablePageSize: 10,
    defaultView: "grid",
    notifications: true,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },

    setTheme(state, action: PayloadAction<"light" | "dark" | "system">) {
      state.theme = action.payload;
    },

    updatePreferences(
      state,
      action: PayloadAction<Partial<UserUIState["preferences"]>>
    ) {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    resetUserUI(_state) {
      return initialState;
    },
  },
});

export const {
  setLoading,
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  updatePreferences,
  resetUserUI,
} = userSlice.actions;

export default userSlice.reducer;

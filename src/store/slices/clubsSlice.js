import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

// Async thunks
export const fetchClubs = createAsyncThunk(
  'clubs/fetchClubs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/clubs', { params });
      return response; // { success, data, pagination }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchClubById = createAsyncThunk(
  'clubs/fetchClubById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/clubs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchClubJerseys = createAsyncThunk(
  'clubs/fetchClubJerseys',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/clubs/${id}/jerseys`, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Slice
const initialState = {
  items: [],
  selectedClub: null,
  clubJerseys: [],
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0 },
};

const clubsSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    clearSelectedClub: (state) => {
      state.selectedClub = null;
    },
  },
  extraReducers: (builder) => {
    // fetchClubs
    builder
      .addCase(fetchClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch clubs';
      });

    // fetchClubById
    builder
      .addCase(fetchClubById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClub = action.payload;
      })
      .addCase(fetchClubById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch club';
      });

    // fetchClubJerseys
    builder
      .addCase(fetchClubJerseys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubJerseys.fulfilled, (state, action) => {
        state.loading = false;
        state.clubJerseys = action.payload.data;
      })
      .addCase(fetchClubJerseys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch club jerseys';
      });
  },
});

export const { clearSelectedClub } = clubsSlice.actions;
export default clubsSlice.reducer;

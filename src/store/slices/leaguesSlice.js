import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

// Async thunks
export const fetchLeagues = createAsyncThunk(
  'leagues/fetchLeagues',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/leagues', { params });
      return response; // { success, data, pagination }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchLeagueById = createAsyncThunk(
  'leagues/fetchLeagueById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/leagues/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchLeagueClubs = createAsyncThunk(
  'leagues/fetchLeagueClubs',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/leagues/${id}/clubs`, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchLeagueJerseys = createAsyncThunk(
  'leagues/fetchLeagueJerseys',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/leagues/${id}/jerseys`, { params });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Slice
const initialState = {
  items: [],
  selectedLeague: null,
  leagueClubs: [],
  leagueJerseys: [],
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0 },
};

const leaguesSlice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {
    clearSelectedLeague: (state) => {
      state.selectedLeague = null;
    },
  },
  extraReducers: (builder) => {
    // fetchLeagues
    builder
      .addCase(fetchLeagues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch leagues';
      });

    // fetchLeagueById
    builder
      .addCase(fetchLeagueById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeagueById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLeague = action.payload;
      })
      .addCase(fetchLeagueById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch league';
      });

    // fetchLeagueClubs
    builder
      .addCase(fetchLeagueClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeagueClubs.fulfilled, (state, action) => {
        state.loading = false;
        state.leagueClubs = action.payload.data;
      })
      .addCase(fetchLeagueClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch league clubs';
      });

    // fetchLeagueJerseys
    builder
      .addCase(fetchLeagueJerseys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeagueJerseys.fulfilled, (state, action) => {
        state.loading = false;
        state.leagueJerseys = action.payload.data;
      })
      .addCase(fetchLeagueJerseys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch league jerseys';
      });
  },
});

export const { clearSelectedLeague } = leaguesSlice.actions;
export default leaguesSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

// Async thunks
export const fetchJerseys = createAsyncThunk(
  'jerseys/fetchJerseys',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/jerseys', { params });
      return response; // { success, data, pagination }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchJerseyById = createAsyncThunk(
  'jerseys/fetchJerseyById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/jerseys/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createJersey = createAsyncThunk(
  'jerseys/createJersey',
  async (jerseyData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/jerseys', jerseyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateJersey = createAsyncThunk(
  'jerseys/updateJersey',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/jerseys/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteJersey = createAsyncThunk(
  'jerseys/deleteJersey',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/jerseys/${id}`);
      return id; // Return the deleted ID
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Slice
const initialState = {
  items: [],
  selectedJersey: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0 },
};

const jerseysSlice = createSlice({
  name: 'jerseys',
  initialState,
  reducers: {
    clearSelectedJersey: (state) => {
      state.selectedJersey = null;
    },
  },
  extraReducers: (builder) => {
    // fetchJerseys
    builder
      .addCase(fetchJerseys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJerseys.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchJerseys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch jerseys';
      });

    // fetchJerseyById
    builder
      .addCase(fetchJerseyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJerseyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedJersey = action.payload;
      })
      .addCase(fetchJerseyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch jersey';
      });

    // createJersey
    builder
      .addCase(createJersey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJersey.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createJersey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create jersey';
      });

    // updateJersey
    builder
      .addCase(updateJersey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJersey.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((j) => j.jersey_id === action.payload.jersey_id);
        if (index !== -1) state.items[index] = action.payload;
        if (state.selectedJersey?.jersey_id === action.payload.jersey_id) {
          state.selectedJersey = action.payload;
        }
      })
      .addCase(updateJersey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update jersey';
      });

    // deleteJersey
    builder
      .addCase(deleteJersey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJersey.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((j) => j.jersey_id !== action.payload);
      })
      .addCase(deleteJersey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to delete jersey';
      });
  },
});

export const { clearSelectedJersey } = jerseysSlice.actions;
export default jerseysSlice.reducer;

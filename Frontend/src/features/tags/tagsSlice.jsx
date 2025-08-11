import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const BACKEND_URL = import.meta.env.VITE_API_URL || "https://emotionary-backend.vercel.app";

export const fetchTags = createAsyncThunk('tags/fetchTags', async (_, { getState }) => {
  const userId = getState().auth.userId;
  const response = await fetch(`${BACKEND_URL}/tags/${userId}`);
  if (!response.ok) {
    throw new Error('failed to fetch tags');
  }
  const data = await response.json();
  return data;
});

const tagsSlice = createSlice({
  name: 'tags',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default tagsSlice.reducer;
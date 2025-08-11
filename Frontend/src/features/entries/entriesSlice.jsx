import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = "https://emotionary-api.onrender.com";

export const fetchEntries = createAsyncThunk('entries/fetchEntries', async (_, { getState }) => {
    const userId = getState().auth.userId;
    const res = await fetch(`${BACKEND_URL}/users/${userId}/entries`);
    return await res.json();
});

export const filterEntries = createAsyncThunk('entries/filterEntries', async (_, { getState }) => {
    const userId = getState().auth.userId;
    const { startDate, endDate, mood, favorite, page, tagId, deleted, limit } = getState().entries.filters;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (mood) params.append('mood', mood);
    if (favorite) params.append('favorite', favorite);
    if (tagId) params.append('tagId', tagId);
    params.append('deleted', deleted === true ? 'true' : 'false');
    params.append('page', page);
    const res = await fetch(`${BACKEND_URL}/entries/filter/${userId}?${params.toString()}`);
    const data = await res.json();
    return {
      filteredEntries: data.entries,
      totalEntries: data.totalEntries,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
    };
});

export const favoriteEntry = createAsyncThunk('entries/favoriteEntry', async (entry) => {
    const update = entry.favorite === true ? false : true;
    const res = await fetch(`${BACKEND_URL}/entries/${entry._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: update }),
    });
    return await res.json();
});

export const hardDeleteEntry = createAsyncThunk('entries/hardDeleteEntry', async (entry) => {
    const res = await fetch(`${BACKEND_URL}/entries/${entry._id}`, { method: 'DELETE' });
    return await res.json();
});

export const softDeleteEntry = createAsyncThunk('entries/softDeleteEntry', async (entry) => {
    const res = await fetch(`${BACKEND_URL}/entries/${entry._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleted: true, deletedAt: new Date() }),
    });
    return await res.json();
});

export const restoreEntry = createAsyncThunk('entries/restore', async (entry) => {
    const res = await fetch(`${BACKEND_URL}/entries/${entry._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleted: false, deletedAt: null }),
    });
    return await res.json();
});

export const entriesSlice = createSlice({
  name: "entries",
  initialState: {
    entries: [], // encrypted entries
    filteredEntries: [],
    activeEntry: null, // just the ID of the active entry
    filters: {
      startDate: null,
      endDate: null,
      mood: null,
      favorite: undefined,
      tagId: null,
      deleted: false,
      page: 1,
      limit: 9,
    },
    pagination: {
      totalEntries: 0,
      totalPages: 1,
      currentPage: 1,
    },
  },

  reducers: {
    selectEntry(state, action) {
      const selectEntry = state.activeEntry = action.payload;
      state.activeEntry = selectEntry || null;
    },
    resetEntry(state, action) {
      state.activeEntry = null;
    },
    setFilter(state, action) {
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: 1,
      };
    },
    resetFilter(state, action) {
      state.filters = {
        startDate: null,
        endDate: null,
        mood: null,
        favorite: undefined,
        tagId: null,
        deleted: false,
        page: 1,
        limit: 9,
      };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.entries = action.payload;
      })
      .addCase(filterEntries.fulfilled, (state, action) => {
        state.filteredEntries = action.payload.filteredEntries;
        state.pagination = {
          totalEntries: action.payload.totalEntries,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
        };
      })
      .addCase(favoriteEntry.fulfilled, (state, action) => {
        const entry = action.payload;
        const index = state.entries.findIndex((e) => e._id === entry._id);
        
        if (index !== -1) {
          state.entries[index] = entry;
        }
        
        const filteredIndex = state.filteredEntries.findIndex((e) => e._id === entry._id);
        if (filteredIndex !== -1) {
          state.filteredEntries[filteredIndex] = entry;
        }
      })
      .addCase(hardDeleteEntry.fulfilled, (state, action) => {
        const entry = action.payload;
        const index = state.filteredEntries.findIndex((e) => e._id === entry._id);
        if (index !== -1) {
          state.filteredEntries.splice(index, 1);
        }
      })
      .addCase(softDeleteEntry.fulfilled, (state, action) => {
        const entry = action.payload;
        state.entries = state.entries.filter(e => e._id !== entry._id);

        if (!state.filters.deleted) {
          state.filteredEntries = state.filteredEntries.filter(e => e._id !== entry._id);
        }
      })
      .addCase(restoreEntry.fulfilled, (state, action) => {
        const entry = action.payload;
        state.entries.push(entry);

        if (state.filters.deleted) {
          state.filteredEntries = state.filteredEntries.filter(e => e._id !== entry._id);
        }
      });      
  },
});

export const { selectEntry, resetEntry, setFilter, resetFilter, setPage } = entriesSlice.actions;

export default entriesSlice.reducer;
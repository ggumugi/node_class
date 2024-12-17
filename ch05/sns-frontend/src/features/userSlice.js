import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const userSlice = createSlice({
   name: 'user',
   initialState: {
      posts: [],
      post: null,
      pagination: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {},
})

export default userSlice.reducer

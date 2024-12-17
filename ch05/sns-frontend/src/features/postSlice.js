import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createPost, updatePost, deletePost, getPostById } from '../api/snsApi'

// 게시물 등록 thunk
export const createPostThunk = createAsyncThunk('posts/createPost', async (postData, { rejectWithValue }) => {
   try {
      const response = await createPost(postData)
      return response.data.post
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '게시물 등록 실패')
   }
})

// 게시물 수정 thunk
export const updatePostThunk = createAsyncThunk('posts/updatePost', async (data, { rejectWithValue }) => {})

// 게시물 삭제 thunk
export const deletePostThunk = createAsyncThunk('posts/deletePost', async (id, { rejectWithValue }) => {})

// 특정 게시물 조회 thunk
export const fetchPostByIdThunk = createAsyncThunk('posts/fetchPostByIdPost', async (id, { rejectWithValue }) => {})

const postSlice = createSlice({
   name: 'posts',
   initialState: {
      posts: [],
      post: null,
      pagination: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(createPostThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createPostThunk.fulfilled, (state, action) => {
            state.loading = false
            state.posts = [...state.posts, action.payload]
         })
         .addCase(createPostThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default postSlice.reducer

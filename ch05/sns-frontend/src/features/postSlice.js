import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createPost, updatePost, deletePost, getPostById, getPosts } from '../api/snsApi'

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
export const updatePostThunk = createAsyncThunk('posts/updatePost', async (data, { rejectWithValue }) => {
   try {
      const { id, postData } = data
      const response = await updatePost(id, postData)
      return response.data.post
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '게시물 삭제 실패')
   }
})

// 게시물 삭제 thunk
export const deletePostThunk = createAsyncThunk('posts/deletePost', async (id, { rejectWithValue }) => {
   try {
      // eslint-disable-next-line
      const response = await deletePost(id)
      return id // 삭제 후 삭제된 게시물의 id만 반환
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '게시물 삭제 실패')
   }
})

// 특정 게시물 조회 thunk
export const fetchPostByIdThunk = createAsyncThunk('posts/fetchPostById', async (id, { rejectWithValue }) => {
   try {
      const response = await getPostById(id)
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '특정 게시물 조회 실패')
   }
})

// 전체 게시물 리스트 가져오기
export const fetchPostsThunk = createAsyncThunk('posts/fetchPosts', async (page, { rejectWithValue }) => {
   try {
      const response = await getPosts(page)
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '전체 게시물 조회 실패')
   }
})

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
      builder
         .addCase(updatePostThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updatePostThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(updatePostThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      builder
         .addCase(fetchPostsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPostsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.posts = action.payload.posts
            state.pagination = action.payload.pagination
         })
         .addCase(fetchPostsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      builder
         .addCase(fetchPostByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPostByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.post = action.payload.post
         })
         .addCase(fetchPostByIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      builder
         .addCase(deletePostThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deletePostThunk.fulfilled, (state, action) => {
            state.loading = false
            // 메인 페이지를 새로고침 하지 않아도 게시물이 없어짐
            // posts state가 변경 되면서 재 랜더링 되고 게시물이 삭제된 것이 최신화 된다
            // state.posts = state.posts.filter((post) => post.id !== action.payload) // 삭제된 게시물 posts state에서 제거
         })
         .addCase(deletePostThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default postSlice.reducer

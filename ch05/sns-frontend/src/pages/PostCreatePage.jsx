import { Container } from '@mui/material'
import PostForm from '../components/post/PostForm'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createPostThunk } from '../features/postSlice'
import { useCallback } from 'react'
const PostCreatePage = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const handleSubmit = useCallback(
      (postData) => {
         // postData  -  사용자가 입력한 게시물 데이터
         dispatch(createPostThunk(postData))
            .unwrap()
            .then(() => {
               navigate('/') // 등록 후 메인 페이지 이동
            })
            .catch((err) => {
               console.error('게시물 등록 실패 : ', err)
               alert('게시물을 등록할 수 없습니다.', err)
            })
      },
      [dispatch, navigate]
   )
   return (
      <Container maxWidth="md">
         <h1>게시물 등록</h1>
         <PostForm onSubmit={handleSubmit} />
      </Container>
   )
}

export default PostCreatePage

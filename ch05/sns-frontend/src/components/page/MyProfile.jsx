import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useCallback } from 'react'
import { getProfileThunk, getProfileIdThunk } from '../../features/pageSlice'
import { followUserThunk } from '../../features/userSlice'

const MyProfile = ({ auth }) => {
   const { id } = useParams() // 게시물 이름 클릭시 id 존재, navbar 이름 클릭시 id x
   const [followers, setFollowers] = useState(0) // 팔로워 수
   const [followings, setFollowings] = useState(0) // 팔로잉 수
   const [follow, setFollow] = useState(false) // 팔로우 여부
   const dispatch = useDispatch()
   const { user } = useSelector((state) => state.page)

   const fetchProfileData = useCallback(() => {
      if (id) {
         // 게시물의 이름을 클릭해서 들어온 경우
         dispatch(getProfileIdThunk(id))
            .unwrap()
            .then((result) => {
               setFollowers(result.Followers.length)
               setFollowings(result.Followings.length)
            })
            .catch((err) => {
               console.error('사용자 정보 가져오는 중 오류 발생', err)
               alert('사용자 정보 가져오기를 실패했습니다.', err)
            })
      } else {
         //navbar의 이름을 클릭해서 들어온 경우
         dispatch(getProfileThunk())
            .unwrap()
            .then((result) => {
               setFollowers(result.Followers.length)
               setFollowings(result.Followings.length)
            })
            .catch((err) => {
               console.error('사용자 정보 가져오는 중 오류 발생', err)
               alert('사용자 정보 가져오기를 실패했습니다.', err)
            })
      }
   }, [dispatch, id])

   useEffect(() => {
      fetchProfileData()
   }, [fetchProfileData, follow])

   const onClickFollow = useCallback(
      (id) => {
         dispatch(followUserThunk(id))
            .unwrap()
            .then(() => {
               alert('팔로우 되었습니다.')
               setFollow((prev) => !prev) // follow 상태 true로 변경
            })
            .catch((err) => {
               console.error('팔로우 실패 : ', err)
               alert('팔로우를 실패했습니다.')
            })
      },
      [dispatch]
   )
   return (
      <>
         {user && (
            <Card sx={{ minWidth: 275 }}>
               <CardContent>
                  <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                     {user.email}
                  </Typography>
                  <Typography variant="h5" component="div">
                     {user.nick}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>자기소개</Typography>
                  <Typography variant="body2">
                     {followers} Followers &nbsp;&nbsp;&nbsp; {followings} Followings
                  </Typography>
               </CardContent>
               <CardActions sx={{ p: 2 }}>
                  <Button
                     variant="contained"
                     onClick={() => onClickFollow(`${user.id}`)}
                     // 내 페이지 이거나(메뉴바에서 내 이름 클릭) 로그인한 사람의 id와 내 페이지의 path 파라메터 :id가 같거나(게시글에서 내 이름 클릭) 이미 팔로우를 한 사용자의 경우
                     disabled={!id || String(auth.id) === String(id) || user.Followers.filter((f) => f.id === auth.id).length > 0 ? true : false}
                  >
                     Follow
                  </Button>
               </CardActions>
            </Card>
         )}
      </>
   )
}
export default MyProfile

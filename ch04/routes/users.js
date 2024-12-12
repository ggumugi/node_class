const express = require('express')
const User = require('../models/user')
const Comment = require('../models/comment')
const router = express.Router()

router
    .route('/')
    // get 요청 : 모든 사용자 조회
    .get(async (req,res,next) => {
        try{
            const users = await User.findAll() // 모든 사용자 데이터를 DB에서 조회
            res.status(200).json(users) // JSON 형식으로 클라이언트에 응답

        }catch(err){
            console.error(err)
            next(err)
        }
    })
    // post 요청 : 사용자 등록
    .post(async (req,res,next)=> {
        try{
            console.log('req.body ', req.body)
            const user = await User.create({
                name : req.body.name,
                age: req.body.age,
                married : req.body.married,
                comment : req.body.comment
        })
            console.log(user)//생성된 사용자 데이터 출력
            res.status(201).json(user) // 상태코드 201과 함께 json 객체 형태로 생성된 사용자 전달
        }catch(err){
            console.error(err)
            next(err) // 에러를 다음 미들웨어로 전달
        }
    })

//localhost:8000/users/:id/comments
router.get('/:id/comments',async (req,res,next)=>{
     try {
      const comments = await Comment.findAll({
         include: {
            model: User, // Comment와 연결된 User 모델도 포함
            where: { id: req.params.id }, // 특정 사용자 ID의 댓글만 조회
         },
      })
      /*
      select comments. *, users.*
      from comments
      join user on comments.id = users.id
      */
      console.log(comments) // 조회된 댓글 데이터 출력
      res.json(comments) // JSON 형식으로 클라이언트에 응답
   } catch (err) {
      console.error(err) // 에러 로그 출력
      next(err) // 에러를 다음 미들웨어로 전달
   }
})

module.exports = router
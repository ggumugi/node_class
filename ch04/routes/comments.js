const express = require('express')
const Comment = require('../models/comment')

const router = express.Router()

// localhost:8000/comments
// 새로운 댓글 등록
router.post('/', async (req,res,next)=>{
    try{
        const comment = await Comment.create({
            commenter: req.body.id,
            comment: req.body.comment,
        })
        console.log(comment)
        res.status(201).json(comment)
    }catch(err){
        console.error(err)
        next(err)
    }
})

// localhost:8000/comments/:id -> comment table의 id
// 댓글 수정
router
    .route('/:id')
    .patch(async (req, res, next) => {
      try {
         const result = await Comment.update(
            {
               comment: req.body.comment, // 수정할 댓글 내용
            },
            {
               where: { id: req.params.id }, // 수정할 댓글의 ID
            }
         )
         if (result[0] === 0) {
            // 수정된 데이터가 없을 경우
            return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' })
         }
         res.json({ message: '댓글이 수정되었습니다.', result }) // 성공 응답
      } catch (err) {
         console.error(err) // 에러 로그 출력
         next(err) // 에러를 다음 미들웨어로 전달
      }
   })
    .delete(async (req, res, next) => {
      try {
         const result = await Comment.destroy({
            where: { id: req.params.id }, // 삭제할 댓글의 ID
         })
         if (result === 0) {
            // 삭제된 데이터가 없을 경우
            return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' })
         }
         res.json({ message: '댓글이 삭제되었습니다.', result }) // 성공 응답
      } catch (err) {
         console.error(err) // 에러 로그 출력
         next(err) // 에러를 다음 미들웨어로 전달
      }
})


module.exports = router
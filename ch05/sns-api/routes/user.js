const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('./middlewares')
const User = require('../models/user')

// 사용자를 팔로우하는 라우트 localhost:8000/:id/follow
router.post('/:id/follow', isLoggedIn, async (req, res) => {
   try {
      // 로그인 한 사용자의 user 객체를 가져온다
      // req.user.id = 사용자 아이디
      // req.params.id = 해당 인물 아이디
      const user = await User.findOne({ where: { id: req.user.id } })
      if (user) {
         await user.addFollowing(parseInt(req.params.id, 10))
         res.json({ success: true, message: '해당 인물 팔로우 성공' })
      } else {
         res.status(404).json({
            success: false,
            message: '사용자를 찾을 수 없습니다.',
         })
      }
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '팔로우 실패',
         error: err,
      })
   }
})

module.exports = router

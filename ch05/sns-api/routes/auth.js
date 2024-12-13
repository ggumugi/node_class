const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const User = require('../models/user')

// 회원가입 localhost:8000/auth/join
router.post('/join', isNotLoggedIn, async (req, res, next) => {
   /*
    {
    email: 'test@example.com',
    ncik:'아무개'
    password: '123456'
    }
    */
   const { email, nick, password } = req.body

   try {
      const exUser = await User.findOne({ where: { email } })
      if (exUser) {
         // 이미 사용자가 존재할 경우 409 상태코드와 메시지를 json 객체로 응답하면서 함수 종료
         return res.status(409).json({
            success: false,
            message: '이미 존재하는 사용자입니다.',
         })
      }
      // 이메일 중복 확인 통과시 새로운 사용자 계정 생성
      const hash = await bcrypt.hash(password, 12) // 12 : salt(해시 암호화를 진행시 추가되는 임의의 데이터로 10~12 정도의 값이 권장)
      const newUser = await User.create({
         email,
         nick,
         password: hash,
      })
      // 성공 시 201 상태 코드와 json 객체로 응답
      res.status(201).json({
         success: true,
         message: '회원가입 성공!',
         user: {
            id: newUser.id,
            email: newUser.email,
            nick: newUser.nick,
         },
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '회원가입 중 오류가 발생했습니다.',
         error: err,
      })
   }
})

// 로그인 localhost:8000/auth/login
router.post('/login', isNotLoggedIn, async (req, res, next) => {
   passport.authenticate('local', (authError, user, info) => {
      if (authError) {
         // 로그인 인증 중 에러
         return res.status(500).json({
            success: false,
            message: '인증 중 오류 발생',
            error: authError,
         })
      }
      if (!user) {
         // 비밀번호 불일치 또는 사용자가 없을 경우 info.message를 사용해서 메시지 전달
         return res.status(401).json({
            success: false,
            message: info.message || '로그인 실패',
         })
      }

      // 인증이 정상적으로 작동하고 사용자를 로그인 상태로 변경함
      req.login(user, (loginError) => {
         if (loginError) {
            return res.status(500).json({ success: false, message: '로그인 중 오류 발생', error: loginError })
         }
         // 로그인 성공 시 user 객체와 함께 response
         res.json({
            success: true,
            message: '로그인 성공!',
            user: {
               id: user.id,
               nick: user.nick,
            },
         })
      })
   })(req, res, next)
})

// 로그아웃 localhost:8000/auth/logout
router.get('/logout', isLoggedIn, async (req, res, next) => {
   // 사용자를 로그아웃 상태로 만듬
   req.logout((err) => {
      if (err) {
         console.log(err)
         return res.status(500).json({
            success: false,
            message: '로그아웃 중 오류가 발생했습니다.',
            error: err,
         })
      }
      // 로그아웃 성공시 세션에 저장되어 있던 사용자 id를 삭제해주고 아래와 같은 결과를 response
      // status code를 주지 않으면 기본값은 200(성공)
      res.json({
         success: true,
         message: '로그아웃에 성공했습니다.',
      })
   })
})

// 로그인 상태 확인 localhost:8000/auth/status
router.get('/status', async (req, res, next) => {})

module.exports = router

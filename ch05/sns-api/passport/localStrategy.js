const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')

// 로그인 시 사용자 정보를 DB에서 조회하고 사용자 존재 여부와 비밀번호를 비교
module.exports = () => {
   passport.use(
      new LocalStrategy(
         {
            // input 태그에서 name으로 사용하는 이름을 지정한다
            usernameField: 'email', // req.body.email = 'test@test.com'
            passwordField: 'password', // req.body.password = '1111'
         },
         // 실제 인증 로직
         async (email, password, done) => {
            try {
               const exUser = await User.findOne({ where: { email } })
               if (exUser) {
                  const result = await bcrypt.compare(password, exUser.password)
                  if (result) {
                     done(null, exUser) // 성공시 done(null, user) passport에 사용자 객체 반환
                  } else {
                     done(null, false, { message: '비밀번호가 일치하지 않습니다.' }) // 비밀번호 일치하지 않을 시 passport에 메시지 반환
                  }
               } else {
                  done(null, false, { message: '가입되지 않은 회원입니다.' }) // 이메일 정보를 찾을 수 없을 때
               }
            } catch (error) {
               console.error(error)
               done(error) // passport 에서 에러 미들웨어로 전달
            }
         }
      )
   )
}

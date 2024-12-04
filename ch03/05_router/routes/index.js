const express = require('express')
const router = express.Router() // 라우터를 가져온다

// localhost:8000/
router.get('/', (req, res) => {
   res.send('Hello, Express')
})
router.get('/:id', (req, res) => {
   res.send('Hello, Express ' + req.params.id)
}) // index 파일이 우선순위가 높아서 user를 붙여도 :id 값이 user로 인식됨 -- index 파일이 우선순위가 높은 이유 app.js 보기
router.get('/:id/test', (req, res) => {
   res.send('Hello, Express test ' + req.params.id)
})

module.exports = router

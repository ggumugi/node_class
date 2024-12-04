const express = require('express')
const router = express.Router() // 라우터를 가져온다(경로를 지정해주는 라이브버리)

// localhost:8000/user
router.get('/', (req, res) => {
   res.send('Hello, User')
})
// localhost:8000/user/?
// localhost:8000/user/person?page=1&lang=ko
router.get('/:id', (req, res) => {
   console.log(req.params, req.query)
   console.log(req.query.page)
   console.log(req.query.lang)
   res.send('Hello, User ' + req.params.id)
})

// 뒤에 test 가 붙으면 test 코드가 위에 있기 때문에 이 부분의 우선순위가 더 높다
router.get('/cate/test', (req, res) => {
   res.send('GET test /user/cate/test')
})

router.get('/cate/:id', (req, res) => {
   res.send('GET /user/cate/' + req.params.id)
})

router
   .route('/cate/abc')
   .get((req, res) => {
      res.send('GET /user/cate/abc')
   })
   .post((req, res) => {
      res.send('POST /user/cate/abc')
   })

module.exports = router

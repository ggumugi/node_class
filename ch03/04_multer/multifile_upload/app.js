const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const morgan = require('morgan') // 로그 남기는 패키지
require('dotenv').config() // env파일을 사용하기 위한 라이브러리

const app = express()
app.set('port', process.env.PORT || 3000)

app.use(morgan('dev'))
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 업로드 폴더 확인 및 생성
try {
   fs.readdirSync('uploads') // 해당 폴더가 존재하는지 확인, 폴더 없으면 에러 출력
} catch (e) {
   console.log('uploads 폴더가 없습니다. 폴더를 생성하겠습니다.')
   fs.mkdirSync('uploads') // uploads 폴더를 생성
}

const upload = multer({
   storage: multer.diskStorage({
      // 업로드 파일 저장 경로 설정
      destination(req, file, done) {
         done(null, 'uploads/') // uploads 폴더에 저장
      },
      // 저장할 파일 이름 설정
      filename(req, file, done) {
         const ext = path.extname(file.originalname) // 파일 확장자 추출
         console.log('ext: ', ext)
         console.log('path.basename(file.originalname, ext): ', path.basename(file.originalname, ext))
         // 파일 이름 = 원본 이름 (확장자 제외) + 현재 시간 + 확장자
         // path.basename(file.originalname, ext) = dog
         // Date.now() = 중복되지 않는 파일명을 만들 수 있음
         done(null, path.basename(file.originalname, ext) + Date.now() + ext)
      },
   }),
   // 업로드 파일 크기 제한(5MB)
   limits: { fileSize: 5 * 1024 * 1024 },
})

app.get('/upload', (req, res) => {
   res.sendFile(path.join(__dirname, 'multipart.html'))
})

app.post('/upload', upload.array('many'), (req, res) => {
   console.log(req.files) // 업로드된 파일 정보 출력
   res.send('파일을 업로드 했습니다.')
})

app.listen(app.get('port'), () => {
   console.log(`서버가 작동 중 입니다. http://localhost:${app.get('port')}`)
})

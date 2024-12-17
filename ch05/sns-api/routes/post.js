const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { Post, Hashtag, User } = require('../models')
const { isLoggedIn } = require('./middlewares')
const router = express.Router()

// uploads 폴더가 없을 경우 새로 생성
try {
   fs.readdirSync('uploads')
} catch (err) {
   console.log('upload 폴더가 없습니다. 폴더를 생성합니다.')
   fs.mkdirSync('uploads')
}

// 이미지 업로드를 위한 multer 설정
const upload = multer({
   // 저장할 위치와 파일명 지정
   storage: multer.diskStorage({
      destination(req, file, cb) {
         cb(null, 'uploads/') // uploads폴더에 저장
      },
      filename(req, file, cb) {
         const ext = path.extname(file.originalname) // 확장자 추출

         cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
      },
   }),
   // 파일의 크기 제한
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB로 제한
})

// 게시물 등록
// <input type="file" name=img>
router.post('/', isLoggedIn, upload.single('img'), async (req, res) => {
   try {
      console.log('파일정보 : ', req.file)
      if (!req.file) {
         // 업로드된 파일이 없거나 이상이 있어 파일 정보가 넘어오지 않는 경우
         return res.status(400).json({
            success: false,
            message: '파일이 존재하지 않거나 이상합니다.',
         })
      }

      const post = await Post.create({
         content: req.body.content, // 게시물 내용
         img: `/${req.file.filename}`, // 이미지 url
         UserId: req.user.id, // 작성자 id
      })

      /*
       req.body.hashtags = '즐거운 #여행 #맛집'
       hashtags=['#여행','#맛집']
      */
      const hashtags = req.body.hashtags.match(/#[^\s#]*/g) // 정규표현식 #을 기준으로 해시태그 추출

      if (hashtags) {
         // promise.all : 여러개의 비동기 작업을 병렬로 처리, 모든 해시태그가 데이터 베이스에서 생성되거나 찾아질때까지 기다림
         // 병렬 : 작업이 동시에 실행됨
         // findOrCreate : where 절에서 찾는 값이 존재하는지 확인하고 없으면 생성
         const result = await Promise.all(
            hashtags.map((tag) =>
               Hashtag.findOrCreate({
                  where: { title: tag.slice(1) }, //#을 제외한 문자만
               })
            )
         )
         //posthashtag 관계테이블에 연결 데이터 추가
         /*
         HashTagInstance1 = {
            id : 1,
            title : '여행'
            createAt :'2024-12-16T10:10:10'
            updateAt :'2024-12-16T10:10:10'
         }


          result = [
          [HashTagInstance1, true] // #여행 true 는 새로 생성되었다는 뜻
          [HashTagInstance2, true] // #맛집
          ]
          */
         // HashTagInstance 를 통해 post 와의 관계를 설정하고 이 과정에서 postHashtag 테이블의 postId와 hashtagId 에 값이 추가됨
         await post.addHashtags(result.map((r) => r[0]))
      }
      res.json({
         success: true,
         post: {
            id: post.id,
            content: post.content,
            img: post.img,
            UserId: post.UserId,
         },
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '게시물 등록 실패',
         error: err,
      })
   }
})

// 게시물 수정
router.put('/:id', isLoggedIn, upload.single('img'), async (req, res) => {
   try {
      // 게시물 존재 여부 확인
      const post = await Post.findOne({ where: { id: req.params.id, UserId: req.user.id } })
      if (!post) {
         return res.status(404).json({
            success: false,
            message: '게시물을 찾을 수 없습니다.',
         })
      }

      await post.update({
         content: req.body.content,
         img: req.file ? `/${req.file.filename}` : post.img, // 수정된 이미지 파일이 있으면 교체 없으면 기존
      })
      // 게시물에서 해시태그를 추출해서 존재하는 해시태그는 유지하고 새로운 해시태그를 넣어준다
      const hashtags = req.body.hashtags.match(/#[^\s#]*/g)
      if (hashtags) {
         const result = await Promise.all(
            hashtags.map((tag) =>
               Hashtag.findOrCreate({
                  where: { title: tag.slice(1) },
               })
            )
         )
         await post.addHashtags(result.map((r) => r[0]))
      }

      // 업데이트 후 게시물 조회
      const updatedPost = await Post.findOne({
         where: { id: req.params.id },
         // users와 hashtags 테이블의 컬럼 값을 포함해서 가져옴
         include: [
            {
               model: User,
               attributes: ['id', 'nick'], // id, nick 값만 가져옴
            },
            {
               model: Hashtag,
               attributes: ['title'], // title 값만 가져옴
            },
         ],
      })
      res.json({
         success: true,
         post: updatedPost,
         message: '게시물이 성공적으로 수정되었습니다.',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '게시물 수정 실패',
         error: err,
      })
   }
})

// 게시물 삭제
router.delete('/:id', isLoggedIn, async (req, res) => {
   try {
      // 삭제 게시물 존재 여부 확인
      const post = await Post.findOne({ where: { id: req.params.id, UserId: req.user.id } })
      if (!post) {
         return res.status(404).json({
            success: false,
            message: '게시물을 찾을 수 없습니다.',
         })
      }

      // 게시물 삭제
      await post.destroy()
      res.json({
         success: true,
         message: '게시물이 성공적으로 삭제되었습니다.',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '게시물 삭제 실패',
         error: err,
      })
   }
})

// 특정 게시물 불러오기(id로 게시물 조회)
router.get('/:id', async (req, res) => {
   try {
      const post = await Post.findOne({
         where: { id: req.params.id },
         include: [
            {
               model: User,
               attributes: ['id', 'nick'],
            },
            {
               model: Hashtag,
               attributes: ['title'],
            },
         ],
      })
      if (!post) {
         return res.status(404).json({
            success: false,
            message: '게시물을 찾을 수 없습니다.',
         })
      }
      res.json({
         success: true,
         post: post,
         message: '게시물 조회',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '게시물 조회 실패',
         error: err,
      })
   }
})

// 전체 게시물 불러오기(페이징 기능)
router.get('/', async (req, res) => {
   try {
      // parseInt('08') > 일부 브라우저에서 NaN 반환
      // parseInt('08',10) > 10진수 8을 반환
      const page = parseInt(req.query.page, 10) || 1 // page 번호 기본값 = 1
      const limit = parseInt(req.query.limit, 10) || 3 // 한 페이지 당 나타낼 객체 갯수
      const offset = (page - 1) * limit

      // 게시물의 전체 개수
      // select count(*) from posts
      const count = await Post.count()

      // 게시물 레코드 가져오기
      /*
      page:1, limit: 3 일 경우 offset: 0
      select * from posts order by createAt desc limit 3 offset 0

      page:2, limit: 3 일 경우 offset: 3
      select * from posts order by createAt desc limit 3 offset 3

      page:3, limit: 3 일 경우 offset: 6
      select * from posts order by createAt desc limit 3 offset 6
      offset - 건너뛰기
      */
      const posts = await Post.findAll({
         limit,
         offset,
         order: [['createdAt', 'DESC']], // createdAt (기본) : 최신 날짜 순으로 가져온다
         // 게시글을 작성한 사람과 게시글에 작성된 해시태그를 같이 가져온다
         include: [
            {
               model: User,
               attributes: ['id', 'nick', 'email'],
            },
            {
               model: Hashtag,
               attributes: ['title'],
            },
         ],
      })

      res.json({
         success: true,
         posts,
         pagination: {
            totalPosts: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            limit,
         },
         message: '전체 게시물 리스트 조회',
      })
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: '게시물 조회 실패',
         error: err,
      })
   }
})

module.exports = router

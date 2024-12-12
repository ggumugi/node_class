const Sequelize = require('sequelize')
const User = require('./user')
const Comment = require('./comment')
const Capital = require('./capital')
const Country = require('./country')
const Post = require('./post')
const Hashtag = require('./hashtag')

const dotenv = require('dotenv')

// .env 에서 현재 실행환경 development, test, production 중 하나를 가져옴
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]
const db = {}
dotenv.config()

// sequelize를 사용해서 데이터베이스 연결 객체 생성
const sequelize = new Sequelize(config.database, config.username, config.password, config)

// db 객체를 생성하여 sequelize 객체와 모든 모델들을 저장
db.sequelize = sequelize

// 각각 모델을 db 객체에 추가
db.User = User
db.Comment = Comment
db.Capital = Capital
db.Country = Country
db.Post = Post
db.Hashtag = Hashtag

// 모델을 초기화하고 데이터베이스와 연결
User.init(sequelize)
Comment.init(sequelize)
Country.init(sequelize)
Capital.init(sequelize)
Post.init(sequelize)
Hashtag.init(sequelize)

// 모델간의 관계 설명(외래키, 연관 테이블 등)
User.associate(db)
Comment.associate(db)
Country.associate(db)
Capital.associate(db)
Post.associate(db)
Hashtag.associate(db)

//db 객체를 모듈로 내보냄
module.exports = db

const Sequelize = require('sequelize')

// class명은 파일명과 똑같이 작성하되 대문자로 시작
module.exports = class User extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            // 컬럼
            name: {
               type: Sequelize.STRING(20), // varchar2(20)
               allowNull: false, // null 값 가능 여부
               unique: true, // primary key로 설정
            },
            age: {
               type: Sequelize.INTEGER.UNSIGNED, // 양수만 가능한 정수
               allowNull: false, // null 값 가능 여부
            },
            married: {
               type: Sequelize.BOOLEAN, // true, false
               allowNull: false, // null 값 가능 여부
            },
            comment: {
               type: Sequelize.TEXT, // TEXT
               allowNull: true, // null 값 가능 여부
            },
            create_at: {
               type: Sequelize.DATE, // date
               allowNull: false, // null 값 가능 여부
               defaultValue: Sequelize.NOW, // 디폴트 값 설정
            },
         },
         {
            sequelize, // sequelize 객체
            timestamps: false, // 자동생성되는 createdAt, updatedAt 컬럼을 활성화여부 - > 비활성화=false
            underscored: false, // 컬럼이름을 카멜케이스로 유지할건지 => false 유지 안함
            modelName: 'User', // 시퀄라이즈에서 사용하는 모델이름(클래스명 작성)
            tableName: 'users', // 데이터베이스에서 사용하는 실제 테이블 이름
            paranoid: false, // 소프트 삭제 활성화 여부 -> 비활성화
            // 활성화를 해두면 캐시처럼 삭제된 것으로 표시 돼도 실제 데이터 베이스에선 삭제되지 않아 복구하거나 기록으로 유지 가능
            charset: 'utf8mb4', // 데이터베이스 생성할 때 charset과 똑같이 사용
            collate: 'utf8mb4_general_ci', // 데이터베이스 생성할 때 collate와 똑같이 사용
         }
      )
   } // 테이블 설정

   static associate(db) {
      // user가 comment를 가지고 있다 (user 부모 comment 자식)
      db.User.hasMany(db.Comment, {
         foreignKey: 'commenter', // Comment 모델에서 외래 키로 사용할 컬럼 이름
         sourceKey: 'id', // User 에서 Comment에게 외래키로 제공할 컬럼 이름
      })
   } // 다른 테이블과의 관계
}

const Sequelize = require('sequelize')

// class명은 파일명과 똑같이 작성하되 대문자로 시작
module.exports = class Comment extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            // 컬럼
            comment: {
               type: Sequelize.STRING(100), // varchar2(20)
               allowNull: false, // null 값 가능 여부
            },
            create_at: {
               type: Sequelize.DATE, // date
               allowNull: true, // null 값 가능 여부
               defaultValue: Sequelize.NOW, // 디폴트 값 설정
            },
         },
         {
            sequelize, // sequelize 객체
            timestamps: false, // 자동생성되는 createdAt, updatedAt 컬럼을 활성화여부 - > 비활성화=false
            underscored: false, // 컬럼이름을 카멜케이스로 유지할건지 => false 유지 안함
            modelName: 'Comment', // 시퀄라이즈에서 사용하는 모델이름(클래스명 작성)
            tableName: 'comments', // 데이터베이스에서 사용하는 실제 테이블 이름
            paranoid: false, // 소프트 삭제 활성화 여부 -> 비활성화
            // 활성화를 해두면 캐시처럼 삭제된 것으로 표시 돼도 실제 데이터 베이스에선 삭제되지 않아 복구하거나 기록으로 유지 가능
            charset: 'utf8mb4', // 데이터베이스 생성할 때 charset과 똑같이 사용
            collate: 'utf8mb4_general_ci', // 데이터베이스 생성할 때 collate와 똑같이 사용
         }
      )
   } // 테이블 설정

   static associate(db) {
      // comment 는 user에 속해 있다(comment 자녀 user 부모)
      db.Comment.belongsTo(db.User, {
         foreignKey: 'commenter', // Comment 외래 키 컬럼 이름
         targetKey: 'id', // Comment가 User에서 참조할 컬럼 이름
      })
   } // 다른 테이블과의 관계
}

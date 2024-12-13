const Sequelize = require('sequelize')

module.exports = class Post extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            content: {
               type: Sequelize.TEXT,
               allowNull: false, // NOT NULL
            },
            img: {
               type: Sequelize.STRING(200),
               allowNull: true, // NULL
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }

   static associate(db) {
      db.Post.belongsTo(db.User)
   }
}

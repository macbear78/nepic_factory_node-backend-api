import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * news 테이블과 매핑되는 Sequelize 모델 (이미지 지원)
 */
class News extends Model {}

News.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '제목',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '내용',
    },
    writer: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '작성자',
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '대표 이미지 경로',
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '추가 이미지 경로 배열',
      defaultValue: [],
    },
    view_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_deleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'News',
    tableName: 'news',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: false,z
  }
);

export default News;

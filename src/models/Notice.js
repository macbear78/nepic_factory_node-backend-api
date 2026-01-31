import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * notices 테이블과 매핑되는 Sequelize 모델
 */
class Notice extends Model {}

Notice.init(
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
    is_pinned: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: '상단 고정 (1: 고정)',
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
    modelName: 'Notice',
    tableName: 'notices',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: false,
  }
);

export default Notice;

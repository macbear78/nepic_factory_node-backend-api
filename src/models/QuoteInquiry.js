import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * quote_inquiries 테이블과 매핑되는 Sequelize 모델
 * 테이블 없으면 sql/quote_inquiries.sql 참고하여 생성
 */
class QuoteInquiry extends Model {}

QuoteInquiry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '문의자명',
    },
    contact: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '연락처 (이메일/전화번호)',
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '회사명',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '문의 내용',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      comment: '처리상태: pending, processing, completed',
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
    modelName: 'QuoteInquiry',
    tableName: 'quote_inquiries',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: false,
  }
);

export default QuoteInquiry;

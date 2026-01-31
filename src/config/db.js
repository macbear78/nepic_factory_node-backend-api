import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD ?? '';

if (!DB_NAME || !DB_USER) {
  throw new Error(
    'DB 설정이 없습니다. 프로젝트 루트에 .env 파일을 만들고 DB_NAME, DB_USER, DB_PASSWORD를 설정하세요. 예: .env.example 참고'
  );
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, { 
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  dialectModule: mysql2,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

/**
 * DB 연결 테스트 (sync 호출하지 않음 - 기존 테이블 사용)
 */
export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection has been established successfully.');
    return sequelize;
  } catch (err) {
    console.error('Unable to connect to the database:', err?.message ?? err);
    if (err?.parent?.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(
        '→ .env의 DB_USER, DB_PASSWORD와 MySQL 계정이 일치하는지 확인하세요.'
      );
    }
    throw err;
  }
}

export { sequelize };
export default sequelize;

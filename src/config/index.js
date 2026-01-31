/**
 * 앱 설정 (향후 DB 등 환경 변수 추가 예정)
 */
export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
};

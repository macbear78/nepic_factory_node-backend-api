import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { connectDB } from './config/db.js';
import boardRoutes from './routes/board.routes.js';
import noticeRoutes from './routes/notice.routes.js';
import newsRoutes from './routes/news.routes.js';
import quoteInquiryRoutes from './routes/quoteInquiry.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/board', boardRoutes);
app.use('/api/notice', noticeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/quote-inquiry', quoteInquiryRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: '파일 크기는 5MB를 초과할 수 없습니다.' });
  }
  if (err.message?.includes('업로드 가능')) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  })
  .catch((err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
  });

export default app;

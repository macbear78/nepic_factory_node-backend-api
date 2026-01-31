import News from '../models/News.js';

/** req.files에서 이미지 경로 배열 생성 (URL 접근용) */
function getImagePaths(files) {
  if (!files) return { imageUrl: null, images: [] };
  const base = '/uploads/news';
  let imageUrl = null;
  const images = [];
  if (files.image?.[0]) {
    imageUrl = `${base}/${files.image[0].filename}`;
  }
  if (files.images?.length) {
    for (const f of files.images) {
      images.push(`${base}/${f.filename}`);
    }
  }
  return { imageUrl, images };
}

/** multer 사용 시 form-data 필드 파싱 */
function parseBody(body) {
  return {
    title: body.title,
    content: body.content,
    writer: body.writer,
  };
}

/**
 * 뉴스 목록 조회 (GET /api/news)
 */
export async function list(req, res) {
  try {
    const items = await News.findAll({
      where: { is_deleted: 0 },
      order: [['id', 'DESC']],
    });
    res.json({ data: items, count: items.length });
  } catch (err) {
    console.error('news.list:', err);
    res.status(500).json({ error: '뉴스 목록 조회에 실패했습니다.' });
  }
}

/**
 * 뉴스 단건 조회 (GET /api/news/:id) - 조회 시 view_count 증가
 */
export async function getOne(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '잘못된 ID입니다.' });
    }
    const item = await News.findOne({
      where: { id, is_deleted: 0 },
    });
    if (!item) {
      return res.status(404).json({ error: '뉴스를 찾을 수 없습니다.' });
    }
    await item.increment('view_count');
    await item.reload();
    res.json(item);
  } catch (err) {
    console.error('news.getOne:', err);
    res.status(500).json({ error: '뉴스 조회에 실패했습니다.' });
  }
}

/**
 * 뉴스 생성 (POST /api/news)
 * - JSON: { title, content, writer, image_url?, images? }
 * - multipart: title, content, writer + image(1개), images(여러개)
 */
export async function create(req, res) {
  try {
    let title, content, writer, image_url, images;
    if (req.files && Object.keys(req.files).length) {
      const parsed = parseBody(req.body);
      title = parsed.title;
      content = parsed.content;
      writer = parsed.writer ?? 'admin';
      const { imageUrl, images: imgArr } = getImagePaths(req.files);
      image_url = imageUrl;
      images = imgArr;
    } else {
      ({ title, content, writer, image_url, images } = req.body);
      writer = writer ?? 'admin';
    }
    if (!title || !content) {
      return res.status(400).json({ error: 'title과 content는 필수입니다.' });
    }
    const item = await News.create({
      title,
      content,
      writer,
      image_url: image_url ?? null,
      images: images ?? [],
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('news.create:', err);
    res.status(500).json({ error: '뉴스 등록에 실패했습니다.' });
  }
}

/**
 * 뉴스 수정 (PUT /api/news/:id)
 * - 새 이미지 업로드 시 기존 image_url/images에 추가/교체
 */
export async function update(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '잘못된 ID입니다.' });
    }
    const item = await News.findOne({
      where: { id, is_deleted: 0 },
    });
    if (!item) {
      return res.status(404).json({ error: '뉴스를 찾을 수 없습니다.' });
    }
    let title, content, writer, image_url, images;
    if (req.files && Object.keys(req.files).length) {
      const parsed = parseBody(req.body);
      title = parsed.title ?? item.title;
      content = parsed.content ?? item.content;
      writer = parsed.writer ?? item.writer;
      const paths = getImagePaths(req.files);
      image_url = paths.imageUrl ?? item.image_url;
      images = paths.images.length ? paths.images : (item.images ?? []);
    } else {
      ({ title, content, writer, image_url, images } = req.body);
    }
    if (title !== undefined) item.title = title;
    if (content !== undefined) item.content = content;
    if (writer !== undefined) item.writer = writer;
    if (image_url !== undefined) item.image_url = image_url;
    if (images !== undefined) item.images = images;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error('news.update:', err);
    res.status(500).json({ error: '뉴스 수정에 실패했습니다.' });
  }
}

/**
 * 뉴스 삭제 (DELETE /api/news/:id) - 소프트 삭제
 */
export async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '잘못된 ID입니다.' });
    }
    const item = await News.findOne({
      where: { id, is_deleted: 0 },
    });
    if (!item) {
      return res.status(404).json({ error: '뉴스를 찾을 수 없습니다.' });
    }
    item.is_deleted = 1;
    await item.save();
    res.status(204).send();
  } catch (err) {
    console.error('news.remove:', err);
    res.status(500).json({ error: '뉴스 삭제에 실패했습니다.' });
  }
}

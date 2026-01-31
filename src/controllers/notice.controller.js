import Notice from '../models/Notice.js';

/**
 * 공지사항 목록 조회 (GET /api/notice) - 고정공지 우선, 삭제된 것 제외
 */
export async function list(req, res) {
  try {
    const items = await Notice.findAll({
      where: { is_deleted: 0 },
      order: [
        ['is_pinned', 'DESC'],
        ['id', 'DESC'],
      ],
    });
    res.json({ data: items, count: items.length });
  } catch (err) {
    console.error('notice.list:', err);
    res.status(500).json({ error: '공지사항 목록 조회에 실패했습니다.' });
  }
}

/**
 * 공지사항 단건 조회 (GET /api/notice/:id) - 조회 시 view_count 증가
 */
export async function getOne(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '잘못된 ID입니다.' });
    }
    const item = await Notice.findOne({
      where: { id, is_deleted: 0 },
    });
    if (!item) {
      return res.status(404).json({ error: '공지사항을 찾을 수 없습니다.' });
    }
    await item.increment('view_count');
    await item.reload();
    res.json(item);
  } catch (err) {
    console.error('notice.getOne:', err);
    res.status(500).json({ error: '공지사항 조회에 실패했습니다.' });
  }
}

/**
 * 공지사항 생성 (POST /api/notice)
 */
export async function create(req, res) {
  try {
    const { title, content, writer, is_pinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'title과 content는 필수입니다.' });
    }
    const item = await Notice.create({
      title,
      content,
      writer: writer ?? 'admin',
      is_pinned: is_pinned ? 1 : 0,
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('notice.create:', err);
    res.status(500).json({ error: '공지사항 등록에 실패했습니다.' });
  }
}

/**
 * 공지사항 수정 (PUT /api/notice/:id)
 */
export async function update(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '잘못된 ID입니다.' });
    }
    const { title, content, writer, is_pinned } = req.body;
    const item = await Notice.findOne({
      where: { id, is_deleted: 0 },
    });
    if (!item) {
      return res.status(404).json({ error: '공지사항을 찾을 수 없습니다.' });
    }
    if (title !== undefined) item.title = title;
    if (content !== undefined) item.content = content;
    if (writer !== undefined) item.writer = writer;
    if (is_pinned !== undefined) item.is_pinned = is_pinned ? 1 : 0;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error('notice.update:', err);
    res.status(500).json({ error: '공지사항 수정에 실패했습니다.' });
  }
}

/**
 * 공지사항 삭제 (DELETE /api/notice/:id) - 소프트 삭제
 */
export async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '잘못된 ID입니다.' });
    }
    const item = await Notice.findOne({
      where: { id, is_deleted: 0 },
    });
    if (!item) {
      return res.status(404).json({ error: '공지사항을 찾을 수 없습니다.' });
    }
    item.is_deleted = 1;
    await item.save();
    res.status(204).send();
  } catch (err) {
    console.error('notice.remove:', err);
    res.status(500).json({ error: '공지사항 삭제에 실패했습니다.' });
  }
}

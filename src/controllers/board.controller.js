import Board from '../models/Board.js';

/**
 * 게시글 목록 조회 (GET /api/board) - 삭제되지 않은 글만
 */
export async function list(req, res) {
  try {
    const posts = await Board.findAll({
      where: { is_deleted: 0 },
      order: [['id', 'DESC']],
    });
    res.json({ data: posts, count: posts.length });
  } catch (err) {
    console.error('board.list:', err);
    res.status(500).json({ error: '게시글 목록 조회에 실패했습니다.' });
  }
}

/**
 * 게시글 단건 조회 (GET /api/board/:id) - 조회 시 view_count 증가
 */
export async function getOne(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '잘못된 게시글 ID입니다.' });
    }
    const post = await Board.findOne({
      where: { id, is_deleted: 0 },
    });
    if (!post) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
    await post.increment('view_count');
    await post.reload();
    res.json(post);
  } catch (err) {
    console.error('board.getOne:', err);
    res.status(500).json({ error: '게시글 조회에 실패했습니다.' });
  }
}

/**
 * 게시글 생성 (POST /api/board)
 */
export async function create(req, res) {
  try {
    const { title, content, writer } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'title과 content는 필수입니다.' });
    }
    const post = await Board.create({
      title,
      content,
      writer: writer ?? 'anonymous',
    });
    res.status(201).json(post);
  } catch (err) {
    console.error('board.create:', err);
    res.status(500).json({ error: '게시글 등록에 실패했습니다.' });
  }
}

/**
 * 게시글 수정 (PUT /api/board/:id)
 */
export async function update(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '잘못된 게시글 ID입니다.' });
    }
    const { title, content } = req.body;
    const post = await Board.findOne({
      where: { id, is_deleted: 0 },
    });
    if (!post) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('board.update:', err);
    res.status(500).json({ error: '게시글 수정에 실패했습니다.' });
  }
}

/**
 * 게시글 삭제 (DELETE /api/board/:id) - 소프트 삭제 (is_deleted = 1)
 */
export async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '잘못된 게시글 ID입니다.' });
    }
    const post = await Board.findOne({
      where: { id, is_deleted: 0 },
    });
    if (!post) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
    post.is_deleted = 1;
    await post.save();
    res.status(204).send();
  } catch (err) {
    console.error('board.remove:', err);
    res.status(500).json({ error: '게시글 삭제에 실패했습니다.' });
  }
}

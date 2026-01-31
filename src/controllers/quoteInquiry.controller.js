import QuoteInquiry from '../models/QuoteInquiry.js';

/**
 * 견적문의 목록 조회 (GET /api/quote-inquiry) - 삭제되지 않은 것만
 */
export async function list(req, res) {
  try {
    const items = await QuoteInquiry.findAll({
      where: { is_deleted: 0 },
      order: [['id', 'DESC']],
    });
    res.json({ data: items, count: items.length });
  } catch (err) {
    console.error('quoteInquiry.list:', err);
    res.status(500).json({ error: '견적문의 목록 조회에 실패했습니다.' });
  }
}

/**
 * 견적문의 단건 조회 (GET /api/quote-inquiry/:id)
 */
export async function getOne(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '잘못된 ID입니다.' });
    }
    const item = await QuoteInquiry.findOne({
      where: { id, is_deleted: 0 },
    });
    if (!item) {
      return res.status(404).json({ error: '견적문의를 찾을 수 없습니다.' });
    }
    res.json(item);
  } catch (err) {
    console.error('quoteInquiry.getOne:', err);
    res.status(500).json({ error: '견적문의 조회에 실패했습니다.' });
  }
}

/**
 * 견적문의 생성 (POST /api/quote-inquiry)
 */
export async function create(req, res) {
  try {
    const { name, contact, company, content } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name은 필수입니다.' });
    }
    const item = await QuoteInquiry.create({
      name,
      contact: contact ?? null,
      company: company ?? null,
      content: content ?? null,
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('quoteInquiry.create:', err);
    res.status(500).json({ error: '견적문의 등록에 실패했습니다.' });
  }
}

/**
 * 견적문의 수정 (PUT /api/quote-inquiry/:id)
 */
export async function update(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '잘못된 ID입니다.' });
    }
    const { name, contact, company, content, status } = req.body;
    const item = await QuoteInquiry.findOne({
      where: { id, is_deleted: 0 },
    });
    if (!item) {
      return res.status(404).json({ error: '견적문의를 찾을 수 없습니다.' });
    }
    if (name !== undefined) item.name = name;
    if (contact !== undefined) item.contact = contact;
    if (company !== undefined) item.company = company;
    if (content !== undefined) item.content = content;
    if (status !== undefined) item.status = status;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error('quoteInquiry.update:', err);
    res.status(500).json({ error: '견적문의 수정에 실패했습니다.' });
  }
}

/**
 * 견적문의 삭제 (DELETE /api/quote-inquiry/:id) - 소프트 삭제
 */
export async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '잘못된 ID입니다.' });
    }
    const item = await QuoteInquiry.findOne({
      where: { id, is_deleted: 0 },
    });
    if (!item) {
      return res.status(404).json({ error: '견적문의를 찾을 수 없습니다.' });
    }
    item.is_deleted = 1;
    await item.save();
    res.status(204).send();
  } catch (err) {
    console.error('quoteInquiry.remove:', err);
    res.status(500).json({ error: '견적문의 삭제에 실패했습니다.' });
  }
}

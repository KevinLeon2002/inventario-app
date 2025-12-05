const service = require('../services/productoService');
exports.create = async (req, res) => {
  try {
    const p = await service.createProduct(req.body);
    return res.status(201).json({ data: p });
  } catch (err) {
    return res.status(422).json({ code:'VAL', message: err.message });
  }
};
exports.list = async (req,res) => {
  const items = await service.listProducts();
  res.json({ data: items });
};

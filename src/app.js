const express = require('express');
const app = express();
app.use(express.json());

const inventario = [];

app.post('/api/items', (req, res) => {
  const { sku, nombre, stockMin = 0 } = req.body;
    // validar datos obligatorios
  if (!sku || !nombre) {
    return res.status(422).json({ code: 'VAL', message: 'sku y nombre son obligatorios' });
  }
    // validar duplicado
  if (inventario.find(i => i.sku === sku)) {
    return res.status(409).json({ code: 'DUP', message: 'SKU ya existe' });
  }
    // crear item
  const producto = { sku, nombre, stock: 0, stockMin };
  inventario.push(producto);

  return res.status(201).json({ data: producto });
});

module.exports = app;

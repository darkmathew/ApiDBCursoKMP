require('dotenv').config();

const express = require('express');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

// Database connection
const sequelize = new Sequelize('postgres://cursokmpdb_user:ZuPkvMHWWiafCGsUin8yOwMH7CFfgRF7@dpg-com7b08l6cac73d2rrcg-a.oregon-postgres.render.com/cursokmpdb', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Corrije problemas com SSL.
    }
  }
});

// Models
const User = sequelize.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

const Item = sequelize.define('item', {
  name: Sequelize.STRING,
  quantity: Sequelize.INTEGER,
  userId: Sequelize.INTEGER
});

User.beforeCreate((user, options) => {
  return bcrypt.hash(user.password, 10)
    .then(hash => {
      user.password = hash;
    })
    .catch(err => { 
      throw new Error(); 
    });
});

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required.' });
    return;
  }
  const user = await User.create({ username, password });
  res.status(201).json(user);
});

app.post('/authenticate', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required.' });
    return;
  }
  
  const user = await User.findOne({ where: { username } });
  if (user && bcrypt.compareSync(password, user.password)) {
    res.json({ success: true, userId: user.id });
  } else {
    res.status(401).json({ message: 'Authentication failed.' });
  }
});

app.get('/items/:userId', async (req, res) => {
  const items = await Item.findAll({ where: { userId: req.params.userId } });
  if (items.length > 0) {
    res.json(items);
  } else {
    res.status(404).json({ message: 'Items not found.' });
  }
});

app.post('/item', async (req, res) => {
  const { name, quantity, userId } = req.body;
  if (!name || !quantity || !userId) {
    res.status(400).json({ message: 'Name, quantity and userId are required.' });
    return;
  }
  const item = await Item.create({ name, quantity, userId });
  res.status(201).json({ success: true, itemId: item.id });
});

app.put('/item/:itemId', async (req, res) => {
  const { name, quantity, userId } = req.body;
  if (!name || !quantity || !userId) {
    res.status(400).json({ message: 'Name, quantity and userId are required.' });
    return;
  }
  const item = await Item.update({ name, quantity, userId }, { where: { id: req.params.itemId } });
  if (item[0] === 0) {
    res.status(404).json({ message: 'Item not found.' });
  } else {
    res.json({ success: true });
  }
});

app.delete('/item/:itemId', async (req, res) => {
  const rowsDeleted = await Item.destroy({ where: { id: req.params.itemId } });
  if (rowsDeleted === 0) {
    res.status(404).json({ message: 'Item not found.' });
  } else {
    res.json({ success: true });
  }
});

// Middleware para tratar rotas não definidas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Invalid route' });
});


// Inicialização do APP
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log('Server started on port 3000'));
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

(async () => {
  await sequelize.sync({ force: true });
})();

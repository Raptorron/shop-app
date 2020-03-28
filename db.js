const Sequalize = require('sequelize');
const db = new Sequalize(process.env.DATABASE_URL || 'postres://localhost/shop_db');

const {STRING, UUID, UUIDV4, ENUM, TEXT, DECIMAL, INTEGER, BOOLEAN, DataTypes} = Sequalize;

const Guest = db.define('guest', {
  id: {
    primaryKey: true,
    type: UUID,
    difaultValue: UUIDV4
  },
  name: {
    type: STRING,
    allowNull: false
  },
});

const LineItem = db.define('LineItem', {
  quantity: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});

const Order = db.define('order', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  complete: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

const Product = db.define('product', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      isDecimal: true
    }
  },
  stock: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  imageURL: {
    type: STRING,
    defaultValue: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
  },
  description: TEXT
});

const User = db.define('user', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING,
    allowNull: false
  },
  email: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  password: {
    type: STRING,
    allowNull: false
  }
});

Order.belongsTo(User);
User.hasMany(Order);

LineItem.belongsTo(Order);
Order.hasMany(LineItem);

LineItem.belongsTo(Product);
Product.hasMany(LineItem);


const mapAndSave = async(model, items) => Promise.all(await items.map(item => model.create(item)));

const syncAndSeed = async () => {

  await db.sync({ force: true });

  const users = [
    {
      name: 'Billy Hill',
      email: 'bHill@gmail.com',
      password: hash('12345', process.env.SALT)
    },
    {
      name: 'John Ford',
      email: 'jFord@gmail.com',
      password: hash('12345', process.env.SALT)
    },
    {
      name: 'Anna Lane',
      email: 'aLane@gmail.com',
      password: hash('12345', process.env.SALT)
    },
    {
      name: 'May Taylor',
      email: 'mTaylor@gmail.com',
      password: hash('12345', process.env.SALT)
    },
    {
      name: 'James Romero',
      email: 'jRomero@gmail.com',
      password: hash('12345', process.env.SALT)
    }
  ];


  const [billy, john, anna, may, james] = await mapAndSave(User, users);
};


module.exports = {
  syncAndSeed,
  models: {
    Guest,
    LineItem,
    Order,
    Product,
    User
  }
}

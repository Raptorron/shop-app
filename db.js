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

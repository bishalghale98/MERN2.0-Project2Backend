import Cart from "./models/Cart";
import Category from "./models/Category";
import Order from "./models/Order";
import OrderDetails from "./models/OrderDetails";
import Payment from "./models/Payment";
import Product from "./models/Product";
import User from "./models/User";

const defineRelations = () => {
  // Product & User Relation
  User.hasMany(Product, { foreignKey: "userId" });
  Product.belongsTo(User, { foreignKey: "userId" });

  // Product & Category Relation
  Category.hasOne(Product, { foreignKey: "categoryId" });
  Product.belongsTo(Category, { foreignKey: "categoryId" });

  // Product & Cart Relation
  Product.hasMany(Cart, { foreignKey: "productId" });
  Cart.belongsTo(Product, { foreignKey: "productId" });

  // User & Cart Relation
  User.hasMany(Cart, { foreignKey: "userId" });
  Cart.belongsTo(User, { foreignKey: "userId" });

  // Order & OrderDetails Relation
  Order.hasMany(OrderDetails, { foreignKey: "orderId" });
  OrderDetails.belongsTo(Order, { foreignKey: "orderId" });

  // OrderDetails & Product Relation
  Product.hasMany(OrderDetails, { foreignKey: "productId" });
  OrderDetails.belongsTo(Product, { foreignKey: "productId" });

  // Order & Payment Relation
  Payment.hasOne(Order, { foreignKey: "paymentId" });
  Order.belongsTo(Payment, { foreignKey: "paymentId" });

  //   order - user relation
  User.hasMany(Order, { foreignKey: "userId" });
  Order.belongsTo(User, { foreignKey: "userId" });
};

export default defineRelations;

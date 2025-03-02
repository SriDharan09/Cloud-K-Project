const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/dbConfig");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

// Seeder to feed the Users in DB
// npx sequelize-cli db:seed:all
sequelize
  .authenticate()
  .then(() => {
    console.log("DB Connected Successfully..👍");
  })
  .catch((err) => {
    console.log(`Connection Not established ${err}`);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, DataTypes);
db.Role = require("./role")(sequelize, DataTypes);
db.Branch = require("./branch")(sequelize, DataTypes);
db.Category = require("./category")(sequelize, DataTypes);
db.MenuItem = require("./menuItem")(sequelize, DataTypes);
db.Order = require("./order")(sequelize, DataTypes);
db.OrderItem = require("./orderItem")(sequelize, DataTypes);
db.Review = require("./review")(sequelize, DataTypes);
db.DeliveryPersonnel = require("./deliveryPersonnel")(sequelize, DataTypes);
db.Offer = require("./offer")(sequelize, DataTypes);
db.UserAddress = require("./userAddress")(sequelize, DataTypes);
db.Customization = require("./customization")(sequelize, DataTypes);
db.AuditLog = require("./auditLog")(sequelize, DataTypes);
db.Notification = require("./notification")(sequelize, DataTypes);
db.NotificationTemplate = require("./notificationTemplate")(
  sequelize,
  DataTypes
);
db.Cart = require("./cart")(sequelize, DataTypes);
db.OrderHistory = require("./orderHistory")(sequelize, DataTypes);

db.Role.hasMany(db.User);
db.User.belongsTo(db.Role);

db.Branch.hasMany(db.MenuItem);
db.MenuItem.belongsTo(db.Branch);

db.Branch.hasMany(db.Order);
db.Order.belongsTo(db.Branch);

db.Category.hasMany(db.MenuItem);
db.MenuItem.belongsTo(db.Category);

db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);

db.Order.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Order);

db.MenuItem.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.MenuItem);

db.User.hasMany(db.Review);
db.Review.belongsTo(db.User);

db.MenuItem.hasMany(db.Review);
db.Review.belongsTo(db.MenuItem);

db.User.hasMany(db.UserAddress);
db.UserAddress.belongsTo(db.User);

// To clear the data from the table :

// resetDatabase();
// truncateTable();

async function resetDatabase() {
  try {
    console.log("Disabling foreign key checks...");
    // Disable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    console.log("Foreign key checks disabled.");

    console.log("Dropping tables...");
    // Drop tables
    await sequelize.query("DROP TABLE IF EXISTS Branch");
    console.log("Tables dropped successfully.");

    console.log("Re-enabling foreign key checks...");
    // Re-enable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Foreign key checks re-enabled.");
  } catch (error) {
    console.error("Error during database reset:", error);
  }
}
async function truncateTable() {
  try {
    // Disable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    console.log("Foreign key checks disabled.");

    // Define the order to truncate tables, ensuring no foreign key constraints are violated
    const truncateOrder = [
      "OrderItems", // Child of Orders and MenuItems
      "Reviews", // Child of Users and MenuItems
      "Orders", // Parent of OrderItems, Child of Branches and Users
      "UserAddresses", // Child of Users
      "MenuItems", // Parent of OrderItems, Child of Branches and Categories
      "Users", // Parent of Orders, UserAddresses, and Reviews; Child of Roles
      "Branches", // Parent of Orders and MenuItems
      "Categories", // Parent of MenuItems
      "Roles", // Parent of Users
      "Customizations", // Not referenced by any other table
      "AuditLogs", // Not referenced by any other table
    ];

    // Truncate tables in defined order
    for (const tableName of truncateOrder) {
      await sequelize.query(`TRUNCATE TABLE \`${tableName}\``);
      console.log(`Data deleted from table ${tableName}.`);
    }

    // Re-enable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Foreign key checks re-enabled.");
  } catch (error) {
    console.error("Error during database reset:", error);
  }
}

//If table data altered use this:

// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('Database schema updated successfully.');
//   })
//   .catch(error => {
//     console.error('Error updating database schema:', error);
//   });

db.sequelize.sync({ force: false }).then(() => {
  console.log("Re-sync Done ");
});

// sequelize.query('SET FOREIGN_KEY_CHECKS = 0') // Disable foreign key checks
// .then(() => {
//   return sequelize.query('Drop TABLE Users'); // Truncate the table
// })
// .then(() => {
//   return sequelize.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
// })
// .then(() => {
//   console.log('Data truncated successfully.');
// })
// .catch(error => {
//   console.error('Error truncating data:', error);
// });

module.exports = db;

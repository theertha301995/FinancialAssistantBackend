// mongo-init.js
db = db.getSiblingDB('dailyspending');

// Create collections
db.createCollection('users');
db.createCollection('expenses');
db.createCollection('categories');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.expenses.createIndex({ userId: 1, date: -1 });
db.expenses.createIndex({ category: 1 });

print('MongoDB initialized successfully for dailyspending database');
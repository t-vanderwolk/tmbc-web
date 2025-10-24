// prisma.config.js
// Ensure Prisma loads environment variables from backend/.env
const path = require('path');
const dotenv = require('dotenv');

// Load .env from the current backend directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Optional: verify DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found. Check backend/.env placement or syntax.');
  process.exit(1);
}

module.exports = {
  schema: path.resolve(__dirname, 'prisma/schema.prisma'),
  // You can add other Prisma settings here if needed
};
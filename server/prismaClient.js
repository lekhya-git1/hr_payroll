const { PrismaClient } = require('@prisma/client'); 
const { PrismaPg } = require('@prisma/adapter-pg'); 
require('dotenv').config({ path: '../.env' }); 
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL }); 
const prisma = new PrismaClient({ adapter }); module.exports = prisma;
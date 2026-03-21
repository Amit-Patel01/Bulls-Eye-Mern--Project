/**
 * Environment Variable Validation Utility
 * Ensures all required environment variables are set before starting the server
 */

function validateEnvironment() {
  const requiredVars = [
    'GOOGLE_API_KEY',
    'MONGODB_URI'
  ];

  const missingVars = [];
  const emptyVars = [];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    
    if (!value) {
      missingVars.push(varName);
    } else if (value.includes('your_') || value === 'placeholder') {
      emptyVars.push(varName);
    }
  }

  if (missingVars.length > 0 || emptyVars.length > 0) {
    console.error('\n❌ Environment Configuration Error\n');
    
    if (missingVars.length > 0) {
      console.error('Missing required environment variables:');
      missingVars.forEach(v => console.error(`  - ${v}`));
    }
    
    if (emptyVars.length > 0) {
      console.error('\nEnvironment variables with placeholder values (not configured):');
      emptyVars.forEach(v => console.error(`  - ${v}`));
    }
    
    console.error('\n📋 Setup Instructions:');
    console.error('  1. Copy .env.example to .env (or configure via platform):');
    console.error('     $ cp .env.example .env');
    console.error('  2. Fill in your actual values in .env');
    console.error('  3. For Vercel/Render: Add variables in deployment settings\n');
    
    console.error('📚 Configuration Guide:');
    console.error('  - GOOGLE_API_KEY: Get from https://ai.google.dev/');
    console.error('  - MONGODB_URI: Use MongoDB Atlas at https://www.mongodb.com/cloud/atlas\n');
    
    process.exit(1);
  }

  console.log('✅ All required environment variables are configured');
  return true;
}

/**
 * Get environment variable with optional fallback
 */
function getEnv(key, defaultValue = null) {
  const value = process.env[key];
  if (!value && defaultValue === null) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value || defaultValue;
}

/**
 * Check if running in production
 */
function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get safe environment summary (without sensitive values)
 */
function getEnvironmentSummary() {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY ? '***configured***' : 'NOT SET',
    MONGODB_URI: process.env.MONGODB_URI ? '***configured***' : 'NOT SET',
  };
}

module.exports = {
  validateEnvironment,
  getEnv,
  isProduction,
  getEnvironmentSummary,
};

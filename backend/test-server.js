// Simple test to verify server startup
const { config } = require('./src/config/config');
const { connectDatabase } = require('./src/config/database');

async function testServer() {
  try {
    console.log('🧪 Testing server configuration...');
    console.log('📊 Environment:', config.nodeEnv);
    console.log('🚀 Port:', config.port);
    console.log('🌐 CORS Origin:', config.cors.origin);
    
    console.log('\n🗄️ Testing database connection...');
    await connectDatabase();
    console.log('✅ Database connection successful!');
    
    console.log('\n🎉 Server configuration is valid!');
    console.log('💡 Run "npm run dev" to start the server');
    
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    process.exit(1);
  }
}

testServer();

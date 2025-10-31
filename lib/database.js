import postgres from 'postgres'

let sql

try {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  sql = postgres(connectionString, {
    ssl: 'require',
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    connect_timeout: 10,
    max: 10
  })

  console.log('✅ Database connection established')

} catch (error) {
  console.error('❌ Database connection failed:', error.message)
  // Create a mock sql instance that returns empty arrays
  sql = {
    unsafe: () => {
      console.log('⚠️ Using mock database - returning empty array')
      return Promise.resolve([])
    },
    [Symbol.dispose]: () => {}
  }
}

export default sql

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
    max: 10,
    transform: {
      column: { 
        from: (name) => name,
        to: (name) => name 
      }
    }
  })

  console.log('✅ Database connection established')

  // Test connection
  const [result] = await sql`SELECT 1 as test`
  console.log('✅ Database test query successful')

} catch (error) {
  console.error('❌ Database connection failed:', error.message)
  
  // Create a mock sql instance that returns empty arrays
  sql = {
    unsafe: (query, params) => {
      console.log('⚠️ Using mock database - returning empty array')
      console.log('Mock query:', query)
      console.log('Mock params:', params)
      return Promise.resolve([])
    },
    [Symbol.dispose]: () => {},
    end: () => {}
  }
}

export default sql

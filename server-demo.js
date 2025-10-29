const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Add custom middleware for CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

server.use(middlewares)

// Custom routes for auth
server.post('/api/auth/send-otp', (req, res) => {
  const { mobile } = req.body
  console.log(`Mock OTP sent to ${mobile}: 123456`)
  res.json({ success: true, message: 'OTP sent successfully' })
})

server.post('/api/auth/verify-otp', (req, res) => {
  const { mobile, otp } = req.body
  if (otp === '123456') {
    // Check if user exists
    const users = router.db.get('users').value()
    let user = users.find(u => u.mobile === mobile)
    
    if (!user) {
      // Create new user
      user = {
        id: Date.now().toString(),
        mobile: mobile,
        tokens: 0,
        createdAt: new Date().toISOString()
      }
      router.db.get('users').push(user).write()
    }
    
    res.json({ 
      success: true, 
      token: 'mock-jwt-token',
      user: user
    })
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' })
  }
})

server.post('/api/wallet/buy', (req, res) => {
  const { userId, bundle } = req.body
  const users = router.db.get('users').value()
  const user = users.find(u => u.id === userId)
  
  if (user) {
    user.tokens += bundle.tokens
    router.db.get('users').find({ id: userId }).assign(user).write()
    
    // Add transaction
    const transaction = {
      id: Date.now().toString(),
      userId: userId,
      type: 'purchase',
      tokens: bundle.tokens,
      amount: bundle.price,
      createdAt: new Date().toISOString()
    }
    router.db.get('transactions').push(transaction).write()
    
    res.json({ success: true, tokens: user.tokens })
  } else {
    res.status(404).json({ success: false, message: 'User not found' })
  }
})

server.post('/api/listings/:id/unlock', (req, res) => {
  const { id } = req.params
  const { userId } = req.body
  
  const users = router.db.get('users').value()
  const user = users.find(u => u.id === userId)
  
  if (user && user.tokens >= 1) {
    // Deduct token
    user.tokens -= 1
    router.db.get('users').find({ id: userId }).assign(user).write()
    
    // Add transaction
    const transaction = {
      id: Date.now().toString(),
      userId: userId,
      type: 'unlock',
      tokens: 1,
      listingId: id,
      createdAt: new Date().toISOString()
    }
    router.db.get('transactions').push(transaction).write()
    
    // Get listing contact
    const listing = router.db.get('listings').find({ id: id }).value()
    
    res.json({ 
      success: true, 
      contactNumber: listing.contactNumber,
      tokens: user.tokens
    })
  } else {
    res.status(400).json({ success: false, message: 'Insufficient tokens' })
  }
})

// Use default router
server.use('/api', router)

const PORT = 3001
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
  console.log(`API available at http://localhost:${PORT}/api`)
})

const sessions = new Map(); 

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function sessionMiddleware(req, res, next) {
  // Check if cookie exists
  const cookies = req.headers.cookie || '';
  const sessionMatch = cookies.match(/sessionId=([^;]+)/);
  
  let sessionId = sessionMatch ? sessionMatch[1] : null;

  // Create new session if req
  if (!sessionId || !sessions.has(sessionId)) {
    sessionId = generateSessionId();
    sessions.set(sessionId, {
      id: sessionId,
      createdAt: new Date(),
      data: {}
    });
    
    res.setHeader('Set-Cookie', `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=86400`);
  }

  req.session = sessions.get(sessionId);
  req.sessionId = sessionId;

  next();
}

module.exports = sessionMiddleware;
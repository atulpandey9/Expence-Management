const jwt =require('jsonwebtoken');
const tokenblacklist=require('../models/blacklist.model')


const authuser = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.authorizationheader;
  let token = null;

  if (authHeader) {
    token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "token not provided" });
  }

  try {
    const istokenblacklist = await tokenblacklist.findOne({ token });
    if (istokenblacklist) {
      return res.status(401).json({ message: "token is invalid" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "invalid token"
    });
  }
};
module.exports={authuser}
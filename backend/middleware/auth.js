import jwt from 'jsonwebtoken';

const isTokenValid = (req) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');

  if (!token) {
    return false;
  }

  let decrypted;

  try {
    decrypted = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error(err);

    if (err instanceof jwt.TokenExpiredError) {
      return false;
    }

    return false;
  }

  req.user = decrypted;
  return true;
};

export const requireAuth = (req, res, next) => {
  if (isTokenValid(req)) {
    next();
  } else {
    return res.status(302).redirect(`${process.env.CLIENT_URL}/auth`);
  }
};

export const checkAuth = (req, _res, next) => {
  isTokenValid(req);
  next();
};

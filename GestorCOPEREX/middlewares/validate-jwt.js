import jwt from 'jsonwebtoken';

const normalize = (value) => String(value || '').trim().toLowerCase();
const getAdminRoles = () =>
  (process.env.ADMIN_ROLE_NAME || 'admin_role,admin,administrador')
    .split(',')
    .map(normalize)
    .filter(Boolean);

const extractRoles = (payload) => {
  const candidates = [
    payload?.role,
    payload?.rol,
    payload?.roles,
    payload?.authorities,
    payload?.user?.role,
    payload?.user?.roles,
  ];

  return candidates
    .flatMap((role) => {
      if (Array.isArray(role)) return role;
      if (typeof role === 'string') return role.split(',');
      return [];
    })
    .map(normalize)
    .filter(Boolean);
};

const hasAdminRole = (payload) => {
  if (payload?.isAdmin === true || payload?.user?.isAdmin === true) return true;
  const adminRoles = getAdminRoles();
  const roles = extractRoles(payload);
  return roles.some((role) => adminRoles.some((admin) => role === admin || role.includes(admin)));
};

const verifyToken = (token) => {
  const options = {};

  if (process.env.JWT_ISSUER) options.issuer = process.env.JWT_ISSUER;
  if (process.env.JWT_AUDIENCE) options.audience = process.env.JWT_AUDIENCE;

  try {
    return jwt.verify(token, process.env.JWT_SECRET, options);
  } catch (error) {
    const isAudienceError =
      Object.prototype.hasOwnProperty.call(options, 'audience') &&
      typeof error?.message === 'string' &&
      error.message.toLowerCase().includes('jwt audience invalid');

    if (!isAudienceError) throw error;

    const fallback = { ...options };
    delete fallback.audience;
    return jwt.verify(token, process.env.JWT_SECRET, fallback);
  }
};

export const validateJWT = (req, res, next) => {
  const rawToken =
    req.headers.authorization || req.header('x-token') || req.body?.token || req.query?.token || '';

  const tokenStr = String(rawToken || '').trim();
  const bearerRegex = /^bearer\s+/i;
  const token = bearerRegex.test(tokenStr) ? tokenStr.replace(bearerRegex, '').trim() : tokenStr;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization token is required' });
  }

  try {
    const payload = verifyToken(token);

    if (!hasAdminRole(payload)) {
      return res.status(403).json({ success: false, message: 'Admin role is required' });
    }

    req.auth = payload;
    req.token = token;
    return next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ success: false, message, error: error.message });
  }
};

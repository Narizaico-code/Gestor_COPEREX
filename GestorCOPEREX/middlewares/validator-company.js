import { body, param, query, validationResult } from 'express-validator';

const impactLevels = ['alto', 'medio', 'bajo'];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    message: 'Error de validación',
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    })),
  });
};

export const createCompanyValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 160 }).withMessage('El nombre no puede exceder 160 caracteres'),
  body('impactLevel')
    .trim()
    .toLowerCase()
    .isIn(impactLevels).withMessage('El nivel de impacto debe ser alto, medio o bajo'),
  body('yearsOfExperience')
    .isInt({ min: 0, max: 200 }).withMessage('Los años de experiencia deben estar entre 0 y 200'),
  body('category')
    .trim()
    .notEmpty().withMessage('La categoría es obligatoria')
    .isLength({ max: 120 }).withMessage('La categoría no puede exceder 120 caracteres'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 400 }).withMessage('Las notas no pueden exceder 400 caracteres'),
  body('logo').custom((_, { req }) => {
    if (!req.file) {
      throw new Error('El logo es obligatorio');
    }
    return true;
  }),
  handleValidation,
];

export const updateCompanyValidator = [
  param('id')
    .isMongoId().withMessage('El id de la empresa no es válido'),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede ir vacío')
    .isLength({ max: 160 }).withMessage('El nombre no puede exceder 160 caracteres'),
  body('impactLevel')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(impactLevels).withMessage('El nivel de impacto debe ser alto, medio o bajo'),
  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0, max: 200 }).withMessage('Los años de experiencia deben estar entre 0 y 200'),
  body('category')
    .optional()
    .trim()
    .notEmpty().withMessage('La categoría no puede ir vacía')
    .isLength({ max: 120 }).withMessage('La categoría no puede exceder 120 caracteres'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 400 }).withMessage('Las notas no pueden exceder 400 caracteres'),
  handleValidation,
];

export const companyIdValidator = [
  param('id')
    .isMongoId().withMessage('El id de la empresa no es válido'),
  handleValidation,
];

export const companyQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('La página debe ser un entero mayor a 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
  query('minYears')
    .optional()
    .isInt({ min: 0, max: 200 }).withMessage('El mínimo de años debe estar entre 0 y 200'),
  query('maxYears')
    .optional()
    .isInt({ min: 0, max: 200 }).withMessage('El máximo de años debe estar entre 0 y 200'),
  query('impactLevel')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(impactLevels).withMessage('El nivel de impacto debe ser alto, medio o bajo'),
  query('alphabetical')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['az', 'za']).withMessage('alphabetical debe ser az o za'),
  query('sortBy')
    .optional()
    .trim()
    .isIn(['name', 'category', 'yearsOfExperience', 'createdAt']).withMessage('sortBy no es válido'),
  query('sortOrder')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['asc', 'desc']).withMessage('sortOrder debe ser asc o desc'),
  handleValidation,
];

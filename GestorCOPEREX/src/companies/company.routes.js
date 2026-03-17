import { Router } from 'express';

import {
  companyIdValidator,
  companyQueryValidator,
  createCompanyValidator,
  updateCompanyValidator,
} from '../../middlewares/validator-company.js';
import {
  createCompany,
  getCompanyById,
  listCompanies,
  updateCompany,
  exportCompaniesToExcel,
} from './company.controller.js';
import { uploadCompanyLogo } from '../../middlewares/file-uploader.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = Router();

router.use(validateJWT);

router.get('/export/excel', companyQueryValidator, exportCompaniesToExcel);
router.get('/', companyQueryValidator, listCompanies);
router.get('/:id', companyIdValidator, getCompanyById);
router.post('/', uploadCompanyLogo.single('logo'), createCompanyValidator, createCompany);
router.patch('/:id', uploadCompanyLogo.single('logo'), updateCompanyValidator, updateCompany);

export default router;

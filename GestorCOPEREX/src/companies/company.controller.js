import Company from './company.model.js';
import { buildCompaniesWorkbook } from '../service/excel.service.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildFilters = (query = {}) => {
  const filters = {};

  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
    filters.$or = [{ name: regex }, { category: regex }];
  }

  if (query.category) {
    filters.category = new RegExp(`^${escapeRegex(query.category.trim())}$`, 'i');
  }

  if (query.impactLevel) {
    filters.impactLevel = query.impactLevel.trim().toLowerCase();
  }

  if (query.minYears || query.maxYears) {
    filters.yearsOfExperience = {};
    if (query.minYears) filters.yearsOfExperience.$gte = Number(query.minYears);
    if (query.maxYears) filters.yearsOfExperience.$lte = Number(query.maxYears);
  }

  return filters;
};

const buildSort = (query = {}) => {
  if (query.alphabetical) {
    return { name: query.alphabetical.toLowerCase() === 'za' ? -1 : 1 };
  }

  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  return { [sortBy]: sortOrder };
};

const cleanPayload = (payload) =>
  Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));

const buildLogo = (file) => {
  if (!file) return undefined;
  return {
    url: file.path || file.secure_url || null,
    publicId: file.filename || file.public_id || null,
  };
};

const buildAddedBy = (auth = {}) => {
  const candidate = auth.sub || auth.uid || auth.userId || auth.id || null;
  return candidate ? String(candidate) : null;
};

const findCompanyByName = async (name = '') => {
  if (!name) return null;
  return Company.findOne({ name: new RegExp(`^${escapeRegex(name.trim())}$`, 'i') });
};

export const createCompany = async (req, res) => {
  try {
    const existing = await findCompanyByName(req.body.name);
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: 'Ya existe una empresa con ese nombre' });
    }

    const company = await Company.create({
      ...cleanPayload(req.body),
      logo: buildLogo(req.file),
      addedBy: buildAddedBy(req.auth),
    });

    return res.status(201).json({
      success: true,
      message: 'Empresa registrada correctamente',
      company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al registrar la empresa',
      error: error.message,
    });
  }
};

export const listCompanies = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;
    const filters = buildFilters(req.query);
    const sort = buildSort(req.query);

    const [companies, total] = await Promise.all([
      Company.find(filters).sort(sort).skip(skip).limit(limit),
      Company.countDocuments(filters),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Empresas obtenidas correctamente',
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
      filters,
      companies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las empresas',
      error: error.message,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    return res.status(200).json({ success: true, company });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la empresa',
      error: error.message,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    if (req.body.name) {
      const existing = await findCompanyByName(req.body.name);
      if (existing && String(existing._id) !== String(req.params.id)) {
        return res
          .status(409)
          .json({ success: false, message: 'Ya existe una empresa con ese nombre' });
      }
    }

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      cleanPayload({
        ...req.body,
        logo: buildLogo(req.file),
      }),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!company) {
      return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    return res.status(200).json({
      success: true,
      message: 'Empresa actualizada correctamente',
      company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la empresa',
      error: error.message,
    });
  }
};

export const exportCompaniesToExcel = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const sort = buildSort(req.query);
    const companies = await Company.find(filters).sort(sort);
    const workbook = await buildCompaniesWorkbook(companies);
    const reportName = `${process.env.REPORT_FILE_NAME || 'empresas-coperex'}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${reportName}`);

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al generar el reporte Excel',
      error: error.message,
    });
  }
};

import ExcelJS from 'exceljs';

const columns = [
	{ header: 'Nombre', key: 'name', width: 32 },
	{ header: 'Categoría', key: 'category', width: 22 },
	{ header: 'Nivel de impacto', key: 'impactLevel', width: 18 },
	{ header: 'Años de experiencia', key: 'yearsOfExperience', width: 18 },
	{ header: 'Notas', key: 'notes', width: 40 },
	{ header: 'Registrado por', key: 'registeredBy', width: 28 },
	{ header: 'Fecha de registro', key: 'createdAt', width: 24 },
];

export const buildCompaniesWorkbook = async (companies) => {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Empresas');

	workbook.creator = 'COPEREX';
	workbook.created = new Date();

	worksheet.columns = columns;
	worksheet.views = [{ state: 'frozen', ySplit: 1 }];

	worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
	worksheet.getRow(1).fill = {
		type: 'pattern',
		pattern: 'solid',
		fgColor: { argb: 'FF0F766E' },
	};

	companies.forEach((company) => {
		worksheet.addRow({
			name: company.name,
			category: company.category,
			impactLevel: company.impactLevel,
			yearsOfExperience: company.yearsOfExperience,
			notes: company.notes,
			registeredBy: company.addedBy?.toString?.() || 'N/A',
			createdAt: company.createdAt ? new Date(company.createdAt).toLocaleString('es-GT') : 'N/A',
		});
	});

	worksheet.eachRow((row, rowNumber) => {
		row.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
		if (rowNumber > 1) {
			row.eachCell((cell) => {
				cell.border = {
					top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
					left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
					bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
					right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
				};
			});
		}
	});

	return workbook;
};

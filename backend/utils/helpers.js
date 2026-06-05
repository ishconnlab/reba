const buildPagination = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;
  return { page: pageNum, limit: limitNum, skip };
};

const buildSearchFilter = (fields, searchTerm) => {
  if (!searchTerm || !fields.length) return {};
  const regex = new RegExp(searchTerm, 'i');
  return {
    $or: fields.map((field) => ({ [field]: regex })),
  };
};

module.exports = { buildPagination, buildSearchFilter };

export const successResponse = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

export const errorResponse = (res, statusCode, message, details = null) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    details
  });
};

export const paginateResponse = (data, page, limit, total) => {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

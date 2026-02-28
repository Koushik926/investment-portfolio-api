const sendResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const sendPaginatedResponse = (res, statusCode, message, data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

module.exports = {
  sendResponse,
  sendPaginatedResponse,
};

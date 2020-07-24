module.exports = {
	successObject: {
		success: true,
		message: 'Successfully got data',
		statusCode: 200
	},
	errorObject: {
		success: false,
		message: 'Error while fetching data',
		statusCode: 400
	},
	dataNotFound: {
		success: true,
		message: 'No data found',
		statusCode: 404
	}
};

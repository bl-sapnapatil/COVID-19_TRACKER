('use-strict');

const mongoose = require('mongoose');

let config;
let logger;

mongoose.set('debug', (coll, method, query, doc) => {
	if (!config.isProduction) {
		// console.log('mongodb production', JSON.stringify([coll, method, query, doc], 0, 4));
	}
});

// Fix for error : Mongoose: mpromise (mongoose's default promise library)
// is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;
/**
 * @description Connecting the mongodb
 */
const connect = config => {
	if (config.database.mongodb.dbFullURL) {
		if (config.database.mongodb.username && config.database.mongodb.password && config.database.mongodb.name) {
			config.database.mongodb.dbFullURL = config.database.mongodb.dbFullURL.replace(
				'<host>',
				config.database.mongodb.host
			);
			config.database.mongodb.dbFullURL = config.database.mongodb.dbFullURL.replace(
				'<username>',
				config.database.mongodb.username
			);
			config.database.mongodb.dbFullURL = config.database.mongodb.dbFullURL.replace(
				'<password>',
				config.database.mongodb.password
			);
			config.database.mongodb.dbFullURL = config.database.mongodb.dbFullURL.replace(
				'<dbname>',
				config.database.mongodb.name
			);
		}
	}
	mongoose.connect(
		config.database.mongodb.dbFullURL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
			// poolSize: 10  // other options can go here
		},
		err => {
			if (err) {
				config.logger.log('error', 'MongoDB connection error', err);
				config.logger.error(`MongoDB connection error: ${err}`);
				process.exit(1);
			}
		}
	);
	// return mongoose;
};

mongoose.connection.on('connected', () => {
	logger.info(`MongoDB event connected : ${config.database.mongodb.dbURI}`);
});

mongoose.connection.once('open', () => {
	if (!config.isProduction) {
		logger.debug('MongoDB connected [%s]', config.database.mongodb.dbURI);
	}

	mongoose.connection.on('disconnected', () => {
		logger.info('MongoDB event disconnected');
		logger.warn(`MongoDB event disconnected : ${!config.isProduction ? config.database.mongodb.dbURI : ''}`);
	});

	mongoose.connection.on('disconnect', err => {
		logger.info(`Mongoose disconnect: ${err}`);
	});

	mongoose.connection.on('reconnected', () => {
		logger.info('MongoDB event reconnected');
	});

	mongoose.connection.on('error', err => {
		logger.error(`MongoDB event error: ${JSON.stringify(err, 0, 4)}`);
	});

	mongoose.connection.on('parseError', err => {
		logger.error(`Mongoose parseError:${JSON.stringify(err, 0, 4)}`);
	});
});

mongoose.connection.on('timeout', err => {
	logger.info('Mongoose timeout');
	logger.error(`Mongoose timeout ${JSON.stringify(err, 0, 4)}`);
});

const gracefulExit = () => {
	mongoose.connection.close(() => {
		if (config.isProduction) {
			logger.info('Mongoose default connection with DB Mongodb is disconnected through app termination');
		} else {
			logger.warn(`MongoDB event disconnected : ${config.database.mongodb.dbURI}`);
		}
		process.exit(0);
	});
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit); // .on('SIGTERM', gracefulExit);

module.exports = {
	init: config_data => {
		config = config_data;
		logger = config.logger;
		return connect(config);
	},
	mongoose,
};

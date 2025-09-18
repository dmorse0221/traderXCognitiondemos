interface EnvironmentConfig {
	production: boolean;
	trade_feed_url: string;
	account_service_url: string;
	trade_service_url: string;
	reference_data_url: string;
	people_service_url: string;
	position_service_url: string;
}

const developmentConfig: EnvironmentConfig = {
	production: false,
	trade_feed_url: `http://${window.location.hostname}:18086`,
	account_service_url: `http://${window.location.hostname}:18088`,
	trade_service_url: `http://${window.location.hostname}:18092`,
	reference_data_url: `http://${window.location.hostname}:18085`,
	people_service_url: `http://${window.location.hostname}:18089`,
	position_service_url: `http://${window.location.hostname}:18090`
};

const productionConfig: EnvironmentConfig = {
	production: true,
	trade_feed_url: `//${window.location.host}`,
	account_service_url: `//${window.location.host}/account-service`,
	trade_service_url: `//${window.location.host}/trade-service`,
	reference_data_url: `//${window.location.host}/reference-data`,
	people_service_url: `//${window.location.host}/people-service`,
	position_service_url: `//${window.location.host}/position-service`
};

export const Environment: EnvironmentConfig = process.env.NODE_ENV === 'production' 
	? productionConfig 
	: developmentConfig;

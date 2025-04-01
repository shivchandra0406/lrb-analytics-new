class Config {
    config = {}; 
    constructor() {
        this.loadConfig();
    }

    loadConfig() {
        const env = process.env.ENV || 'dev'; 
        switch (env) {
            case 'dev':
                this.config.mongoUri = process.env.DEV_MONGO_URI;
                break;
            case 'qa':
                this.config.mongoUri = process.env.QA_MONGO_URI;
                break;
            case 'prd':
                this.config.mongoUri = process.env.PRD_MONGO_URI;
                break;
            default:
                throw new Error(`Invalid environment setting: ${env}. Please check your environment variables.`);
        }
    }
    static getConfig() {
        if (!this.instance) {
            this.instance = new Config();  
        }
        return this.instance.config;  
    }
}

module.exports = Config;

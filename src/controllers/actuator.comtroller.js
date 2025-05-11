const actuatorService = require('../services/actuatorService');

async function globalStatus(req, res) {
    try {
        const status = await actuatorService.getGlobalStatus();
        res.json(status);
        logger.info('Fetched global status');
    } catch (error) {
        logger.error('Fetched global status: ${error.message')

        res.status(500).json({ error: 'An error occurred while fetching global status' });
    }
}

module.exports = {
    globalStatus,
};

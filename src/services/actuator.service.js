const axios = require('axios');
const os = require('os');
const fs = require('fs');
const sequelize = require('../config/database');

async function checkExternalService() {
    try {
        const response = await axios.get('https://example.com/api/status');
        return response.status === 200 ? 'External service is UP' : 'External service is DOWN';
    } catch (error) {
        return 'External service is DOWN';
    }
}

async function checkDiskSpace() {
    try {
        const stats = fs.statSync('/');
        const freeSpace = stats.free;
        const totalSpace = stats.size;
        return {
            freeSpace,
            totalSpace,
            freeSpacePercentage: ((freeSpace / totalSpace) * 100).toFixed(2),
        };
    } catch (error) {
        return 'Disk check failed';
    }
}

async function checkServerHealth() {
    const startTime = Date.now();
    try {
        const response = await axios.get('http://localhost:3000/health');
        const latency = Date.now() - startTime;
        return {
            status: response.status === 200 ? 'Server is UP' : 'Server is DOWN',
            latency: latency + 'ms',
        };
    } catch (error) {
        return 'Server health check failed';
    }
}

async function checkRecentLogs() {
    try {
        const logs = fs.readFileSync('logs/app.log', 'utf-8');
        const lastLogs = logs.split('\n').slice(-10);
        return { recentLogs: lastLogs };
    } catch (error) {
        return 'Log check failed';
    }
}

async function getGlobalStatus() {
    const dbStatus = await sequelize.authenticate()
        .then(() => 'Database connected successfully')
        .catch(() => 'Database connection failed');

    const memoryStatus = {
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
        freeMemoryPercentage: ((os.freemem() / os.totalmem()) * 100).toFixed(2),
        cpuLoad: os.loadavg(),
    };

    const externalServiceStatus = await checkExternalService();
    const diskSpaceStatus = await checkDiskSpace();
    const serverStatus = await checkServerHealth();
    const logsStatus = await checkRecentLogs();

    return {
        status: 'UP',
        dbStatus,
        memoryStatus,
        externalServiceStatus,
        diskSpaceStatus,
        serverStatus,
        logsStatus,
        timestamp: new Date().toISOString(),
    };
}

module.exports = {
    getGlobalStatus,
};

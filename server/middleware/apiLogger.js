const Log = require('../models/Log');
const ApiKey = require('../models/ApiKey');
const User = require('../models/User');

const apiLogger = async (req, res, next) => {
    const start = Date.now();
    const originalSend = res.send;

    const apiKeyHeader = req.headers['x-api-key'];
    let detectedUserId = null;
    let detectedUserName = 'Anonymous';

    // 1. Cek Pemilik API Key
    if (apiKeyHeader) {
        try {
            const keyRecord = await ApiKey.findOne({ 
                where: { key: apiKeyHeader },
                include: [{ model: User }] 
            });

            if (keyRecord && keyRecord.User) {
                // PERBAIKAN DISINI: Gunakan 'userId' (huruf kecil)
                detectedUserId = keyRecord.userId; 
                detectedUserName = keyRecord.User.name;

                const waktu = new Date().toString();
                console.log(`User ${detectedUserName} mengakses data pada ${waktu}`);
            }
        } catch (err) {
            console.error("Error cek API Key:", err);
        }
    }

    // 2. Override res.send untuk simpan Log
    res.send = function (data) {
        const duration = Date.now() - start;
        
        (async () => {
            try {
                if (req.originalUrl.startsWith('/api/v1')) {
                    await Log.create({
                        method: req.method,
                        endpoint: req.originalUrl,
                        statusCode: res.statusCode,
                        responseTime: duration,
                        userAgent: req.get('user-agent') || 'unknown',
                        
                        // PERBAIKAN DISINI: Gunakan 'userId' (huruf kecil)
                        userId: detectedUserId 
                    });
                }
            } catch (err) {
                console.error("Gagal simpan log DB:", err);
            }
        })();

        originalSend.apply(res, arguments);
    };

    next();
};

module.exports = apiLogger;
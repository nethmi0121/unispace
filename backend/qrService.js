const QRCode = require('qrcode');
const speakeasy = require('speakeasy');

// Store QR code secrets for each room
const roomSecrets = new Map();

// Generate a unique secret for a room
function generateRoomSecret(roomId) {
    const secret = speakeasy.generateSecret({
        name: `Room ${roomId}`,
        length: 20
    });
    roomSecrets.set(roomId, secret.base32);
    return secret.base32;
}

// Get or create room secret
function getRoomSecret(roomId) {
    if (!roomSecrets.has(roomId)) {
        return generateRoomSecret(roomId);
    }
    return roomSecrets.get(roomId);
}

// Generate QR code data (short format)
function generateQRData(roomId, secret) {
    const timestamp = Math.floor(Date.now() / 600000);
    const token = speakeasy.totp({
        secret: secret,
        encoding: 'base32',
        step: 600,
        digits: 6
    });
    
    console.log(`Generated token for room ${roomId}:`, { token, timestamp });
    
    // Return with both short and long keys for compatibility
    return {
        r: roomId,
        t: token,
        ts: timestamp,
        roomId: roomId,
        token: token,
        timestamp: timestamp
    };
}

// Generate QR code image
async function generateQRCodeImage(roomId) {
    try {
        const secret = getRoomSecret(roomId);
        const qrData = generateQRData(roomId, secret);
        const qrString = JSON.stringify(qrData);
        
        const qrImage = await QRCode.toDataURL(qrString, {
            errorCorrectionLevel: 'L',
            margin: 1,
            width: 300,
            color: {
                dark: '#1a1a2e',
                light: '#ffffff'
            }
        });
        
        return {
            qrImage: qrImage,
            qrData: qrData,
            expiresIn: 600 // 10 minutes
        };
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}

// Verify QR code token
function verifyQRCode(roomId, token) {
    const secret = roomSecrets.get(roomId);
    if (!secret) return false;
    
    const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        step: 600,
        window: 1
    });
    
    return verified;
}

// Refresh QR code
async function refreshQRCode(roomId) {
    generateRoomSecret(roomId);
    return await generateQRCodeImage(roomId);
}

module.exports = {
    generateQRCodeImage,
    verifyQRCode,
    refreshQRCode,
    getRoomSecret
};
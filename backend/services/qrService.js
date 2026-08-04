const QRCode = require('qrcode');
const speakeasy = require('speakeasy');

const roomSecrets = new Map();

function generateRoomSecret(roomId) {
    const secret = speakeasy.generateSecret({
        name: `Room ${roomId}`,
        length: 20
    });
    roomSecrets.set(String(roomId), secret.base32);
    return secret.base32;
}

function getRoomSecret(roomId) {
    const idStr = String(roomId);
    if (!roomSecrets.has(idStr)) {
        return generateRoomSecret(idStr);
    }
    return roomSecrets.get(idStr);
}

function generateQRData(roomId, secret) {
    const timestamp = Math.floor(Date.now() / 600000);
    const token = speakeasy.totp({
        secret: secret,
        encoding: 'base32',
        step: 600,
        digits: 6
    });

    return {
        r: roomId,
        t: token,
        ts: timestamp,
        roomId: roomId,
        token: token,
        timestamp: timestamp
    };
}

async function generateQRCodeImage(roomId) {
    try {
        const secret = getRoomSecret(roomId);
        const qrData = generateQRData(roomId, secret);
        const qrString = JSON.stringify(qrData);

        const qrImage = await QRCode.toDataURL(qrString, {
            errorCorrectionLevel: 'L',
            margin: 1,
            width: 300,
            color: { dark: '#1a1a2e', light: '#ffffff' }
        });

        return {
            qrImage: qrImage,
            qrData: qrData,
            expiresIn: 600
        };
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}

function verifyQRCode(roomId, token) {
    const secret = roomSecrets.get(String(roomId));
    if (!secret) return false;

    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        step: 600,
        window: 1
    });
}

module.exports = { generateQRCodeImage, verifyQRCode };
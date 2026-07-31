const express = require('express');
const cors = require('cors');
const qrService = require('./qrService');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Room data
let rooms = [
    { id: 1, name: 'Room 101', capacity: 30, currentOccupancy: 15, isCheckedIn: false },
    { id: 2, name: 'Room 102', capacity: 25, currentOccupancy: 20, isCheckedIn: false },
    { id: 3, name: 'Room 103', capacity: 40, currentOccupancy: 35, isCheckedIn: false },
    { id: 4, name: 'Room 104', capacity: 20, currentOccupancy: 10, isCheckedIn: false },
];

// QR Code cache
const qrCache = new Map();

// Refresh all QR codes
async function refreshAllQRCodes() {
    for (const room of rooms) {
        try {
            const qrData = await qrService.generateQRCodeImage(room.id);
            qrCache.set(room.id, {
                ...qrData,
                generatedAt: new Date()
            });
            console.log(`✅ QR Code refreshed for Room ${room.id}`);
        } catch (error) {
            console.error(`Failed to refresh QR for Room ${room.id}:`, error);
        }
    }
}

// ============ API ROUTES ============

// Get all rooms
app.get('/api/rooms', (req, res) => {
    res.json(rooms);
});

// Get QR code for a room
app.get('/api/rooms/:id/qrcode', async (req, res) => {
    const roomId = parseInt(req.params.id);
    const room = rooms.find(r => r.id === roomId);
    
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    
    try {
        const cached = qrCache.get(roomId);
        const now = new Date();
        const expiryTime = 10 * 60 * 1000;
        
        if (cached && (now - cached.generatedAt) < expiryTime) {
            return res.json({
                roomId: roomId,
                qrImage: cached.qrImage,
                qrData: cached.qrData,
                expiresIn: Math.ceil((expiryTime - (now - cached.generatedAt)) / 1000),
                generatedAt: cached.generatedAt,
                roomName: room.name
            });
        }
        
        const qrData = await qrService.generateQRCodeImage(roomId);
        qrCache.set(roomId, {
            ...qrData,
            generatedAt: new Date()
        });
        
        res.json({
            roomId: roomId,
            qrImage: qrData.qrImage,
            qrData: qrData.qrData,
            expiresIn: qrData.expiresIn,
            generatedAt: new Date(),
            roomName: room.name
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

// Scan QR code and check in
app.post('/api/rooms/:id/scan', async (req, res) => {
    const roomId = parseInt(req.params.id);
    const { token } = req.body;
    
    console.log(`Scan request for room ${roomId}:`, { token });
    
    if (!token) {
        return res.status(400).json({ error: 'QR token is required' });
    }
    
    const room = rooms.find(r => r.id === roomId);
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    
    const isValid = qrService.verifyQRCode(roomId, token);
    console.log(`Token verification for room ${roomId}:`, { isValid, token });
    
    if (!isValid) {
        return res.status(400).json({ 
            error: 'Invalid or expired QR code. Please scan the latest QR code.' 
        });
    }
    
    if (room.currentOccupancy >= room.capacity) {
        return res.status(400).json({ error: 'Room is full!' });
    }
    
    room.currentOccupancy += 1;
    room.isCheckedIn = true;
    
    console.log(`✅ Student checked in to Room ${roomId}`);
    
    res.json({
        success: true,
        message: `Successfully checked into ${room.name}`,
        room: room,
        checkInTime: new Date().toISOString()
    });
});

// Refresh QR code
app.post('/api/rooms/:id/refreshqr', async (req, res) => {
    const roomId = parseInt(req.params.id);
    const room = rooms.find(r => r.id === roomId);
    
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    
    try {
        const qrData = await qrService.refreshQRCode(roomId);
        qrCache.set(roomId, {
            ...qrData,
            generatedAt: new Date()
        });
        
        res.json({
            success: true,
            message: 'QR Code refreshed successfully',
            roomId: roomId,
            expiresIn: qrData.expiresIn
        });
    } catch (error) {
        console.error('Error refreshing QR code:', error);
        res.status(500).json({ error: 'Failed to refresh QR code' });
    }
});

// Auto-refresh every 10 minutes
setInterval(async () => {
    console.log('🔄 Auto-refreshing QR codes...');
    await refreshAllQRCodes();
}, 10 * 60 * 1000);

// Initial QR generation
refreshAllQRCodes().then(() => {
    console.log('✅ Initial QR codes generated for all rooms');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
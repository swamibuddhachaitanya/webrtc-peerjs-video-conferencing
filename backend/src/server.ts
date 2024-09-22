import express from 'express';
import { ExpressPeerServer, IConfig } from 'peer';
import http from 'http';
import fs from "fs";
import cors from 'cors';
import jwt from 'jsonwebtoken';
import helmet from "helmet";

// SSL Certificates
// const privateKey = fs.readFileSync("cert.key", 'utf8');
// const certificate = fs.readFileSync("cert.crt", 'utf8');
// const credentials = { key: privateKey, cert: certificate };

const app = express();
app.use(helmet());
// Allow CORS from your frontend domain
app.use(
    cors({
        origin: 'http://localhost:5173', // Replace with your frontend's domain
        credentials: true,
    })
);
app.use(express.json());

// Public Route to test http
app.get('/', (req, res) => {
    res.send('Welcome to the secure server!');
});


// JWT Authentication Middleware
app.use((req, res, next) => {
    // Skip authentication for specific routes
    if (req.path.startsWith('/peerjs') || req.path === '/login') {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) return res.sendStatus(403); // Forbidden
        (req as any).user = decoded;
        next();
    });
});


// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Simple user validation (replace with real authentication)
    if (username === 'user' && password === 'pass') {
        const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.sendStatus(401);
    }
});

// Create HTTP Server
const httpServer = http.createServer(app);

// Extend IConfig to include 'debug'
interface CustomPeerConfig extends Partial<IConfig> {
    debug?: boolean;
}

// PeerJS Signaling Server with Extended Config
const peerServer = ExpressPeerServer(httpServer, {
    debug: true,
    path: '/myapp',
} as CustomPeerConfig);

// Apply PeerJS Server Middleware
app.use('/peerjs', peerServer);



let activeParticipants = new Set<string>();

peerServer.on('connection', (client) => {
    const clientId = client.getId();
    console.log(`Client connected: ${clientId}`);

    if (activeParticipants.size >= 5) {
        // Disconnect the client if max participants reached
        client.getSocket()?.close();
        console.log('Connection rejected: Max participants reached.');
        return;
    }

    activeParticipants.add(clientId);

    // Handle disconnection
    client.getSocket()?.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        activeParticipants.delete(clientId);
    });
});



app.get('/peers', (req, res) => {
    // This endpoint returns a list of active peer IDs
    const peers = Array.from(activeParticipants);
    res.json(peers);
});



// Start Server
httpServer.listen(9000, 'localhost', () => {
    console.log('Server is listening on port 9000');
});

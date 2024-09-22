"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const peer_1 = require("peer");
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// SSL Certificates
const privateKey = fs_1.default.readFileSync("cert.key", 'utf8');
const certificate = fs_1.default.readFileSync("cert.crt", 'utf8');
const credentials = { key: privateKey, cert: certificate };
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// JWT Authentication Middleware
app.use((req, res, next) => {
    var _a;
    if (req.path === '/login')
        return next(); // Skip authentication for login
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, 'your_secret_key', (err, decoded) => {
        if (err)
            return res.sendStatus(403);
        req.user = decoded;
        next();
    });
});
// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Simple user validation (replace with real authentication)
    if (username === 'user' && password === 'pass') {
        const token = jsonwebtoken_1.default.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ token });
    }
    else {
        res.sendStatus(401);
    }
});
// Create HTTP Server
const httpsServer = https_1.default.createServer(credentials, app);
// PeerJS Signaling Server with Extended Config
const peerServer = (0, peer_1.ExpressPeerServer)(httpsServer, {
    debug: true,
    path: '/myapp',
});
// Apply PeerJS Server Middleware
app.use('/peerjs', peerServer);
// Start Server
httpsServer.listen(9000, () => {
    console.log('Server is listening on port 9000');
});

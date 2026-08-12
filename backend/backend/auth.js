const session = require('express-session');
const { Issuer, generators } = require('openid-client');

let client;

// 1. Initialize Keycloak OIDC Client
async function initKeycloak() {
    try {
        const issuer = await Issuer.discover(process.env.KEYCLOAK_REALM_URL);
        client = new issuer.Client({
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            redirect_uris: [process.env.KEYCLOAK_REDIRECT_URI],
            response_types: ['code'],
        });
        console.log('Keycloak OIDC initialized successfully.');
    } catch (err) {
        console.error('Keycloak Discovery Failed:', err.message);
    }
}

// Automatically trigger discovery when file is loaded
initKeycloak();

// 2. Middleware to protect routes and verify sessions
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized access. Please log in.' });
}

// 3. Login Route Handler
function handleLogin(req, res) {
    if (!client) {
        return res.status(503).json({ error: 'Keycloak service unavailable' });
    }
    const nonce = generators.nonce();
    const state = generators.state();

    req.session.nonce = nonce;
    req.session.state = state;

    const authUrl = client.authorizationUrl({
        scope: 'openid email profile',
        state,
        nonce,
    });

    res.redirect(authUrl);
}

// 4. Callback Handler (Pulls email claims upon login)
async function handleCallback(req, res) {
    if (!client) return res.redirect('/');

    try {
        const params = client.callbackParams(req);
        const tokenSet = await client.callback(process.env.KEYCLOAK_REDIRECT_URI, params, {
            nonce: req.session.nonce,
            state: req.session.state,
        });

        // Pull user claims (specifically the email)
        const userinfo = await client.userinfo(tokenSet.access_token);
        
        // Attach logged-in user email to session
        req.session.user = {
            email: userinfo.email || userinfo.preferred_username,
            sub: userinfo.sub
        };

        res.redirect('/');
    } catch (err) {
        console.error('OIDC Callback Error:', err);
        res.status(500).send('Authentication failed');
    }
}

// 5. Logout Handler
function handleLogout(req, res) {
    req.session.destroy();
    res.redirect('/');
}

module.exports = {
    requireAuth,
    handleLogin,
    handleCallback,
    handleLogout
};

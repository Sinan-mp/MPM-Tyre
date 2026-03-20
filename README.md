# MPM-Tyre

Static frontend with a Node.js + MongoDB review backend.

## Local run

1. Add your MongoDB Atlas URI in `.env`
2. Start the backend:

```powershell
npm run dev
```

3. Open:

```text
http://localhost:4000
```

## GitHub Pages setup

GitHub Pages cannot run the Node backend by itself. To make reviews work on the hosted site:

1. Deploy `server/app.js` to a backend host like Render or Railway
2. Edit [config.js](/abs/path/c:/Users/sinan/Desktop/MPM TYRES/config.js)
3. Set `apiBaseUrl` to your deployed backend URL

Example:

```js
window.MPM_CONFIG = {
  apiBaseUrl: "https://your-backend-url.onrender.com"
};
```

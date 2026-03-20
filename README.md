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
2. Add the `MONGO_URI` environment variable on that backend host
3. Edit [config.js](/abs/path/c:/Users/sinan/Desktop/MPM TYRES/config.js)
4. Set `apiBaseUrl` to your deployed backend URL

Example:

```js
window.MPM_CONFIG = {
  apiBaseUrl: "https://your-backend-url.onrender.com"
};
```

## Render deploy

This repo now includes [render.yaml](/abs/path/c:/Users/sinan/Desktop/MPM TYRES/render.yaml) for a simple backend deploy.

After Render gives you your backend URL:

1. Open [config.js](/abs/path/c:/Users/sinan/Desktop/MPM TYRES/config.js)
2. Replace the empty `apiBaseUrl` value
3. Push the updated `config.js` to GitHub Pages

Example:

```js
window.MPM_CONFIG = {
  apiBaseUrl: "https://mpm-tyres-api.onrender.com"
};
```

Then all customers will load and submit the same shared reviews from MongoDB Atlas.

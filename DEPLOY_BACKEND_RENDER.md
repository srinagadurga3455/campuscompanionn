# How to Deploy Your Backend (API) to Render

Yes, you are correct! Your backend is currently running on `localhost:5000`, which is only accessible from your own computer. Your Vercel website (running on the internet) cannot talk to your local computer. You must deploy your backend to the cloud.

We recommend **Render** because it is free and easy to use.

## Step 1: Sign Up for Render
1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Sign up or Log in with your git provider (GitHub/GitLab).

## Step 2: Create a New Web Service
1. Click **New +** and select **Web Service**.
2. Select **Build and deploy from a Git repository**.
3. Connect your GitHub account if you haven't already.
4. Search for your repository `campuscompanionn` and click **Connect**.

## Step 3: Configure the Service
Fill in the following details:

*   **Name:** `campus-companion-api` (or similar)
*   **Region:** Select the one closest to you (e.g., Singapore or Frankfurt).
*   **Branch:** `main`
*   **Root Directory:** `server` (Important!)
*   **Runtime:** `Node`
*   **Build Command:** `npm install`
*   **Start Command:** `node server.js`
*   **Instance Type:** Free

## Step 4: Add Environment Variables
Scroll down to the **Environment Variables** section. You need to add these values (copy them from your `server/.env` file):

| Key | Value |
| --- | --- |
| `MONGODB_URI` | `mongodb+srv://campus_companion:campus123@cluster0.efvftrz.mongodb.net/campus_companion?retryWrites=true&w=majority` |
| `JWT_SECRET` | `7d8f9a2b5e1c4f6h8j3k9m2n5p7q1r4s6t8v0w2x5y7z9a3b6c8d1e4f7g9h2j5k` |
| `NODE_ENV` | `production` |
| `EMAIL_USER` | `kandasagar2006@gmail.com` |
| `EMAIL_PASSWORD` | `uarc uuex nipp eazu` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `PRIVATE_KEY` | `44096c2c7effcde29c082de5c8b57c0d2227384a71e796352a3a7156e655178f` |
| `BLOCKCHAIN_RPC_URL` | `https://rpc-amoy.polygon.technology` |
| `FRONTEND_URL` | `https://campuscompanionn.vercel.app` |

## Step 5: Deploy
1. Click **Create Web Service**.
2. Wait for the deployment to finish. You will see "Live" in green.
3. **Copy your new Backend URL**. It will look like `https://campus-companion-api.onrender.com`.

## Step 6: Connect Frontend to Backend
1. Go back to your **Vercel Dashboard**.
2. Go to your project > **Settings** > **Environment Variables**.
3. Add a new variable:
    *   **Key:** `REACT_APP_API_URL`
    *   **Value:** `https://your-new-render-url.onrender.com/api` (Don't forget the `/api` at the end!)
4. **Redeploy** your Vercel project for the changes to take effect.

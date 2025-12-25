# Vercel Deployment Guide

If you are seeing a **404: NOT_FOUND** error on Vercel, it is likely because Vercel is trying to deploy the root directory instead of the `client` directory.

## How to Fix

1. Go to your **Vercel Dashboard**.
2. Select your `campuscompanionn` project.
3. Go to **Settings** > **General**.
4. Find the **Root Directory** section.
5. Click **Edit** and set the Root Directory to: `client`
6. Click **Save**.
7. Go to the **Deployments** tab and **Redeploy** the latest commit.

## Why this happens
This project uses a monorepo structure (client and server in one repo). Vercel needs to know that your React frontend lives inside the `client` folder, not at the top level. The `vercel.json` file we added is located inside `client/`, so it will only work if Vercel is looking there.

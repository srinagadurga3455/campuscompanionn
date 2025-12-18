# Deployment Guide

## Prerequisites

- Node.js v16+
- MongoDB Atlas account (or local MongoDB)
- MetaMask wallet with MATIC on Polygon Mumbai testnet
- WhatsApp Business API credentials
- Domain name (optional, for production)

## 1. MongoDB Setup

### Using MongoDB Atlas (Recommended)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/campus_companion
   ```

## 2. WhatsApp Business API Setup

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app
3. Add WhatsApp product
4. Get test number or add your business number
5. Get credentials:
   - Phone Number ID
   - Access Token
6. Add to server `.env`

## 3. Blockchain Deployment

### Get Mumbai Testnet MATIC

1. Visit [faucet.polygon.technology](https://faucet.polygon.technology)
2. Connect MetaMask
3. Request test MATIC

### Deploy Contracts

```bash
cd blockchain

# Create .env file
cp .env.example .env

# Add your private key
# PRIVATE_KEY=your_metamask_private_key

# Compile contracts
npx hardhat compile

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Note the contract addresses from output
```

## 4. Backend Deployment

### Environment Variables

Create `server/.env`:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=generate_strong_random_secret
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key
STUDENT_ID_CONTRACT_ADDRESS=from_deployment
CERTIFICATE_CONTRACT_ADDRESS=from_deployment
BADGE_CONTRACT_ADDRESS=from_deployment
FRONTEND_URL=https://your-frontend-url.com
```

### Heroku Deployment

```bash
cd server

# Install Heroku CLI
# heroku login

heroku create campus-companion-api

# Set environment variables
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret
# ... set all other variables

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

heroku logs --tail
```

### Alternative: Railway/Render

1. Create account on [railway.app](https://railway.app) or [render.com](https://render.com)
2. Connect GitHub repository
3. Add environment variables
4. Deploy

## 5. Frontend Deployment

### Environment Variables

Create `client/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Vercel Deployment (Recommended)

```bash
cd client

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
```

### Alternative: Netlify

```bash
cd client

# Build
npm run build

# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

## 6. Post-Deployment Configuration

### Update CORS

In `server/server.js`, update CORS origin:
```javascript
cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
})
```

### Test Deployment

1. Register a test user
2. Approve as admin
3. Check WhatsApp notification
4. Verify blockchain ID minting
5. Create event and issue certificate

## 7. Production Checklist

- [ ] Change all default secrets
- [ ] Enable MongoDB authentication
- [ ] Set up MongoDB backups
- [ ] Configure firewall rules
- [ ] Enable HTTPS
- [ ] Set up monitoring (e.g., PM2, New Relic)
- [ ] Configure logging
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Test all user flows
- [ ] Load testing
- [ ] Security audit
- [ ] Documentation updated

## 8. Monitoring

### Backend Monitoring

Using PM2:
```bash
npm install -g pm2
pm2 start server.js --name campus-api
pm2 save
pm2 startup
```

### Logging

Consider using:
- Winston for structured logging
- Loggly or Papertrail for log aggregation
- Sentry for error tracking

## 9. Backup Strategy

### Database Backups

```bash
# MongoDB backup
mongodump --uri="your_mongodb_uri" --out=./backup

# Restore
mongorestore --uri="your_mongodb_uri" ./backup
```

### Smart Contract Safety

- Keep deployment keys secure
- Don't modify contract state carelessly
- Test on testnet first
- Consider using multi-sig wallet for admin

## 10. Scaling Considerations

### Backend Scaling

- Use load balancer (e.g., Nginx)
- Horizontal scaling with PM2 cluster mode
- Database indexing
- Caching with Redis

### Blockchain Optimization

- Batch transactions where possible
- Monitor gas prices
- Consider L2 solutions for mainnet

## Troubleshooting

### Common Issues

**MongoDB connection fails:**
- Check connection string
- Verify IP whitelist
- Check network connectivity

**Blockchain transactions fail:**
- Ensure sufficient MATIC
- Check RPC endpoint
- Verify contract addresses

**WhatsApp not sending:**
- Verify API credentials
- Check phone number format
- Review API limits

## Support

For issues, check:
- Application logs
- MongoDB logs
- Blockchain explorer (Mumbai: mumbai.polygonscan.com)
- WhatsApp API status page

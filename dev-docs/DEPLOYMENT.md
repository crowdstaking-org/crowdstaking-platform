# Deployment Guide

## Automated Deployment with GitHub Actions

This project uses GitHub Actions for automatic deployment to DigitalOcean App Platform.

### How it works

Every push to the `main` branch automatically triggers a deployment:

1. You commit and push code to `main`
2. GitHub Actions workflow starts automatically
3. Code is deployed to DigitalOcean App Platform
4. App is live at: https://crowdstaking-platform-uuex4.ondigitalocean.app

### Setup GitHub Secrets (One-time setup)

To enable automatic deployment, add these secrets to your GitHub repository:

1. Go to: https://github.com/crowdstaking-org/crowdstaking-platform/settings/secrets/actions
2. Click **"New repository secret"**
3. Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `DO_APP_ID` | `613df1af-5622-43a6-b599-39dca3c745e6` | DigitalOcean App ID (found in App URL) |
| `DO_API_TOKEN` | `dop_v1_***...***` | DigitalOcean API Token (from your DigitalOcean account) |

**How to get your DigitalOcean API Token:**
1. Go to: https://cloud.digitalocean.com/account/api/tokens
2. Click **"Generate New Token"**
3. Name: `GitHub Actions - CrowdStaking`
4. Scopes: Select **"Read & Write"**
5. Copy the token (you'll only see it once!)
6. Add it to GitHub Secrets as `DO_API_TOKEN`

### Manual Deployment

You can also trigger deployment manually:

**Via GitHub:**
1. Go to: https://github.com/crowdstaking-org/crowdstaking-platform/actions/workflows/deploy.yml
2. Click **"Run workflow"**
3. Select branch `main`
4. Click **"Run workflow"**

**Via DigitalOcean CLI:**
```bash
doctl apps create-deployment 613df1af-5622-43a6-b599-39dca3c745e6
```

**Via DigitalOcean Dashboard:**
1. Go to: https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6
2. Click **"Create Deployment"**

### Deployment Workflow

```
Local Changes → Git Commit → Git Push → GitHub Actions → DigitalOcean → Live
```

### Monitoring Deployments

- **GitHub Actions Logs:** https://github.com/crowdstaking-org/crowdstaking-platform/actions
- **DigitalOcean Dashboard:** https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6

### Production URLs

- **Temporary URL:** https://crowdstaking-platform-uuex4.ondigitalocean.app
- **Custom Domain:** https://crowdstaking.org (after DNS configuration)

### Rollback

If a deployment fails or has issues:

1. Go to: https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6/deployments
2. Select a previous working deployment
3. Click **"Rollback to this deployment"**

### Environment Variables

Production environment variables are configured in DigitalOcean App Platform:
- `NODE_ENV=production`

To add more variables:
1. Go to: https://cloud.digitalocean.com/apps/613df1af-5622-43a6-b599-39dca3c745e6/settings
2. Navigate to "Environment Variables"
3. Add your variables
4. Redeploy the app

### Cost & Resources

- **Instance Size:** Basic (512MB RAM, 1 vCPU)
- **Monthly Cost:** ~$5
- **Build Time:** ~2-3 minutes
- **Region:** Frankfurt (fra1)

### Troubleshooting

**Deployment stuck or failing:**
- Check GitHub Actions logs for errors
- Verify secrets are correctly configured
- Check DigitalOcean build logs

**App not responding:**
- Check health status in DigitalOcean dashboard
- Review runtime logs in DigitalOcean
- Verify all dependencies are in package.json

**DNS not working:**
- Ensure DNS records are correctly configured
- Wait 5-30 minutes for DNS propagation
- Verify SSL certificate status in DigitalOcean


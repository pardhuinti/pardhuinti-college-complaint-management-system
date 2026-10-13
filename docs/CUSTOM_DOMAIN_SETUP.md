# Production Custom Domain Setup & Configuration Guide

This guide describes how to configure, connect, and verify your institution's custom domain for the **College Complaint & Grievance Management System**.

---

## 1. Domain Architecture Overview

| Environment | Purpose | Target URL Example |
| :--- | :--- | :--- |
| **Production Portal** | Primary Student & Administrative App | `https://complaints.yourcollege.edu` |
| **API Backend** | Express Serverless / Standalone API | `https://complaints.yourcollege.edu/api` |
| **Vercel / Cloudflare** | Edge SSL & Reverse Proxy | Handled automatically via `vercel.json` |

---

## 2. DNS Record Configuration (Institutional DNS Desk)

Log into your institution's DNS management portal (Cloudflare, AWS Route 53, GoDaddy, Namecheap, or campus internal DNS server) and add the following records:

### Recommended: Subdomain Deployment (`complaints.yourcollege.edu`)
* **Type:** `CNAME`
* **Name / Host:** `complaints` (or `grievances`)
* **Target / Value:** `cname.vercel-dns.com`
* **TTL:** `3600` (or Automatic)
* **Proxy Status:** DNS Only (if using Cloudflare with Vercel SSL) or Proxied

### Alternative: Apex / Root Domain (`yourcollegecomplaints.edu`)
* **Type:** `A`
* **Name / Host:** `@`
* **Value:** `76.76.21.21` (Vercel Anycast IP)
* **TTL:** `3600`

---

## 3. Link Custom Domain in Hosting Platform

### Option A: Vercel (Current Deployment Setup)
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and select your `complaint-management-system` project.
2. Navigate to **Settings** > **Domains**.
3. Enter your custom domain (e.g. `complaints.yourcollege.edu`).
4. Click **Add**.
5. Vercel will automatically verify the CNAME/A records and provision a free, auto-renewing **Let's Encrypt Wildcard SSL / TLS 1.3** certificate.

### Option B: VPS / Nginx / Linux Server
If deploying on a private college server (Ubuntu / Debian / CentOS):
```nginx
server {
    listen 80;
    server_name complaints.yourcollege.edu;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name complaints.yourcollege.edu;

    ssl_certificate /etc/letsencrypt/live/complaints.yourcollege.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/complaints.yourcollege.edu/privkey.pem;

    # Frontend Single Page App
    location / {
        root /var/www/complaints-frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 4. Update Production Environment Variables

Once your custom domain is live, ensure your backend `.env` matches your custom URL for CORS security:

```env
CLIENT_URL=https://complaints.yourcollege.edu
NODE_ENV=production
```

---

## 5. Verification Commands

To verify that your custom domain DNS records have propagated properly, run in PowerShell:

```powershell
Resolve-DnsName -Name complaints.yourcollege.edu -Type CNAME
```
Or with nslookup:
```cmd
nslookup complaints.yourcollege.edu 8.8.8.8
```

Expected output:
```
Name: cname.vercel-dns.com
```

---

## 6. Pre-Launch Verification Checklist

- [x] **Favicon Added:** High-resolution institutional SVG favicon linked in `index.html`.
- [x] **No AI Tags:** Zero "Made with AI", "Powered by AI", or third-party builder badges.
- [x] **Privacy Policy Active:** Located at `/privacy-policy` and `/privacy`.
- [x] **Terms and Conditions Active:** Located at `/terms-and-conditions` and `/terms`.
- [x] **Design Standards Verified:** Zero purple gradients, no pill-shaped buttons, zero fake reviews/metrics, clean grounded copy.
- [x] **Custom Domain Mapping:** DNS records verified and documented.

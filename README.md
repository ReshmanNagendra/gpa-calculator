# Premium CGPA Calculator

A stunning, fast, and completely client-side CGPA & SGPA Calculator tailored for Indian universities (10-point scale).

## Features
- **Modern Glassmorphism UI**: Beautiful, engaging design that looks great on mobile and desktop.
- **Client-Side Only**: All math happens locally. No data is sent to a backend, ensuring complete privacy.
- **Target SGPA Predictor**: Students can plan their future by calculating what they need to score next semester.
- **Image Sharing**: Built-in "Share my Result" feature allows students to generate an image of their CGPA and share it with friends natively or via download.
- **SEO Ready**: Semantic HTML, JSON-LD Schema, and Open Graph tags included.

## Deployment Instructions

Since this is a static website (Vanilla HTML, CSS, and JavaScript), it can be deployed anywhere in seconds.

### Deploying to Vercel (Recommended)
1. Push this repository to GitHub.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Set the **Build Command** to: `node build.js`
5. Set the **Output Directory** to: `dist`
6. Click **Deploy**.
7. Once deployed, go to the project's **Settings > Domains**, type in `gpa.kalvian.tech`, and follow Vercel's instructions to add the CNAME record to your DNS provider.

### Deploying to Netlify
1. Log in to [Netlify](https://netlify.com/) and click **Add new site** > **Import an existing project**.
2. Connect your GitHub and select this repository.
3. Set the **Build command** to: `node build.js`
4. Set the **Publish directory** to: `dist`
5. Click **Deploy site**.
6. Go to **Domain Management** to add your custom subdomain.

## Important Note on Open Graph (OG) Image
To ensure your website preview looks great when shared on social media, you need to add an image named `og-image.png` to the root directory before deploying.

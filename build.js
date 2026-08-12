const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const srcDir = path.join(__dirname, 'src');
const templatesDir = path.join(__dirname, 'templates');
const distDir = path.join(__dirname, 'dist');

// Ensure output directories exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// 1. Read data and templates
const universitiesPath = path.join(dataDir, 'universities.json');
const templatePath = path.join(templatesDir, 'calculator.html');

const universitiesData = JSON.parse(fs.readFileSync(universitiesPath, 'utf8'));
const templateHtml = fs.readFileSync(templatePath, 'utf8');

// 2. Generate pages
universitiesData.forEach(config => {
    console.log(`Building page for: ${config.fullName} (${config.slug})...`);
    
    // Generate the Grade Legend HTML
    const gradeLegendHtml = config.gradeScale.map(g => `<span>${g.grade} = ${g.points}</span>`).join('\n                    ');

    // Replace placeholders
    let outputHtml = templateHtml
        .replace(/\{\{METATITLE\}\}/g, config.metaTitle)
        .replace(/\{\{METADESCRIPTION\}\}/g, config.metaDescription)
        .replace(/\{\{METAKEYWORDS\}\}/g, config.metaKeywords)
        .replace(/\{\{SLUG\}\}/g, config.isRoot ? '' : config.slug)
        .replace(/\{\{NAME\}\}/g, config.name)
        .replace(/\{\{FULLNAME\}\}/g, config.fullName)
        .replace(/\{\{GRADE_LEGEND\}\}/g, gradeLegendHtml)
        .replace(/\{\{CONFIG_JSON\}\}/g, JSON.stringify(config));

    let outDir, outHtmlPath;
    
    // If it's the root site, put it in dist/ and fix relative asset paths
    if (config.isRoot) {
        outDir = distDir;
        outHtmlPath = path.join(distDir, 'index.html');
        outputHtml = outputHtml.replace(/\.\.\//g, '');
    } else {
        outDir = path.join(distDir, config.slug);
        outHtmlPath = path.join(outDir, 'index.html');
    }

    // Ensure the output folder exists
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // Write the index.html
    fs.writeFileSync(outHtmlPath, outputHtml, 'utf8');
});

// 3. Copy static assets to the dist directory
fs.copyFileSync(path.join(srcDir, 'style.css'), path.join(distDir, 'style.css'));
fs.copyFileSync(path.join(srcDir, 'calculator.js'), path.join(distDir, 'calculator.js'));
fs.copyFileSync(path.join(srcDir, 'privacy-policy.html'), path.join(distDir, 'privacy-policy.html'));
fs.copyFileSync(path.join(srcDir, 'terms.html'), path.join(distDir, 'terms.html'));

// 4. Generate sitemap.xml and robots.txt
const baseUrl = 'https://gpa.kalvian.tech';
const sitemapUrls = universitiesData.map(config => {
    const slugPath = config.isRoot ? '' : config.slug;
    return `  <url><loc>${baseUrl}/${slugPath}</loc></url>`;
}).join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;

fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');

console.log('Build completed successfully! Assets and Sitemap generated in /dist.');

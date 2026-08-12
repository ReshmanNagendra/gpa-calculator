const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const srcDir = path.join(__dirname, 'src');
const templatesDir = path.join(__dirname, 'templates');
const distDir = path.join(__dirname, 'dist');
const outputBaseDir = path.join(distDir, 'gpa-calculator');

// Ensure output directories exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}
if (!fs.existsSync(outputBaseDir)) {
    fs.mkdirSync(outputBaseDir, { recursive: true });
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
        .replace(/\{\{SLUG\}\}/g, config.slug)
        .replace(/\{\{NAME\}\}/g, config.name)
        .replace(/\{\{FULLNAME\}\}/g, config.fullName)
        .replace(/\{\{GRADE_LEGEND\}\}/g, gradeLegendHtml)
        .replace(/\{\{CONFIG_JSON\}\}/g, JSON.stringify(config));

    // Ensure the output folder exists
    const outDir = path.join(outputBaseDir, config.slug);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // Write the index.html
    const outHtmlPath = path.join(outDir, 'index.html');
    fs.writeFileSync(outHtmlPath, outputHtml, 'utf8');
});

// 3. Copy static assets to the dist directory
fs.copyFileSync(path.join(srcDir, 'style.css'), path.join(distDir, 'style.css'));
fs.copyFileSync(path.join(srcDir, 'calculator.js'), path.join(distDir, 'calculator.js'));
fs.copyFileSync(path.join(srcDir, 'privacy-policy.html'), path.join(distDir, 'privacy-policy.html'));
fs.copyFileSync(path.join(srcDir, 'terms.html'), path.join(distDir, 'terms.html'));

console.log('Build completed successfully! Assets copied to /dist.');

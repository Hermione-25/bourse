const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images');

const images = [
    { name: 'india.jpg', url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80' },
    { name: 'malaysia.jpg', url: 'https://images.unsplash.com/photo-1508062878650-88b52897f298?auto=format&fit=crop&w=600&q=80' },
    { name: 'uae.jpg', url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80' },
    { name: 'mexico.jpg', url: 'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?auto=format&fit=crop&w=600&q=80' },
    { name: 'argentina.jpg', url: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?auto=format&fit=crop&w=600&q=80' },
];

let completed = 0;
images.forEach(img => {
    const file = fs.createWriteStream(path.join(dir, img.name));
    https.get(img.url, function(response) {
        response.pipe(file);
        file.on('finish', () => {
            completed++;
            console.log(`✓ ${img.name} (${completed}/${images.length})`);
            if (completed === images.length) {
                console.log('\n✅ Toutes les images ont été téléchargées !');
            }
        });
    }).on('error', (err) => {
        console.error(`✗ Erreur pour ${img.name}: ${err.message}`);
    });
});
console.log(`Retry: téléchargement de ${images.length} images...`);

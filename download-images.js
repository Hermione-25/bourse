const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const images = [
    // EUROPE (déjà : france.jpg, germany.jpg, uk.jpg)
    { name: 'italy.jpg', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
    { name: 'spain.jpg', url: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=600&q=80' },
    { name: 'belgium.jpg', url: 'https://images.unsplash.com/photo-1559113202-c916b8e44373?auto=format&fit=crop&w=600&q=80' },
    { name: 'netherlands.jpg', url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=600&q=80' },
    { name: 'switzerland.jpg', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80' },
    { name: 'sweden.jpg', url: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=600&q=80' },
    { name: 'norway.jpg', url: 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?auto=format&fit=crop&w=600&q=80' },
    { name: 'hungary.jpg', url: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=600&q=80' },
    { name: 'poland.jpg', url: 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=600&q=80' },
    { name: 'turkey.jpg', url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80' },
    { name: 'russia.jpg', url: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=600&q=80' },

    // ASIE & MOYEN-ORIENT
    { name: 'china.jpg', url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&q=80' },
    { name: 'japan.jpg', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
    { name: 'south-korea.jpg', url: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=600&q=80' },
    { name: 'india.jpg', url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80' },
    { name: 'malaysia.jpg', url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80' },
    { name: 'uae.jpg', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
    { name: 'morocco.jpg', url: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=600&q=80' },
    { name: 'tunisia.jpg', url: 'https://images.unsplash.com/photo-1518544866330-4e716499f800?auto=format&fit=crop&w=600&q=80' },
    { name: 'saudi-arabia.jpg', url: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=600&q=80' },
    { name: 'israel.jpg', url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=600&q=80' },

    // AMÉRIQUE (déjà : usa.jpg, canada.jpg)
    { name: 'brazil.jpg', url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80' },
    { name: 'mexico.jpg', url: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=600&q=80' },
    { name: 'argentina.jpg', url: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=600&q=80' },
    { name: 'chile.jpg', url: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=600&q=80' },
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
console.log(`Téléchargement de ${images.length} images en cours...`);

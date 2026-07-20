require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}


async function rechercherImage(pays) {
    try {
        const response = await axios.get(
            'https://api.unsplash.com/search/photos',
            {
                params: {
                    query: `${pays} country landscape`,
                    per_page: 5
                },
                headers: {
                    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                }
            }
        );

        return response.data.results[0]?.urls?.regular;

    } catch (error) {
        console.log(`Erreur recherche ${pays}:`, error.message);
        return null;
    }
}


function telechargerImage(url, nom) {

    return new Promise((resolve, reject) => {

        if (!url) {
            console.log(`❌ Pas d'image pour ${nom}`);
            resolve();
            return;
        }

        const file = fs.createWriteStream(
            path.join(dir, nom)
        );

        https.get(url, response => {

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`✅ ${nom}`);
                resolve();
            });

        }).on('error', error => {
            reject(error);
        });

    });

}


async function test() {

const pays = [
  // ===== AFRIQUE =====
  { name: 'algerie.jpg', search: 'Alger Algeria city landscape' },
  { name: 'angola.jpg', search: 'Luanda Angola city coast' },
  { name: 'benin.jpg', search: 'Cotonou Benin city landscape' },
  { name: 'botswana.jpg', search: 'Botswana safari landscape' },

];


    for (const paysItem of pays) {

        const url = await rechercherImage(paysItem.search);

        await telechargerImage(
            url,
            paysItem.name
        );

    }

    console.log("🎉 Toutes les images sont téléchargées");

}


test();
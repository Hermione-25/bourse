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
  // Afrique
  { name: 'afrique-du-sud.jpg', search: 'South Africa Cape Town university' },
  { name: 'algerie.jpg', search: 'Algeria university city' },
  { name: 'egypte.jpg', search: 'Egypt Cairo university' },
  { name: 'maroc.jpg', search: 'Morocco university city' },
  { name: 'tunisie.jpg', search: 'Tunisia university city' },
  { name: 'rwanda.jpg', search: 'Rwanda Kigali city' },
  { name: 'senegal.jpg', search: 'Senegal Dakar university' },

  // Europe
  { name: 'allemagne.jpg', search: 'Germany Berlin university' },
  { name: 'autriche.jpg', search: 'Austria Vienna university' },
  { name: 'belgique.jpg', search: 'Belgium Brussels university' },
  { name: 'espagne.jpg', search: 'Spain Barcelona university' },
  { name: 'france.jpg', search: 'France Paris university' },
  { name: 'italie.jpg', search: 'Italy Rome university' },
  { name: 'norvege.jpg', search: 'Norway Oslo university' },
  { name: 'pays-bas.jpg', search: 'Netherlands Amsterdam university' },
  { name: 'suede.jpg', search: 'Sweden Stockholm university' },
  { name: 'suisse.jpg', search: 'Switzerland Zurich university' },
  { name: 'royaume-uni.jpg', search: 'United Kingdom London university' },
  { name: 'danemark.jpg', search: 'Denmark Copenhagen university' },
  { name: 'republique-tcheque.jpg', search: 'Czech Republic Prague university' },
  { name: 'suede.jpg', search: 'Sweden Stockholm university' },
  { name: 'qatar.jpg', search: 'Qatar Doha university' },

  // Amérique du Nord
  { name: 'canada.jpg', search: 'Canada Toronto university' },
  { name: 'etats-unis.jpg', search: 'United States university campus' },

  // Asie
  { name: 'chine.jpg', search: 'China Beijing university' },
  { name: 'coree-du-sud.jpg', search: 'South Korea Seoul university' },
  { name: 'japon.jpg', search: 'Japan Tokyo university' },
  { name: 'inde.jpg', search: 'India university campus' },
  { name: 'turquie.jpg', search: 'Turkey Istanbul university' },
  { name: 'singapour.jpg', search: 'Singapore university campus' },

  // Océanie
  { name: 'australie.jpg', search: 'Australia Sydney university' },
  { name: 'nouvelle-zelande.jpg', search: 'New Zealand university campus' }
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
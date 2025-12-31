import satori from 'satori';
import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');
const ogDir = join(publicDir, 'og');

// Ensure og directory exists
if (!existsSync(ogDir)) {
  mkdirSync(ogDir, { recursive: true });
}

// Fetch fonts from Google Fonts
async function fetchFont(family, weight) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  const cssResponse = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const css = await cssResponse.text();
  const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error(`Could not find font URL for ${family}`);
  const fontResponse = await fetch(fontUrl);
  return Buffer.from(await fontResponse.arrayBuffer());
}

let merriweatherFont, opensansFont;

// Page configurations for OG images
const pages = [
  {
    filename: 'default.png',
    title: 'HealthyCatLitter.com',
    subtitle: 'Your Guide to Safer Cat Litter Choices',
    category: null
  },
  {
    filename: 'home.png',
    title: 'HealthyCatLitter.com',
    subtitle: 'Your Guide to Safer Cat Litter Choices',
    category: null
  },
  {
    filename: 'ingredients.png',
    title: 'Ingredient Database',
    subtitle: 'Safety profiles for common cat litter ingredients',
    category: 'Guide'
  },
  {
    filename: 'conditions.png',
    title: 'Health Conditions',
    subtitle: 'Cat litter guidance for health concerns',
    category: 'Guide'
  },
  {
    filename: 'safety-guide.png',
    title: 'Cat Litter Safety Guide',
    subtitle: 'Everything you need to know about safe litter choices',
    category: 'Guide'
  },
  {
    filename: 'our-picks.png',
    title: 'Our Top Picks',
    subtitle: 'Recommended cat litters for every situation',
    category: 'Recommendations'
  },
  // Ingredients
  {
    filename: 'ingredients-activated-carbon.png',
    title: 'Activated Carbon',
    subtitle: 'Safe, natural odor control for cat litter',
    category: 'Ingredient'
  },
  {
    filename: 'ingredients-bentonite-clay.png',
    title: 'Bentonite Clay',
    subtitle: 'Common clumping agent safety profile',
    category: 'Ingredient'
  },
  {
    filename: 'ingredients-silica-gel.png',
    title: 'Silica Gel',
    subtitle: 'Crystal litter safety and considerations',
    category: 'Ingredient'
  },
  {
    filename: 'ingredients-artificial-fragrances.png',
    title: 'Artificial Fragrances',
    subtitle: 'Why scented litters may harm your cat',
    category: 'Ingredient'
  },
  {
    filename: 'ingredients-sodium-benzoate.png',
    title: 'Sodium Benzoate',
    subtitle: 'Preservative concerns in cat litter',
    category: 'Ingredient'
  },
  // Conditions
  {
    filename: 'conditions-respiratory.png',
    title: 'Respiratory Issues',
    subtitle: 'Cat litter choices for breathing concerns',
    category: 'Health'
  },
  {
    filename: 'conditions-allergies.png',
    title: 'Allergies',
    subtitle: 'Hypoallergenic litter options for sensitive cats',
    category: 'Health'
  },
  {
    filename: 'conditions-urinary.png',
    title: 'Urinary Health',
    subtitle: 'Litter considerations for urinary issues',
    category: 'Health'
  },
  {
    filename: 'conditions-digestive.png',
    title: 'Digestive Concerns',
    subtitle: 'Safe litter choices for digestive issues',
    category: 'Health'
  },
  {
    filename: 'conditions-senior.png',
    title: 'Senior Cats',
    subtitle: 'Comfortable litter options for older cats',
    category: 'Health'
  },
  {
    filename: 'conditions-kitten.png',
    title: 'Kitten Safety',
    subtitle: 'Safe litter choices for young cats',
    category: 'Health'
  }
];

// OG Image component
function createOGImage({ title, subtitle, category }) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 80px',
        background: 'linear-gradient(135deg, #e8f4f8 0%, #ffffff 100%)',
        fontFamily: 'Open Sans',
      },
      children: [
        category && {
          type: 'div',
          props: {
            style: {
              fontSize: '24px',
              fontWeight: '600',
              color: '#1a5f7a',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '20px',
            },
            children: category,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: title.length > 25 ? '56px' : '72px',
              fontWeight: '700',
              fontFamily: 'Merriweather',
              color: '#1a5f7a',
              lineHeight: 1.2,
              marginBottom: '24px',
            },
            children: title,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: '32px',
              color: '#4a5568',
              lineHeight: 1.4,
            },
            children: subtitle,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '40px',
              left: '80px',
              fontSize: '20px',
              color: '#718096',
            },
            children: 'healthycatlitter.com',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '8px',
              background: '#1a5f7a',
            },
          },
        },
      ].filter(Boolean),
    },
  };
}

async function generateImages() {
  console.log('Fetching fonts...');
  merriweatherFont = await fetchFont('Merriweather', 700);
  opensansFont = await fetchFont('Open Sans', 400);
  console.log('Fonts loaded.\n');

  console.log('Generating OG images...\n');

  for (const page of pages) {
    const svg = await satori(createOGImage(page), {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Merriweather',
          data: merriweatherFont,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Open Sans',
          data: opensansFont,
          weight: 400,
          style: 'normal',
        },
      ],
    });

    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    const outputPath = join(ogDir, page.filename);
    writeFileSync(outputPath, png);
    console.log(`Created: ${page.filename}`);
  }

  // Also create default.jpg alias
  const { readFileSync } = await import('fs');
  const defaultPng = readFileSync(join(ogDir, 'default.png'));
  writeFileSync(join(publicDir, 'og-default.jpg'), defaultPng);
  console.log('\nCreated: og-default.jpg (copy of default.png)');

  console.log('\nDone! OG images generated successfully.');
}

generateImages().catch(console.error);

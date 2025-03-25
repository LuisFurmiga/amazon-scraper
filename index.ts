// Backend - Bun (Express-style server)

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = new Elysia();

app.use(cors());

const USED_SITE = 'amazon';
//const USED_SITE = 'mercadolibre';

// Helper function to simulate a delay between requests, helping to reduce the risk of blocking by the Amazon server
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/api/scrape', async ({ query }) => {
  const { keyword } = query;

  if (!keyword) return { error: 'Keyword query parameter is required.' };

  try {
    let url = '';
    if (USED_SITE === 'amazon') {
        // Amazon.com search URL, formatted with the given keyword
        url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    } else if (USED_SITE === 'mercadolibre') {
        // MercadoLibre search URL, formatted with the given keyword
        url = `https://lista.mercadolivre.com.br/${encodeURIComponent(keyword)}`;
    }
    
    // HTTP request simulating a real browser using custom headers, which helps avoid blocking by Amazon.com
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        }
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const products: {
        title: string;
        link?: string;
        rating?: string;
        reviews?: string;
        image?: string;
    }[] = [];
    
    let removed_items = 0;

    if (USED_SITE === 'amazon') { // AMAZON
        const items = document.querySelectorAll('[data-component-type="s-search-result"]');
        console.log("Total products found:", items.length);

        for (const item of items) {
            const title = item.querySelector('h2.a-size-medium.a-spacing-none.a-color-base.a-text-normal')?.getAttribute('aria-label')?.trim();

            const rawLink = item.querySelector('a.a-link-normal.s-line-clamp-2.s-link-style.a-text-normal')?.getAttribute('href');
            let link = '';
            // This check helps ignore sponsored products and only capture real product links
            if (rawLink && rawLink.includes('/dp/')) {
                link = `https://www.amazon.com${rawLink}`;
            } else {
                removed_items++;
                continue; // Skip if it is a sponsored link
            }

            const image = item.querySelector('img')?.getAttribute('src');
    
            const rating = item.querySelector('.a-icon-alt')?.textContent?.trim() || 'No Rating';
            const reviews = '('+item.querySelector('span.s-underline-text')?.textContent?.trim()+')' || '';
    
            if (title && image) {
                products.push({ title, link, image, rating, reviews });
                await sleep(Math.floor(Math.random() * 3000) + 2000); // Delay between 2 and 5 seconds
            }
        }

    } else if (USED_SITE === 'mercadolivre') {  // MERCADO LIVRE
        const items = document.querySelectorAll('.ui-search-layout__item');

        items.forEach(item => {
            const title = item.querySelector('.poly-component__title')?.textContent?.trim();
            const image = item.querySelector('img')?.getAttribute('data-src') || item.querySelector('img')?.src;
            const rating = item.querySelector('.poly-reviews__rating')?.textContent?.trim() || 'No Rating';
            const reviews = item.querySelector('.poly-reviews__total')?.textContent?.trim() || 'No Reviews';
        
            if (title) {
                products.push({ title, rating, reviews, image });
            }
        });
    }

    console.log("Total products removed:", removed_items);
    return products;
  } catch (error: any) {
    console.error("Error fetching HTML from Amazon:", error.message);
    return { error: 'Failed to fetch data from Amazon.' };
  }
  
});

app.listen({ port: 3000, idleTimeout: 255 });

console.log('Server running at http://localhost:3000');
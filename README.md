# Amazon Scraper

A fullstack application built with Bun, Elysia, Axios, JSDOM, and Vite (frontend in TypeScript) to perform product scraping from Amazon.com.

## Technologies Used

- **Frontend**: HTML, CSS, TypeScript (Vite)
- **Backend**: Bun + Elysia + Axios + JSDOM
- **Other Tools**: DOM Parsing, Web Scraping, CORS, Delay and User-Agent Spoofing

## 📁 Project Structure

```sh
amazon-scraper/
├── index.ts                  # Backend with Elysia (Bun)
├── amazon-scraper-frontend/
│   ├── index.html            # Main HTML file
│   └── src/
│       ├── main.ts           # Frontend logic (TypeScript)
│       ├── index.css         # General styling
│       ├── loader.css        # Loader (Hamster animation)
│       └── vite-env.d.ts     # Default Vite config
```

## Setup Instructions

### 1. Prerequisites

- **Bun https://bun.sh/**

- **Node.js (if you want to use Vite directly with Node)**

- **Git**

### 2. Clone the Repository

```sh
git clone https://github.com/LuisFurmiga/amazon-scraper.git
cd amazon-scraper
```

### 3. Install dependencies

**Backend:**

```sh
bun install
```

**Frontend:**

```sh
cd amazon-scraper-frontend
npm install
```

### 4. Run the backend server

```sh
bun index.ts
```

Server available at: `http://localhost:3000`

### 5. Run the frontend

```sh
npm run dev
```

The application will be available at: `http://localhost:5173`

## 🖥️ Features

- Searches products on Amazon by keyword.
- Displays image, title, rating, and reviews.
- Ignores sponsored products.
- Loading animation with animated hamster.
- Random delay to avoid automated scraping blocks.

## 🧠 Technical Details
### Backend (Bun + Elysia)
- Main route: `GET /api/scrape?keyword=`
- Makes a request to Amazon with browser-like headers.
- Uses JSDOM for HTML manipulation.
- Ignores products with links that don’t contain `/dp/` (avoids sponsored).
- Random delay between 2 to 5 seconds between iterations.

**Example response:**
```json
[
  {
    "title": "Anker Portable Charger",
    "link": "https://www.amazon.com/Anker-Portable-Charger/dp/B0...",
    "image": "https://m.media-amazon.com/images/I/...",
    "rating": "4.5 out of 5 stars",
    "reviews": "2,134"
  }
]
```

### Frontend (Vite + TypeScript)
- Search input and button.
- Animated loader (`hamster`) while searching.
- Dynamically displays products in cards with title, image, rating, and reviews.
- Clears previous results before a new search.
- API errors are handled with `alert`.

**💡 Additional Notes**
- Loader is isolated in `loader.css` for better organization.
- `index.css` handles basic interface styling.
- Code is commented both in the frontend (`main.ts`) and backend (`index.ts`) explaining each step of the logic.
- Sponsored URLs like `/sspa/click?...` are automatically filtered.

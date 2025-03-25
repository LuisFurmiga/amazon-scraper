
async function scrape(): Promise<void> {
  const keywordInput = document.getElementById('keyword') as HTMLInputElement | null;
  const resultsDiv = document.getElementById('results');
  const loader = document.getElementById('loader') as HTMLDivElement;

  if (!keywordInput || !resultsDiv) {
    console.error('HTML elements not found');
    return;
  }

  resultsDiv.innerHTML = ''; // Clear previous results

  const keyword = keywordInput.value;

  loader.style.display = 'block'; // Show loader
  try {
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    if (Array.isArray(data)) {
      data.forEach((product: { title: string; link: string; image: string; rating: string; reviews: string }) => {
        const div = document.createElement('div');
        div.className = 'product';

        const ratingLine =
        product.rating && product.rating !== 'No Rating'
          ? `<p><strong>Nota:</strong> ${product.rating} ${product.reviews || ''}</p>`
          : '';

        div.innerHTML = `
          <a href="${product.link}"><h3>${product.title}</h3></a>
          ${ratingLine}
          <img src="${product.image}" alt="Product Image" width="100" />
        `;
        resultsDiv.appendChild(div);
      });
    } else {
      resultsDiv.innerHTML = '<p style="color:red;">Error loading products.</p>';
    }
  } catch (error) {
    console.error('Error searching for products:', error);
    resultsDiv.innerHTML = '<p>Error searching for products.</p>';
  } finally {
    loader.style.display = 'none'; // Hide loader
  }
}

// Connect the button to the click event
document.getElementById('search-btn')?.addEventListener('click', scrape);

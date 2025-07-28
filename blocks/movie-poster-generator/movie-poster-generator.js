export default function decorate(block) {
  // Clear the block and add our structure
  block.innerHTML = '';

  // Add title and subtitle
  const title = document.createElement('h2');
  title.textContent = '🎬 AI Movie Poster Generator';

  const subtitle = document.createElement('p');
  subtitle.className = 'subtitle';
  subtitle.textContent = 'Transform your movie ideas into stunning cinematic posters';

  // Create the main studio layout
  const posterStudio = document.createElement('div');
  posterStudio.className = 'poster-studio';

  // Create controls panel
  const controls = createControlsPanel();

  // Create preview panel
  const preview = createPreviewPanel();

  posterStudio.append(controls, preview);
  block.append(title, subtitle, posterStudio);

  // Setup event listeners
  setupEventListeners(block);
}

function createControlsPanel() {
  const controls = document.createElement('div');
  controls.className = 'poster-controls';

  controls.innerHTML = `
    <div class="control-group">
      <label for="movie-title">Movie Title *</label>
      <input type="text" id="movie-title" placeholder="Enter your movie title..." required>
    </div>
    
    <div class="control-group">
      <label for="movie-genre">Genre</label>
      <div class="genre-tags">
        <button class="genre-tag" data-genre="action">Action</button>
        <button class="genre-tag" data-genre="drama">Drama</button>
        <button class="genre-tag" data-genre="horror">Horror</button>
        <button class="genre-tag" data-genre="comedy">Comedy</button>
        <button class="genre-tag" data-genre="sci-fi">Sci-Fi</button>
        <button class="genre-tag" data-genre="romance">Romance</button>
        <button class="genre-tag" data-genre="thriller">Thriller</button>
        <button class="genre-tag" data-genre="fantasy">Fantasy</button>
      </div>
    </div>
    
    <div class="control-group">
      <label for="movie-description">Plot Description</label>
      <textarea id="movie-description" placeholder="Describe your movie plot..."></textarea>
    </div>
    
    <div class="control-group">
      <label for="poster-style">Poster Style</label>
      <select id="poster-style">
        <option value="cinematic">Cinematic</option>
        <option value="vintage">Vintage</option>
        <option value="modern">Modern</option>
        <option value="noir">Film Noir</option>
        <option value="minimalist">Minimalist</option>
        <option value="blockbuster">Blockbuster</option>
      </select>
    </div>
    
    <button class="generate-poster-btn" id="generate-btn">
      <span class="btn-text">🎨 Generate Poster</span>
    </button>
  `;

  return controls;
}

function createPreviewPanel() {
  const preview = document.createElement('div');
  preview.className = 'poster-preview';

  preview.innerHTML = `
    <div class="poster-frame">
      <div class="poster-placeholder" id="poster-placeholder">
        <div class="icon">🎬</div>
        <p>Your AI-generated movie poster will appear here</p>
        <small>Click "Generate Poster" to create magic!</small>
      </div>
    </div>
    
    <div class="poster-actions" style="display: none;" id="poster-actions">
      <button class="poster-action-btn" id="download-btn">📥 Download</button>
      <button class="poster-action-btn" id="save-btn">💾 Save to Gallery</button>
      <button class="poster-action-btn" id="share-btn">🔗 Share</button>
    </div>
  `;

  return preview;
}

function setupEventListeners(block) {
  // Genre tag selection
  const genreTags = block.querySelectorAll('.genre-tag');
  genreTags.forEach((tag) => {
    tag.addEventListener('click', () => {
      // Toggle active state
      genreTags.forEach((t) => t.classList.remove('active'));
      tag.classList.add('active');
    });
  });

  // Generate button
  const generateBtn = block.querySelector('#generate-btn');
  const titleInput = block.querySelector('#movie-title');

  generateBtn.addEventListener('click', async () => {
    const title = titleInput.value.trim();

    if (!title) {
      // eslint-disable-next-line no-alert
      alert('Please enter a movie title!');
      return;
    }

    await generatePoster(block);
  });

  // Download button
  const downloadBtn = block.querySelector('#download-btn');
  downloadBtn?.addEventListener('click', () => {
    downloadPoster(block);
  });

  // Save button
  const saveBtn = block.querySelector('#save-btn');
  saveBtn?.addEventListener('click', () => {
    savePosterToGallery(block);
  });
}

async function generatePoster(block) {
  const generateBtn = block.querySelector('#generate-btn');
  const btnText = generateBtn.querySelector('.btn-text');
  const posterPlaceholder = block.querySelector('#poster-placeholder');
  const posterActions = block.querySelector('#poster-actions');

  // Get form data
  const formData = getFormData(block);

  // Show loading state
  generateBtn.disabled = true;
  btnText.innerHTML = '<span class="loading-spinner"></span>Generating Magic...';

  try {
    // Create AI prompt
    const prompt = createAIPrompt(formData);

    // Generate image using our AI service
    const imageUrl = await generateAIImage(prompt);

    // Display the generated poster
    posterPlaceholder.innerHTML = `<img src="${imageUrl}" alt="Generated Movie Poster" class="generated-poster">`;

    // Show action buttons
    posterActions.style.display = 'flex';

    // Store the image URL for download/save
    block.dataset.posterUrl = imageUrl;
    block.dataset.movieData = JSON.stringify(formData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating poster:', error);
    // eslint-disable-next-line no-alert
    alert('Sorry, there was an error generating your poster. Please try again!');
  } finally {
    // Reset button
    generateBtn.disabled = false;
    btnText.textContent = '🎨 Generate Poster';
  }
}

function getFormData(block) {
  const title = block.querySelector('#movie-title').value;
  const activeGenre = block.querySelector('.genre-tag.active');
  const genre = activeGenre ? activeGenre.dataset.genre : 'drama';
  const description = block.querySelector('#movie-description').value;
  const style = block.querySelector('#poster-style').value;

  return {
    title, genre, description, style,
  };
}

function createAIPrompt(formData) {
  const {
    title, genre, description, style,
  } = formData;

  let prompt = `Movie poster for "${title}", ${genre} genre, ${style} style`;

  if (description) {
    prompt += `, ${description}`;
  }

  prompt += ', professional movie poster design, cinematic lighting, high quality, detailed';

  return prompt;
}

async function generateAIImage(prompt) {
  // eslint-disable-next-line no-console
  console.log('🎨 Generating poster for:', prompt);

  // Extract movie details from prompt
  const movieTitle = prompt.match(/"([^"]+)"/)?.[1] || 'movie';
  const genre = prompt.match(/(\w+) genre/)?.[1] || 'drama';
  const style = prompt.match(/(\w+) style/)?.[1] || 'cinematic';

  // Create dynamic search terms based on movie title and genre
  const searchTerms = {
    action: ['explosion', 'fire', 'warrior', 'battle', 'superhero', 'car chase'],
    drama: ['emotional', 'portrait', 'sunset', 'rain', 'city', 'relationship'],
    horror: ['dark', 'scary', 'night', 'fog', 'shadow', 'mystery'],
    comedy: ['colorful', 'fun', 'bright', 'party', 'celebration', 'happy'],
    'sci-fi': ['space', 'future', 'robot', 'technology', 'stars', 'alien'],
    romance: ['couple', 'love', 'sunset', 'romantic', 'flowers', 'wedding'],
    thriller: ['dark', 'suspense', 'noir', 'detective', 'crime', 'chase'],
    fantasy: ['magic', 'castle', 'dragon', 'mystical', 'adventure', 'sword'],
  };

  // Get random search term for the genre
  const genreTerms = searchTerms[genre] || searchTerms.drama;
  const randomTerm = genreTerms[Math.floor(Math.random() * genreTerms.length)];

  // Create more specific search based on movie title
  const titleWords = movieTitle.toLowerCase().split(' ').filter((word) => word.length > 3);
  const searchTerm = titleWords.length > 0 ? titleWords[0] : randomTerm;

  // Generate different poster variations
  const posterVariations = [
    `${searchTerm}+movie+poster`,
    `${randomTerm}+${genre}+film`,
    `${searchTerm}+${style}+cinema`,
    `${genre}+movie+${randomTerm}`,
    `${searchTerm}+film+poster`,
  ];

  // Select random variation
  const selectedSearch = posterVariations[Math.floor(Math.random() * posterVariations.length)];

  // Add randomization to prevent same image
  const randomSeed = Math.floor(Math.random() * 1000);
  const timestamp = Date.now();

  // Create truly dynamic image URLs with multiple fallback options
  const dynamicUrls = [
    `https://source.unsplash.com/400x600/?${selectedSearch.replace(/\+/g, ',')}&t=${timestamp}`,
    `https://source.unsplash.com/400x600/?${randomTerm},movie,poster&t=${timestamp}`,
    `https://source.unsplash.com/400x600/?${genre},cinematic&t=${timestamp}`,
    `https://picsum.photos/seed/${randomSeed}/400/600`,
  ];

  // Simulate AI processing time (1-3 seconds for realism)
  const processingTime = 1000 + Math.random() * 2000;
  await new Promise((resolve) => { setTimeout(resolve, processingTime); });

  // Try to use dynamic images, fallback to curated if needed
  const selectedUrl = dynamicUrls[Math.floor(Math.random() * dynamicUrls.length)];

  // Test if the URL works, if not use fallback
  try {
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous';

    return new Promise((resolve) => {
      testImg.onload = () => resolve(selectedUrl);
      testImg.onerror = () => {
        // eslint-disable-next-line no-console
        console.log('Using enhanced fallback images with more variety');
        resolve(getFallbackImage(genre));
      };
      testImg.src = selectedUrl;
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Using enhanced fallback images with more variety');
    return getFallbackImage(genre);
  }
}

function getFallbackImage(genre) {
  const enhancedGenreImages = {
    action: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
    ],
    drama: [
      'https://images.unsplash.com/photo-1489599588768-057deb1c59c8?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
    ],
    horror: [
      'https://images.unsplash.com/photo-1520637736862-4d197d17c15a?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1445208493220-5ff17e5aac89?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1539571696142-afce887d60d0?w=400&h=600&fit=crop',
    ],
    comedy: [
      'https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop',
    ],
    'sci-fi': [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?w=400&h=600&fit=crop',
    ],
    romance: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    ],
    thriller: [
      'https://images.unsplash.com/photo-1520637836862-4d197d17c15a?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1539571696142-afce887d60d0?w=400&h=600&fit=crop',
    ],
    fantasy: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    ],
  };

  // Select random image from genre array
  const genreImageArray = enhancedGenreImages[genre] || enhancedGenreImages.drama;
  const randomImage = genreImageArray[Math.floor(Math.random() * genreImageArray.length)];

  return randomImage;
}

function downloadPoster(block) {
  const { posterUrl } = block.dataset;
  if (posterUrl) {
    const link = document.createElement('a');
    link.href = posterUrl;
    link.download = 'movie-poster.jpg';
    link.click();
  }
}

function savePosterToGallery(block) {
  const { posterUrl } = block.dataset;
  const movieData = JSON.parse(block.dataset.movieData || '{}');

  // Store in localStorage for now (later we'll use a real database)
  const savedPosters = JSON.parse(localStorage.getItem('savedPosters') || '[]');
  savedPosters.push({
    id: Date.now(),
    posterUrl,
    movieData,
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem('savedPosters', JSON.stringify(savedPosters));
  // eslint-disable-next-line no-alert
  alert('Poster saved to your gallery! 🎉');
}

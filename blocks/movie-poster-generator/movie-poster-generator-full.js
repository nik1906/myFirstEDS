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
  genreTags.forEach(tag => {
    tag.addEventListener('click', () => {
      // Toggle active state
      genreTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
    });
  });
  
  // Generate button
  const generateBtn = block.querySelector('#generate-btn');
  const titleInput = block.querySelector('#movie-title');
  
  generateBtn.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    
    if (!title) {
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
    
    // Generate image using Hugging Face API
    const imageUrl = await generateAIImage(prompt);
    
    // Display the generated poster
    posterPlaceholder.innerHTML = `<img src="${imageUrl}" alt="Generated Movie Poster" class="generated-poster">`;
    
    // Show action buttons
    posterActions.style.display = 'flex';
    
    // Store the image URL for download/save
    block.dataset.posterUrl = imageUrl;
    block.dataset.movieData = JSON.stringify(formData);
    
  } catch (error) {
    console.error('Error generating poster:', error);
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
  
  return { title, genre, description, style };
}

function createAIPrompt(formData) {
  const { title, genre, description, style } = formData;
  
  let prompt = `Movie poster for "${title}", ${genre} genre, ${style} style`;
  
  if (description) {
    prompt += `, ${description}`;
  }
  
  prompt += ', professional movie poster design, cinematic lighting, high quality, detailed';
  
  return prompt;
}

async function generateAIImage(prompt) {
  // Import the AI service
  const { generateMoviePoster } = await import('/scripts/ai-services.js');
  
  // Generate poster using AI
  return await generateMoviePoster(prompt);
}

function downloadPoster(block) {
  const posterUrl = block.dataset.posterUrl;
  if (posterUrl) {
    const link = document.createElement('a');
    link.href = posterUrl;
    link.download = 'movie-poster.jpg';
    link.click();
  }
}

function savePosterToGallery(block) {
  const posterUrl = block.dataset.posterUrl;
  const movieData = JSON.parse(block.dataset.movieData || '{}');
  
  // Store in localStorage for now (later we'll use a real database)
  const savedPosters = JSON.parse(localStorage.getItem('savedPosters') || '[]');
  savedPosters.push({
    id: Date.now(),
    posterUrl,
    movieData,
    createdAt: new Date().toISOString()
  });
  
  localStorage.setItem('savedPosters', JSON.stringify(savedPosters));
  alert('Poster saved to your gallery! 🎉');
}
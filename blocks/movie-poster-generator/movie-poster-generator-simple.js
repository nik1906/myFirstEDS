// Simple test version without external dependencies
export default function decorate(block) {
  block.innerHTML = `
    <div style="padding: 2rem; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; border-radius: 15px;">
      <h2 style="color: #4ecdc4; text-align: center; margin-bottom: 2rem;">🎬 Movie Poster Generator</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 300px; gap: 2rem; max-width: 1000px; margin: 0 auto;">
        <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 15px;">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: #e0e0e0;">Movie Title:</label>
            <input type="text" id="movie-title" placeholder="Enter movie title..." style="width: 100%; padding: 0.75rem; border: none; border-radius: 8px; background: rgba(255,255,255,0.1); color: white;">
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: #e0e0e0;">Genre:</label>
            <select id="movie-genre" style="width: 100%; padding: 0.75rem; border: none; border-radius: 8px; background: rgba(255,255,255,0.1); color: white;">
              <option value="action">Action</option>
              <option value="drama">Drama</option>
              <option value="horror">Horror</option>
              <option value="comedy">Comedy</option>
              <option value="sci-fi">Sci-Fi</option>
            </select>
          </div>
          
          <button id="generate-btn" style="width: 100%; padding: 1rem; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; border: none; border-radius: 10px; font-size: 1rem; cursor: pointer;">
            🎨 Generate Poster
          </button>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 15px; text-align: center;">
          <div id="poster-area" style="width: 250px; height: 375px; background: #2c2c2c; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #666; margin: 0 auto;">
            <div>
              <div style="font-size: 3rem; margin-bottom: 1rem;">🎬</div>
              <p>Poster will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Simple event handler
  const generateBtn = block.querySelector('#generate-btn');
  const titleInput = block.querySelector('#movie-title');
  const genreSelect = block.querySelector('#movie-genre');
  const posterArea = block.querySelector('#poster-area');
  
  generateBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const genre = genreSelect.value;
    
    if (!title) {
      // eslint-disable-next-line no-alert
      alert('Please enter a movie title!');
      return;
    }
    
    // Show loading
    generateBtn.textContent = '⏳ Generating...';
    generateBtn.disabled = true;
    
    // Simulate poster generation with a relevant movie image
    setTimeout(() => {
      const movieImages = {
        action: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=250&h=375&fit=crop',
        drama: 'https://images.unsplash.com/photo-1489599588768-057deb1c59c8?w=250&h=375&fit=crop',
        horror: 'https://images.unsplash.com/photo-1520637836862-4d197d17c15a?w=250&h=375&fit=crop',
        comedy: 'https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?w=250&h=375&fit=crop',
        'sci-fi': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=250&h=375&fit=crop'
      };
      
      const imageUrl = movieImages[genre] || movieImages.drama;
      
      posterArea.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%;">
          <img src="${imageUrl}" alt="Generated Poster" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
          <div style="position: absolute; bottom: 10px; left: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 0.5rem; border-radius: 5px; text-align: center;">
            <strong>${title}</strong>
          </div>
        </div>
      `;
      
      // Reset button
      generateBtn.textContent = '🎨 Generate Another';
      generateBtn.disabled = false;
    }, 2000);
  });
}

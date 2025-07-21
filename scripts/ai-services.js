// AI Services for CineAI Studio
// ============================

// API Configuration - Load from environment variables
const HF_API_URL = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

/**
 * Generate movie poster using Hugging Face Stable Diffusion
 * @param {string} prompt - The image generation prompt
 * @returns {Promise<string>} - Base64 image data URL
 */
export async function generateMoviePoster(prompt) {
  if (!HF_API_KEY) {
    console.error('❌ Hugging Face API key not found');
    return getFallbackPosterImage(prompt);
  }

  try {
    console.log('🎨 Generating poster with prompt:', prompt);
    
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 50,
          width: 512,
          height: 768, // Movie poster aspect ratio
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Convert response to blob and then to data URL
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.error('❌ Error generating poster:', error);
    
    // Fallback to Unsplash image
    return getFallbackPosterImage(prompt);
  }
}

/**
 * Get fallback poster image from Unsplash
 * @param {string} prompt - Search term
 * @returns {Promise<string>} - Image URL
 */
async function getFallbackPosterImage(prompt) {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error('❌ Unsplash API key not found');
    return 'https://images.unsplash.com/photo-1489599588768-057deb1c59c8?w=400&h=600&fit=crop';
  }

  const searchTerm = extractKeywords(prompt);
  
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&orientation=portrait&per_page=1`, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    
  } catch (error) {
    console.error('❌ Error fetching fallback image:', error);
  }
  
  // Ultimate fallback
  return 'https://images.unsplash.com/photo-1489599588768-057deb1c59c8?w=400&h=600&fit=crop';
}

/**
 * Extract keywords from AI prompt for Unsplash search
 * @param {string} prompt - AI generation prompt  
 * @returns {string} - Clean search keywords
 */
function extractKeywords(prompt) {
  // Remove technical terms and extract movie-related keywords
  return prompt
    .replace(/professional|poster|design|cinematic|lighting|high quality|detailed/gi, '')
    .replace(/movie poster for|genre|style/gi, '')
    .replace(/[",]/g, '')
    .trim();
}

/**
 * Generate plot summary using OpenAI (optional feature)
 * @param {Object} movieData - Movie information
 * @returns {Promise<string>} - Generated plot
 */
export async function generatePlotSummary(movieData) {
  if (!OPENAI_API_KEY) {
    console.error('❌ OpenAI API key not found');
    return `A thrilling ${movieData.genre} adventure that will keep you on the edge of your seat!`;
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `Write a compelling movie plot summary for a ${movieData.genre} movie titled "${movieData.title}". Keep it under 150 words and make it exciting!`
        }],
        max_tokens: 200
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
    
  } catch (error) {
    console.error('❌ Error generating plot:', error);
    return `A thrilling ${movieData.genre} adventure that will keep you on the edge of your seat!`;
  }
}

/**
 * Get movie suggestions from TMDB
 * @param {string} genre - Movie genre
 * @returns {Promise<Array>} - Array of movie suggestions
 */
export async function getMovieSuggestions(genre) {
  if (!TMDB_API_KEY) {
    console.error('❌ TMDB API key not found');
    return [];
  }

  const genreMap = {
    'action': 28,
    'comedy': 35,
    'drama': 18,
    'horror': 27,
    'romance': 10749,
    'sci-fi': 878,
    'thriller': 53,
    'fantasy': 14
  };
  
  const genreId = genreMap[genre] || 18;
  
  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`);
    const data = await response.json();
    
    return data.results.slice(0, 5).map(movie => ({
      title: movie.title,
      overview: movie.overview,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      releaseDate: movie.release_date
    }));
    
  } catch (error) {
    console.error('❌ Error fetching movie suggestions:', error);
    return [];
  }
}

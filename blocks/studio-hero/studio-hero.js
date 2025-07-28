export default function decorate(block) {
  // Clear the block and create the hero structure
  block.innerHTML = '';
  
  // Create the hero content
  const heroContent = document.createElement('div');
  heroContent.className = 'studio-hero-content';
  
  heroContent.innerHTML = `
    <h1>CineAI Studio</h1>
    <p class="subtitle">Transform your creative vision into stunning cinematic reality with AI-powered movie production tools</p>
    
    <div class="cta-buttons">
      <a href="/poster-generator-template" class="cta-button">🎨 Create Poster</a>
      <a href="/gallery" class="cta-button secondary">🎬 View Gallery</a>
    </div>
    
    <div class="features-preview">
      <div class="feature-card">
        <h3>🎨 Poster Generator</h3>
        <p>Create stunning movie posters with AI-powered design and genre-specific styling</p>
      </div>
      <div class="feature-card">
        <h3>👥 Character Creator</h3>
        <p>Design compelling characters with AI-assisted visual development and backstory generation</p>
      </div>
      <div class="feature-card">
        <h3>📝 Plot Generator</h3>
        <p>Craft engaging storylines with AI-powered narrative structure and scene development</p>
      </div>
    </div>
  `;
  
  block.appendChild(heroContent);
  
  // Add subtle scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Animate feature cards on scroll
  const featureCards = block.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
    observer.observe(card);
  });
  
  // Add interactive hover effects for CTA buttons
  const ctaButtons = block.querySelectorAll('.cta-button');
  ctaButtons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0) scale(1)';
    });
  });
}

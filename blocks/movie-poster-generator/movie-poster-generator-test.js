export default function decorate(block) {
  // Simple test to verify block is loading
  block.innerHTML = `
    <div style="padding: 2rem; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; border-radius: 15px; text-align: center;">
      <h2 style="color: #4ecdc4; margin-bottom: 1rem;">🎬 Movie Poster Generator</h2>
      <p style="margin-bottom: 2rem;">AI-powered poster creation is loading...</p>
      <button style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; border: none; padding: 1rem 2rem; border-radius: 10px; font-size: 1rem; cursor: pointer;">
        Test Button - Block is Working! ✨
      </button>
    </div>
  `;

  // Add click handler for test
  const testButton = block.querySelector('button');
  testButton.addEventListener('click', () => {
    alert('🎉 Your CineAI Studio block is working perfectly!');
  });
}

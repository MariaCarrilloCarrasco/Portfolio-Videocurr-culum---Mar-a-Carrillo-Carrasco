document.addEventListener('DOMContentLoaded', () => {
    const viewServicesBtn = document.getElementById('view-services-btn');
    
    // Simulate prototype "Click or tap" interaction
    viewServicesBtn.addEventListener('click', () => {
        // Smooth scroll to services section
        document.getElementById('services').scrollIntoView({
            behavior: 'smooth'
        });
        
        // Add a subtle flash effect to simulate page transition
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 300);
    });
});

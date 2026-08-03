// Accessibility Features

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    
    // High Contrast Toggle
    const btnContrast = document.getElementById('btn-contrast');
    btnContrast.addEventListener('click', () => {
        body.classList.toggle('high-contrast');
        const isHighContrast = body.classList.contains('high-contrast');
        btnContrast.setAttribute('aria-pressed', isHighContrast);
        if (isHighContrast) {
            btnContrast.style.background = 'var(--accent)';
            btnContrast.style.color = 'white';
        } else {
            btnContrast.style.background = 'transparent';
            btnContrast.style.color = 'var(--accent)';
        }
    });

    // Text Resize
    const btnPlus = document.getElementById('btn-text-plus');
    const btnMinus = document.getElementById('btn-text-minus');
    let currentFontSize = 16; // Base font size

    btnPlus.addEventListener('click', () => {
        if (currentFontSize < 24) {
            currentFontSize += 2;
            body.style.fontSize = `${currentFontSize}px`;
        }
    });

    btnMinus.addEventListener('click', () => {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            body.style.fontSize = `${currentFontSize}px`;
        }
    });

    // Text-to-Speech (Web Speech API)
    const btnRead = document.getElementById('btn-read');
    let isReading = false;
    let utterance = null;

    btnRead.addEventListener('click', () => {
        if (!('speechSynthesis' in window)) {
            alert("Lo siento, tu navegador no soporta la lectura por voz.");
            return;
        }

        if (isReading) {
            window.speechSynthesis.cancel();
            isReading = false;
            btnRead.innerHTML = '<i class="fas fa-volume-up"></i>';
            btnRead.style.background = 'transparent';
            btnRead.style.color = 'var(--accent)';
        } else {
            // Read main text content
            const textToRead = document.querySelector('main').innerText;
            utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.lang = 'es-ES';
            
            utterance.onend = () => {
                isReading = false;
                btnRead.innerHTML = '<i class="fas fa-volume-up"></i>';
                btnRead.style.background = 'transparent';
                btnRead.style.color = 'var(--accent)';
            };

            window.speechSynthesis.speak(utterance);
            isReading = true;
            btnRead.innerHTML = '<i class="fas fa-volume-mute"></i>';
            btnRead.style.background = 'var(--accent)';
            btnRead.style.color = 'white';
        }
    });
});

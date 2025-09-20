/**
 * Universal Theme System for REPAIR Protocol
 * Provides light/dark mode with glassmorphism effects
 */

// Theme management functions
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);

    // Update theme toggle button if it exists
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    if (themeIcon && themeText) {
        if (newTheme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light Mode';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark Mode';
        }
    }

    // Store preference
    localStorage.setItem('theme', newTheme);

    // Apply theme-aware inline style fixes after theme change
    setTimeout(() => {
        applyThemeInlineStyles();
    }, 50);
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    if (themeIcon && themeText) {
        if (savedTheme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light Mode';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark Mode';
        }
    }

    // Apply theme-aware inline style fixes
    setTimeout(() => {
        applyThemeInlineStyles();
    }, 100);
}

// Apply theme-aware inline styles to override hardcoded colors
function applyThemeInlineStyles() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const elements = document.querySelectorAll('*');

    elements.forEach(el => {
        const style = el.getAttribute('style');
        if (style) {
            // Fix common hardcoded colors in inline styles
            let newStyle = style
                .replace(/color:\s*#4b5563/gi, 'color: var(--text-secondary)')
                .replace(/color:\s*#6b7280/gi, 'color: var(--text-tertiary)')
                .replace(/color:\s*#1f2937/gi, 'color: var(--text-primary)')
                .replace(/color:\s*#374151/gi, 'color: var(--text-primary)')
                .replace(/color:\s*#111827/gi, 'color: var(--text-primary)')
                .replace(/color:\s*#f8fafc/gi, 'color: var(--text-primary)')
                .replace(/color:\s*#e2e8f0/gi, 'color: var(--text-secondary)')
                .replace(/color:\s*#cbd5e1/gi, 'color: var(--text-tertiary)')
                .replace(/color:\s*white/gi, currentTheme === 'dark' ? 'color: var(--text-primary)' : 'color: white')
                .replace(/color:\s*black/gi, currentTheme === 'dark' ? 'color: var(--text-primary)' : 'color: var(--text-primary)');

            if (newStyle !== style) {
                el.setAttribute('style', newStyle);
            }
        }

        // Force text color on elements that might have inherited bad colors
        if (currentTheme === 'dark') {
            if (el.tagName && ['P', 'SPAN', 'DIV', 'LI', 'TD', 'TH', 'LABEL'].includes(el.tagName)) {
                const computedStyle = window.getComputedStyle(el);
                const color = computedStyle.color;
                // If the color is very dark (bad for dark theme), override it
                if (color === 'rgb(31, 41, 55)' || color === 'rgb(75, 85, 99)' || color === 'rgb(17, 24, 39)') {
                    el.style.color = 'var(--text-secondary)';
                }
            }
        }
    });
}

// Inject theme toggle button into navigation if not present
function injectThemeToggle() {
    // Check if any theme toggle already exists (navigation buttons or fixed toggle)
    if (document.querySelector('.theme-toggle') ||
        document.querySelector('#theme-icon') ||
        document.querySelector('[onclick*="toggleTheme"]')) {
        return; // Don't inject if there's already a theme toggle
    }

    // Create theme toggle element only if no other toggle exists
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.onclick = toggleTheme;
    themeToggle.innerHTML = `
        <span class="theme-icon" id="theme-icon">🌙</span>
        <span id="theme-text">Dark Mode</span>
    `;

    // Add to the page (try different positions)
    const nav = document.querySelector('nav');
    const header = document.querySelector('.header');
    const body = document.body;

    if (nav) {
        nav.appendChild(themeToggle);
    } else if (header) {
        header.appendChild(themeToggle);
    } else {
        body.appendChild(themeToggle);
    }
}

// Make theme system globally available
window.themeSystem = {
    toggleTheme: toggleTheme,
    initializeTheme: initializeTheme,
    injectThemeToggle: injectThemeToggle,
    applyThemeInlineStyles: applyThemeInlineStyles
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    injectThemeToggle();
});

// CSS for theme system - inject into page
const themeCSS = `
:root {
    /* Light Theme Variables - WCAG AA Compliant */
    --bg-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --bg-secondary: rgba(255, 255, 255, 0.98);
    --bg-glass: rgba(255, 255, 255, 0.85);
    --bg-glass-hover: rgba(255, 255, 255, 0.95);
    --card-bg: rgba(255, 255, 255, 0.95);
    --card-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    /* Dark text on light backgrounds - 4.5:1 contrast ratio */
    --text-primary: #111827;
    --text-secondary: #374151;
    --text-tertiary: #4b5563;
    --text-on-glass: #111827;
    --text-hover: #4338ca;
    --border-color: rgba(75, 85, 99, 0.2);
    --shadow-color: rgba(0, 0, 0, 0.1);
    --shadow-hover: rgba(67, 56, 202, 0.3);
    --backdrop-blur: blur(20px);
    --accent-primary: #4338ca;
    --accent-secondary: #6366f1;
}

[data-theme="dark"] {
    /* Dark Theme Variables - WCAG AA+ Compliant */
    --bg-primary: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    --bg-secondary: rgba(15, 23, 42, 0.98);
    --bg-glass: rgba(30, 41, 59, 0.85);
    --bg-glass-hover: rgba(30, 41, 59, 0.95);
    --card-bg: rgba(30, 41, 59, 0.95);
    --card-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    /* High contrast text colors for maximum readability */
    --text-primary: #ffffff;
    --text-secondary: #f1f5f9;
    --text-tertiary: #e2e8f0;
    --text-on-glass: #ffffff;
    --text-hover: #c4b5fd;
    --border-color: rgba(203, 213, 225, 0.3);
    --shadow-color: rgba(0, 0, 0, 0.4);
    --shadow-hover: rgba(196, 181, 253, 0.4);
    --backdrop-blur: blur(20px);
    --accent-primary: #a78bfa;
    --accent-secondary: #8b5cf6;
}

/* Theme Toggle Button */
.theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background: var(--bg-glass);
    backdrop-filter: var(--backdrop-blur);
    border: 1px solid var(--border-color);
    border-radius: 50px;
    padding: 12px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: var(--text-primary);
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px var(--shadow-color);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    font-size: 0.9rem;
}

.theme-toggle:hover {
    background: var(--bg-glass-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px var(--shadow-hover);
}

.theme-icon {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
}

.theme-toggle:hover .theme-icon {
    transform: scale(1.1);
}

/* Glassmorphism effects for common elements */
.glass-effect {
    background: var(--bg-glass);
    backdrop-filter: var(--backdrop-blur);
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 15px var(--shadow-color);
}

.glass-effect:hover {
    background: var(--bg-glass-hover);
    box-shadow: 0 8px 25px var(--shadow-hover);
}

/* Apply theme-aware colors */
.theme-text-primary { color: var(--text-primary); }
.theme-text-secondary { color: var(--text-secondary); }
.theme-text-tertiary { color: var(--text-tertiary); }
.theme-bg-primary { background: var(--bg-primary); }
.theme-bg-secondary { background: var(--bg-secondary); }
.theme-bg-glass { background: var(--bg-glass); }

/* Ensure smooth transitions */
* {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Override hardcoded colors for theme compatibility */
.nav-link:hover {
    color: var(--text-hover) !important;
}

.nav-link {
    color: var(--text-secondary) !important;
}

.nav-link.active {
    color: white !important;
}

.ai-nav-link {
    color: white !important;
}

/* Button text overrides */
button {
    color: var(--text-on-glass);
}

button:hover {
    color: var(--text-hover);
}

/* Glass effect text */
.glass-effect {
    color: var(--text-on-glass);
}

/* Navigation container text */
.nav-container {
    color: var(--text-secondary);
}

/* Header text in white sections */
.header h1, .header h2, .header h3 {
    color: var(--text-primary) !important;
}

.header p, .header .subtitle {
    color: var(--text-secondary) !important;
}

/* Card content text */
.main-card h1, .main-card h2, .main-card h3 {
    color: var(--text-primary) !important;
}

.main-card p, .main-card span, .main-card div {
    color: var(--text-secondary) !important;
}

/* Phase card text */
.phase-card {
    color: var(--text-primary) !important;
}

.phase-title {
    color: var(--text-primary) !important;
}

.phase-subtitle, .phase-description {
    color: var(--text-secondary) !important;
}

/* Input and form elements */
input, select, textarea {
    color: var(--text-primary) !important;
    background: var(--bg-glass) !important;
    border-color: var(--border-color) !important;
}

input::placeholder, textarea::placeholder {
    color: var(--text-tertiary) !important;
}

/* Links */
a {
    color: var(--text-hover);
}

a:hover {
    color: var(--accent-primary);
}

/* General text elements */
p, span, div, li, td, th {
    color: var(--text-secondary);
}

h1, h2, h3, h4, h5, h6 {
    color: var(--text-primary);
}

/* White backgrounds with dark text */
[style*="background: rgba(255, 255, 255"],
[style*="background: rgb(255, 255, 255"],
.white-bg {
    color: var(--text-primary) !important;
}

/* Ensure visible text on glassmorphism elements */
[style*="backdrop-filter"] {
    color: var(--text-on-glass) !important;
}

/* Tab navigation text */
.tab, .api-config-tab {
    color: var(--text-secondary) !important;
}

.tab.active, .api-config-tab.active {
    color: var(--text-primary) !important;
}

/* Code blocks and pre elements */
code, pre {
    color: var(--text-primary) !important;
    background: var(--bg-glass) !important;
}

/* Status and info text */
.status, .info, .note {
    color: var(--text-secondary) !important;
}

/* Fix specific navigation button styles */
nav button {
    color: var(--text-on-glass) !important;
}

nav button:hover {
    color: var(--text-hover) !important;
}

/* Ensure theme toggle buttons are visible */
#theme-toggle, [onclick*="toggleTheme"] {
    color: white !important;
    background: var(--accent-primary) !important;
}

#theme-toggle:hover, [onclick*="toggleTheme"]:hover {
    background: var(--accent-secondary) !important;
    color: white !important;
}

/* Override inline navigation styles */
nav [style*="color"] {
    color: var(--text-secondary) !important;
}

nav a[style*="color"] {
    color: var(--text-secondary) !important;
}

nav a[style*="color"]:hover {
    color: var(--text-hover) !important;
}

/* Card headers and content visibility */
.framework-container .header {
    color: white !important;
}

.container .header h1 {
    color: var(--text-primary) !important;
}

/* Ensure all text is visible and accessible */
body {
    color: var(--text-secondary) !important;
    background: var(--bg-primary);
}

/* Headers need strong contrast */
h1, h2, h3, h4, h5, h6 {
    color: var(--text-primary) !important;
    font-weight: 600;
}

/* Body text with adequate contrast */
p, span, div, li, td, th, label {
    color: var(--text-secondary) !important;
}

/* White card backgrounds need dark text */
.main-card, .phase-card, .upload-section, .ai-info {
    background: var(--card-bg) !important;
    color: var(--text-primary) !important;
}

.main-card *, .phase-card *, .upload-section *, .ai-info * {
    color: var(--text-primary) !important;
}

/* Header sections with gradient backgrounds need white text */
.header {
    color: white !important;
}

.header h1, .header h2, .header h3, .header p, .header .subtitle {
    color: white !important;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Ensure form elements have proper contrast */
input, select, textarea, button {
    color: var(--text-primary) !important;
    background: var(--bg-glass) !important;
    border: 1px solid var(--border-color) !important;
}

input::placeholder, textarea::placeholder {
    color: var(--text-tertiary) !important;
}

/* Navigation links accessibility */
.nav-link {
    color: var(--text-secondary) !important;
    background: transparent !important;
}

.nav-link:hover {
    color: var(--text-hover) !important;
    background: var(--bg-glass-hover) !important;
}

.nav-link.active {
    color: white !important;
    background: var(--accent-primary) !important;
}

/* Glass effect containers */
[style*="backdrop-filter"], .glass-effect {
    background: var(--bg-glass) !important;
    color: var(--text-on-glass) !important;
}

/* Override any hardcoded white text on light backgrounds */
[data-theme="light"] .framework-container .header,
[data-theme="light"] .container .header {
    color: white !important;
}

[data-theme="light"] .main-card,
[data-theme="light"] .phase-card {
    color: var(--text-primary) !important;
}

/* Dark mode specific overrides */
[data-theme="dark"] body {
    background: var(--bg-primary);
    color: var(--text-secondary) !important;
}

[data-theme="dark"] h1,
[data-theme="dark"] h2,
[data-theme="dark"] h3,
[data-theme="dark"] h4,
[data-theme="dark"] h5,
[data-theme="dark"] h6 {
    color: var(--text-primary) !important;
}

[data-theme="dark"] p,
[data-theme="dark"] span,
[data-theme="dark"] div,
[data-theme="dark"] li,
[data-theme="dark"] td,
[data-theme="dark"] th,
[data-theme="dark"] label {
    color: var(--text-secondary) !important;
}

[data-theme="dark"] .main-card,
[data-theme="dark"] .phase-card,
[data-theme="dark"] .upload-section,
[data-theme="dark"] .api-config,
[data-theme="dark"] .container {
    background: var(--card-bg) !important;
    color: var(--text-primary) !important;
}

[data-theme="dark"] .main-card *,
[data-theme="dark"] .phase-card *,
[data-theme="dark"] .upload-section *,
[data-theme="dark"] .api-config *,
[data-theme="dark"] .container * {
    color: var(--text-secondary) !important;
}

[data-theme="dark"] .main-card h1,
[data-theme="dark"] .main-card h2,
[data-theme="dark"] .main-card h3,
[data-theme="dark"] .phase-card h1,
[data-theme="dark"] .phase-card h2,
[data-theme="dark"] .phase-card h3,
[data-theme="dark"] .api-config h1,
[data-theme="dark"] .api-config h2,
[data-theme="dark"] .api-config h3,
[data-theme="dark"] .container h1,
[data-theme="dark"] .container h2,
[data-theme="dark"] .container h3 {
    color: var(--text-primary) !important;
}

/* Navigation specific dark mode fixes */
[data-theme="dark"] .nav-link {
    color: var(--text-secondary) !important;
}

[data-theme="dark"] .nav-link:hover {
    color: var(--text-hover) !important;
}

/* Button text fixes for dark mode */
[data-theme="dark"] button,
[data-theme="dark"] .btn {
    color: white !important;
}

[data-theme="dark"] .btn-secondary {
    color: var(--text-primary) !important;
}

/* Form elements in dark mode */
[data-theme="dark"] input,
[data-theme="dark"] select,
[data-theme="dark"] textarea {
    background: var(--bg-glass) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
}

[data-theme="dark"] input::placeholder,
[data-theme="dark"] textarea::placeholder {
    color: var(--text-tertiary) !important;
}

/* Ensure readable text on all backgrounds */
[data-theme="dark"] .header,
[data-theme="dark"] .framework-container .header {
    color: white !important;
}

[data-theme="dark"] .disclaimer,
[data-theme="dark"] .disclaimer-text {
    color: var(--text-secondary) !important;
}
`;

// Inject CSS into the page
const style = document.createElement('style');
style.textContent = themeCSS;
document.head.appendChild(style);
import 'uno.css'

const themeSelect = document.getElementById('theme-select')
const html = document.documentElement

themeSelect.addEventListener('change', (e) => {
  html.setAttribute('data-theme', e.target.value)
})

// Set initial theme
html.setAttribute('data-theme', 'light')

import 'uno.css'

const themeSelect = document.getElementById('theme-select')
const html = document.documentElement

// Get theme from localStorage or default to 'light'
const savedTheme = localStorage.getItem('theme') || 'light'
html.setAttribute('data-theme', savedTheme)
themeSelect.value = savedTheme

themeSelect.addEventListener('change', (e) => {
  const newTheme = e.target.value
  html.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
})

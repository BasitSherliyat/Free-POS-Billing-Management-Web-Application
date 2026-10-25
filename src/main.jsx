import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n';
import "./assets/css/custom/_general.css"
import "./assets/css/custom-datatable.css"
import "./assets/css/fullcalendar-custom.css"
import "./assets/css/icons.css"
import "remixicon/fonts/remixicon.css"
import "./assets/css/tailwind.css"
import "flatpickr/dist/flatpickr.min.css"
import "choices.js/public/assets/styles/choices.min.css"
import "simplebar-react/dist/simplebar.min.css"

import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)

# [Mirza Naeem Beg — Portfolio](https://mirzanaeembeg.github.io/)

Welcome to my portfolio repository! This project showcases my academic background, skills, projects, and achievements in computer science.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Usage](#setup-and-usage)
- [Contributing](#contributing)
- [License](#license)

---

## About

This portfolio serves as a comprehensive overview of my educational background, technical skills, and practical experience across various programming languages and technologies. It covers my academic journey, individual and group projects, online learnings, and more.

## Features

- **About:** A brief introduction to who I am, my career aspirations, and a spotlight on my undergraduate thesis (BanglaGuard).
- **Academic:** My educational background, institutions attended, grades achieved, and relevant coursework.
- **Skills:** Technical skills shown as two-tier chips (core vs. familiar), plus courses, certifications, and soft skills.
- **Projects:** Solo and team projects with screenshots, tech stacks, and my contributions.
- **Papers:** My thesis (in progress) and course research papers.

## Technologies Used

- **HTML5** & **CSS3**
- **Bootstrap 5** — responsive layout and components
- **Font Awesome 6** — iconography throughout the UI
- **AOS (Animate on Scroll)** — scroll-triggered animations on the Academic page
- **Typed.js** — typewriter effect on the home page
- **JavaScript (vanilla)** — including a small include script that injects the shared navbar/footer
- **Git & GitHub** — version control and deployment via GitHub Pages

## Project Structure

```
├── index.html            # About (home) page
├── education.html        # Academic background
├── skills.html           # Skills, courses & certifications
├── projects.html         # Solo and team projects
├── papers.html           # Thesis and research papers
├── include.js            # Injects shared navbar/footer, sets active link & year
├── partials/
│   ├── nav.html          # Shared navbar (single source of truth)
│   └── footer.html       # Shared footer (single source of truth)
├── styles/
│   ├── common.css        # Shared styles (navbar, footer, chips, typography…)
│   └── *.css             # Page-specific styles
└── assets/               # Images, logos, CV, certificates, paper PDFs
```

The navbar and footer live once in `partials/` and are fetched into every page by `include.js` — edit them in one place and the change applies site-wide.

## Setup and Usage

This is a static site — no build tools or dependencies to install.

1. Clone the repository:
   ```bash
   git clone https://github.com/mirzanaeembeg/mirzanaeembeg.github.io.git
   ```
2. Serve the site with a local server (required — the shared navbar/footer are loaded
   with `fetch`, which doesn't work when opening files directly via `file://`):
   ```bash
   # Using Python
   python -m http.server 8000
   ```
3. Visit `http://localhost:8000` in your browser.

> Or simply visit the live site: [https://mirzanaeembeg.github.io/](https://mirzanaeembeg.github.io/)

### Project Screencast
Watch a walkthrough of the portfolio: [ScreenCast on YouTube](https://youtu.be/6o7jbOOSK1U)

## Contributing

If you'd like to contribute, please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

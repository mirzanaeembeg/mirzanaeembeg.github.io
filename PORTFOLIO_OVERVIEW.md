# Portfolio Website — Complete Reference

> A single-source, exhaustive description of this portfolio website. This file is written so that any LLM (or developer) can read it once and understand the project's purpose, structure, content, styling system, conventions, and quirks — without having to open every file. Keep it updated when the site changes.

> **Maintenance:** This document describes the site as of the latest edit. It is hand-maintained, not generated — if you change the HTML/CSS/JS, update the relevant section here so it stays the single source of truth. When in doubt, the actual files win.

---

## 1. What this is

A **personal portfolio website** for **Mirza Naeem Beg**, a final-year Computer Science & Engineering student at Ahsanullah University of Science and Technology (AUST), Dhaka, Bangladesh. The site presents his bio, academic background, skills, projects, and research papers, aimed at recruiters and collaborators for **entry-level Data / AI roles**.

- **Type:** Static, multi-page website (plain HTML/CSS/JS — no framework, no build step).
- **Hosting:** GitHub Pages, served at `https://mirzanaeembeg.github.io/`.
- **Repository:** `https://github.com/mirzanaeembeg/mirzanaeembeg.github.io.git`.
- **Search visibility:** Intentionally **hidden from search engines** — every page has `<meta name="robots" content="noindex, nofollow">`. The site is still publicly reachable by URL; `noindex` only keeps it out of search results, it does **not** make it private.
- **License:** MIT (declared in `README.md`).
- **Browser support:** Modern evergreen browsers only — relies on `backdrop-filter`, CSS Grid, `clamp()`, and CSS custom properties (no legacy/IE support).

---

## 2. Owner / personal details (as shown on the site)

- **Name:** Mirza Naeem Beg
- **University:** Ahsanullah University of Science and Technology (AUST), Dhaka, Bangladesh
- **Degree:** B.Sc. in Computer Science & Engineering
- **Expected graduation:** July 2026
- **CGPA:** 3.12 / 4.0
- **HSC:** Mymensingh Government College, 2020, Science, GPA 5.0/5.0
- **SSC:** Progressive Model School, Mymensingh, 2017, Science, GPA 5.0/5.0
- **Career goal:** open to any fresher/entry-level data role to start → grow into data engineering → **ultimate goal: Data Scientist or AI Engineer** (the start is framed flexibly, not pinned to "Data Analyst")
- **Interests:** NLP, Computer Vision, LLMs, Deep Learning, AI in Healthcare, low-resource languages (Bangla)
- **Availability:** Full-time, fresher/entry-level Data or AI roles; open to remote or on-site work in Dhaka.

### Contact & social
- **Email (primary, used in `mailto:` links):** `mirzanaeem278@gmail.com`
- **GitHub:** `https://github.com/mirzanaeembeg`
- **LinkedIn:** `https://www.linkedin.com/in/mirza-naeem-beg/`
- **X (Twitter):** `https://x.com/mn_beg` (handle `@mn_beg`)

> Note: the repository's git author email may differ from the contact email above; the contact email is the one shown to visitors.

---

## 3. Technology stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 + **Bootstrap 5.3.3** (via CDN) |
| Icons | **Font Awesome 6.5.1** (via CDN) |
| Animations | **AOS (Animate On Scroll) 2.3.1** — used **only** on the Academic/education page |
| Typewriter effect | **Typed.js 2.0.12** — used **only** on the home page |
| Fonts (Google Fonts) | Marck Script, IBM Plex Mono, Open Sans, Caveat |
| Scripting | Vanilla JavaScript (no framework). One shared script, `include.js`. |
| Analytics | Google Analytics 4 (gtag.js), measurement ID `G-ZNP698G1H1`, on every page |
| Deployment | GitHub Pages |

All third-party CSS/JS is loaded from CDNs (cdnjs / unpkg / Google Fonts). There are **no local dependencies, no `node_modules`, and no build tooling** — opening `index.html` in a browser just works.

---

## 4. File / directory structure

```
My-Website/
├── index.html              # "About" / home page
├── education.html          # "Academic" page (uses AOS animations)
├── skills.html             # "Skills" page (technical, soft skills, courses)
├── projects.html           # "Projects" page (card grid)
├── papers.html             # "Papers" page (thesis + course paper)
├── include.js              # Shared navbar + footer, injected into every page
├── README.md               # Public-facing repo readme
├── PORTFOLIO_OVERVIEW.md   # (this file) full internal reference
├── styles/
│   ├── common.css          # Shared styles (navbar, footer, chips, typography, body layout)
│   ├── index.css           # Home-page-specific styles
│   ├── education.css        # Academic-page-specific styles
│   ├── skills.css          # Skills-page-specific styles
│   ├── projects.css        # Projects-page-specific styles
│   └── papers.css          # Papers-page-specific styles
└── assets/                 # Images, logos, CV, certificates, paper PDFs
    ├── profile1.jpg              # Profile photo (also used as social-share image)
    ├── favicon.png
    ├── aust_logo.svg, mgc_logo.jpg, pms_logo.jpg   # Institution logos
    ├── bechakena1-3.png         # BechaKena project screenshots
    ├── trend1-2.png             # TrendWave project screenshots
    ├── doom1-3.png              # DoomExploder project screenshots
    ├── my_cv.pdf                # Downloadable CV
    ├── hr_certificate.png       # HackerRank certificate
    ├── BanglaGuard_Thesis_Book_Submission_29-06-2026.jpg   # Thesis team + supervisor photo (shown on the home thesis card)
    └── cse4138_soft_com_lab_term_assignment.pdf   # Course paper PDF
```

### CSS loading order (important)
Every page loads, in this order: **Bootstrap CDN → (AOS CDN, education only) → `common.css` → the page-specific CSS → Font Awesome CDN.** Because the page-specific file is loaded *after* `common.css`, it can override shared rules. Several page CSS files re-declare `.card` to restyle cards per page.

---

## 5. Shared components — `include.js`

This is the **single source of truth for the navbar and footer**. It is an IIFE that:

1. Defines `NAV_HTML` and `FOOTER_HTML` template strings.
2. Injects them **synchronously** by replacing placeholder elements (`<div id="site-nav"></div>` and `<div id="site-footer"></div>`) via `outerHTML`. Synchronous injection (no `fetch`) is deliberate: it works over `file://` and never causes layout shift after libraries like AOS measure the page.
3. Highlights the current page's nav link by comparing `location.pathname` to each link's `href` and adding the `active` class.
4. Sets the footer copyright year dynamically (`#year` → current year).
5. Adds scroll behavior: toggles a `scrolled` class on the navbar after 40px of scroll (glass-blur effect intensifies), and auto-closes the mobile nav menu on scroll when the viewport is < 992px.

### Navbar contents
- Animated brand name "Mirza Naeem Beg" — each letter is a `<span class="letter">` with a staggered `--delay` CSS variable driving a looping color-change animation.
- Three social icons (LinkedIn, X, Email) in the brand area.
- A collapsible (hamburger on mobile) nav with five links: **About → Academic → Skills → Projects → Papers** (`index.html`, `education.html`, `skills.html`, `projects.html`, `papers.html`).

### Footer contents
- Copyright line with dynamic year.
- Left column: Location (Dhaka, Bangladesh) and "Open to Opportunities" (Internships, Full-time Positions, Research Collaborations).
- Right column: "Let's Connect" with Email, LinkedIn, GitHub icon links.

> Every page must include `<div id="site-nav"></div>` near the top of `<body>` and `<div id="site-footer"></div>` before the scripts, plus `<script src="include.js"></script>`.

---

## 6. Page-by-page content

### 6.1 `index.html` — About (home)
- `<title>`: "Mirza Naeem Beg" (note: the `og:title`/`twitter:title` meta use the longer "Mirza Naeem Beg — Data & AI Portfolio").
- Uses `<main>` (no `container-fluid`) wrapping `<div class="container page-container">`.
- **Profile section:** circular profile photo, a tagline ("Ambitious ● Resilient ● Realistic"), a **Typed.js typewriter** cycling: `CSE Undergraduate`, `Data & AI/ML Enthusiast`, `Collaborator`, `Researcher`, `Developer`; social icons (GitHub, LinkedIn, X, Email); a "Download CV" button (`assets/my_cv.pdf`).
- **Description card** (`.description`, italic monospace): a humanized, first-person bio in short paragraphs — (1) greeting; (2) final year of CSE at AUST, Dhaka, **expected to graduate July 2026**; (3) **research interests**, stated explicitly for recruiters/professors — "problems where language, vision, and data meet": NLP, computer vision, large language models (LLMs), and deep learning, with a particular focus on **AI for healthcare** and **low-resource language processing** (especially Bangla) — plus the day-to-day stack (Python, PyTorch, SQL, pandas); (4) a **flexible career goal**: happy to start in just about any fresher-level data role, grow into data engineering, with the ultimate goal of becoming a **Data Scientist** or **AI Engineer**; (5) continuous self-study — professional, skill-based courses "aligned with my research interests and career goals" on Coursera and other online platforms (the specific fields are not re-listed here, to avoid repeating the research interests in item 3); (6) a closing availability statement (full-time fresher-level Data/AI role, open to remote or on-site work in Dhaka). **The CGPA is intentionally not shown on this card — it lives only on the education page.**
- **Thesis spotlight card** (`.thesis-card`, `mb-5`): a BanglaGuard thesis summary (content mirrors §6.5), laid out as **title → photo → description → bullets**. Order/details:
  - **Title** restyled as a bold modern headline — `.card-title` in **Open Sans 700**, navy (`--primary-color`), centered, with a multi-color **gradient underline** (`::after`, palette `#e95057 → #ab3e8f → #03045e → #00a989 → #dfdd19`, echoing the nav-name animation). (Note: the `text-info` class was removed from this title.)
  - **Photo** (`figure.thesis-photo` → `assets/BanglaGuard_Thesis_Book_Submission_29-06-2026.jpg`): the full, uncropped thesis-team-with-supervisor photo. Framed by a **conic-gradient border** (same multi-color palette, 4px, 8px outer radius / 5px inner) with no drop shadow (flat/grounded), a gentle hover zoom, and an **editorial caption overlaid** on a dark bottom gradient (white italic monospace): *"With our supervisor, Prof. Dr. Md. Shahriar Mahbub, and the BanglaGuard thesis team at the thesis book submission (June 2026)."*
  - **Description + bullets:** the framework summary and the model/result points (see §6.5 for the text).
- **Message-to-visitors quote** (`.visitor-quote`, a `<blockquote>` with `mb-5`): the last block on the page — a personal sign-off to every visitor: *"I always seek the kind consideration, blessings, and goodwill of each and every one of you. May Allah bless you all. 😊"* It's styled as a flat card whose background matches the page (`var(--box-bg)`, no border/shadow), with **gradient accent bars on the top and bottom edges** (navy→blue `#03045e → #0077b6`), a gradient **icon badge** (`fa-quote-left`), and a faint decorative quotation glyph. It is signed off in the bottom-right corner with *"— Mirza Naeem Beg"* (a `<footer class="quote-author">` set in the handwritten **Marck Script** font, italic, right-aligned). Being the final block, its `mb-5` provides the footer-gap trailing margin (see §8).
- Scripts: Bootstrap bundle, `include.js`, Typed.js + inline init.

### 6.2 `education.html` — Academic
- `<title>`: "Academic Background | Mirza Naeem Beg".
- Uses `<main class="container-fluid">` → `<section class="pt-5">` → `<div class="container">`.
- **AOS animations** (`data-aos="fade-up"`) on cards/headings; initialized inline with `AOS.init({ duration: 800, easing: 'ease-in-out-sine', once: true })`.
- **Undergraduate card:** AUST logo + B.Sc. in CSE, "Expected Graduation: July, 2026", "Current CGPA: 3.15 / 4.0".
- **Programme Progress / syllabus card** (`.syllabus-card`): progress note ("Completed up to 4th year 1st semester; 4th year 2nd semester (Final) ongoing"), link to AUST CSE syllabus, **Relevant Coursework** as chips (two tiers — `chip core` = applied/completed, `chip` = familiar/learning), a **credit badge** ("33 Lab & Project Credits out of 156 total"), and a GitHub button to the semester-wise lab-codes repo.
- **School cards (2-up):** HSC (Mymensingh Government College, 2020, Science, GPA 5.0/5.0) and SSC (Progressive Model School, Mymensingh, 2017, Science, GPA 5.0/5.0).

### 6.3 `skills.html` — Skills
- `<title>`: "Skills | Mirza Naeem Beg".
- Three sections, each a heading + card grid (`col-lg-6` cards):
  1. **Technical Skills** (8 cards): Programming Languages (Python, C/C++, SQL core; Java familiar); Model Development (RNNs, Training CNNs, Transfer learning core; Transformers familiar); Computer Vision; Natural Language Processing; AI/ML Tools (Jupyter, Colab, VS Code, Kaggle core; MATLAB, Miniconda familiar); Web Technologies (HTML, CSS, Bootstrap, JavaScript, TailwindCSS core; ReactJS familiar); Databases (MySQL, SQLite core; MS SQL Server familiar); Version Control (Git, GitHub).
  2. **Courses & Certifications** — two cards using `.skill-tags` (a CSS-grid of 3-line chips: name / source level / context):
     - *Completed:* CS50's Intro to Databases with SQL (Harvard), Code in Place 2024 (Stanford — has a certificate link), Python Basics & OOP (HackerRank — downloadable certificate `assets/hr_certificate.png`).
     - *In Progress & Planned:* a self-paced **AI Engineer Path** (self-study, in progress, no external link), ML & DL Specialization (Coursera — Andrew Ng, in progress), Full Stack Open (University of Helsinki, planned).
  3. **Soft Skills** (4 cards): Collaboration, Communication, Problem Solving, Research Mindset — each with a description grounded in real coursework/projects.
- Skill proficiency levels are color-coded: `intermediate` (blue), `familiar` (orange), `learning` (gray).

### 6.4 `projects.html` — Projects
- `<title>`: "Projects | Mirza Naeem Beg".
- A **responsive card grid**: one `<div class="row g-4 justify-content-center mb-5">` containing four project cards.
- **Column sizing:** first three projects use `col-12 col-md-6 col-lg-4`; the fourth (Railway) uses `col-12 col-md-6 col-lg-12`.
  - **Desktop (≥992px):** 3 cards across on row 1, Railway full-width on row 2.
  - **Tablet (768–991px):** balanced 2×2 grid.
  - **Phone (<768px):** single column.
- Cards use `h-100` + `.card { height: 100% }` so side-by-side cards match height.
- **Projects:**
  1. **BechaKena.Com (Auction Feature)** — *Solo*. E-commerce + real-time auction. Tech: HTML, CSS, Bootstrap, PHP & MySQL. Carousel of 3 screenshots. Buttons: GitHub (`CSE3100-SD-IV`), ScreenCast (YouTube).
  2. **TrendWave (Inspired by TikTok)** — *Team*. Short-video mobile app. Tech: Flutter, Dart, Firebase. Carousel of 2 screenshots. Contributions: UI/UX, Firebase + login, team coordination & presentation.
  3. **DoomExploder (An Action Game)** — *Team*. 2D action game. Tech: C/C++, iGraphics. Carousel of 3 screenshots. Contributions: collision logic, sound, graphics.
  4. **Railway Ticket Management System** — *Team*. Desktop booking system. Tech: Java, Java Swing, MySQL. (Text-only card, no carousel.)
- Each carousel is a Bootstrap carousel; images use `aspect-ratio: 18/9` and `object-fit: contain`.

### 6.5 `papers.html` — Papers
- `<title>`: "Research Papers | Mirza Naeem Beg".
- Two centered cards (`.paper-card`, `col-md-8`); the second row has `mb-5`.
  1. **BanglaGuard (Thesis · In Progress):** "A Multimodal Deep Learning Framework for Audio-Visual Detection of Inappropriate Content in Bangla Children's Cartoon Videos." Combines EfficientNet CNNs (visual), BiLSTM (temporal), and OpenAI Whisper (Bangla speech). **~72.6% accuracy on 339 clips**, dataset expansion ongoing. Supervisor: Prof. Dr. Md. Shahriar Mahbub.
  2. **Course Paper · CSE4138:** "Digital Preservation of Culinary Heritage: Classifying Bangladeshi Desserts and Generating Traditional Recipes." Classifies 4,118 dessert images across 27 categories (EfficientNet-B0 vs ResNet-18) and generates recipes from 81 authentic recipes (GPT-2 vs T5; GPT-2 best). Dataset published on Mendeley. Download Paper button → `assets/cse4138_soft_com_lab_term_assignment.pdf`.

### 6.6 External links referenced across the site
- **BechaKena repo:** `https://github.com/mirzanaeembeg/CSE3100-SD-IV`
- **BechaKena screencast:** `https://youtu.be/JnbI_pToNd4`
- **Lab & project repo (education):** `https://github.com/mirzanaeembeg/semester-wise-lab-codes`
- **AUST:** `https://aust.edu/` · **AUST CSE syllabus:** `https://aust.edu/cse/syllabus`
- **Thesis supervisor (Google Scholar):** `https://scholar.google.com/citations?user=pBArY-sAAAAJ`
- **Course-paper dataset (Mendeley):** `https://data.mendeley.com/datasets/j2pnx2mwwk/1`
- **Course links:** CS50 SQL (`https://cs50.harvard.edu/sql/`), Code in Place (`https://codeinplace.stanford.edu/`), HackerRank Python (`https://www.hackerrank.com/skills-verification/python_basic`), Coursera ML/DL Specialization (`https://www.coursera.org/specializations/machine-learning-introduction`), Full Stack Open (`https://fullstackopen.com/en/`). (The self-paced "AI Engineer Path" entry has no external link.)
- **Project walkthrough video:** `https://youtu.be/6o7jbOOSK1U`

---

## 7. Styling system & conventions

### CSS custom properties (in `common.css :root`)
- `--primary-color: #03045e` (deep navy — dominant brand color)
- `--bg-page: #eef2f7`, `--bg-footer: #eef2f7` (**page and footer backgrounds are identical** — see §8)
- `--hover-color: gray`
- Page files add their own vars, e.g. `--box-bg: #eef2f7`, skills level colors (`--intermediate`, `--familiar`, `--learning`).

### Color & theme palette
The look is built from a small navy/blue palette plus **Bootstrap contextual color classes** used consistently:

| Use | Value / class |
|-----|---------------|
| Primary brand (headings, buttons, chips, badges) | `--primary-color: #03045e` (deep navy) |
| Page & footer background | `#eef2f7` (`--bg-page`, `--bg-footer`, `--box-bg`) |
| Card **titles** | Bootstrap `text-info` (cyan) |
| Section **headings** (`<h2>`) | Bootstrap `text-success` (green) |
| Card **borders** | Bootstrap `border-info` |
| Description / desc-link accent | `#0077b6` (hover `#023e8a`) |
| Typewriter text | `#556B2F` (olive green) |
| Hover (generic) | `gray` (`--hover-color`) |
| Skill levels | `--intermediate #0056b3` (blue), `--familiar #c05c00` (orange), `--learning #5a5a5a` (gray) |
| Credit badge gradient (education) | `linear-gradient(135deg, #03045e → #0077b6)` |
| Nav brand letter animation cycle | `#e95057 → #ab3e8f → #03045e → #00a989 → #dfdd19` |

> Takeaway: titles are cyan (`text-info`), section headers are green (`text-success`), borders are `border-info`, and navy `#03045e` is the dominant accent.

### CSS reset
`index.css` and `education.css` begin with a global reset: `* { margin: 0; padding: 0; box-sizing: border-box; }`. This affects spacing math on those pages — keep it in mind when adjusting margins/padding there.

### Page-heading pattern
Every page's `<h1>` follows the same pattern: `class="intro display-6"` with a leading Font Awesome icon. `.intro` (in `common.css`) centers it, applies `--primary-color`, and a fluid `clamp()` size. Per page:

| Page | Icon class | Heading text |
|------|-----------|--------------|
| index | `fa-id-badge` | About |
| education | `fa-graduation-cap` | Academic |
| skills | `fa-code` | Skills |
| projects | `fa-folder` | Projects |
| papers | `fa-file-lines` | Papers |

### Typography
- Headings (`h1`–`h6`): Times New Roman serif, fluid `clamp()` sizes.
- Body: Open Sans.
- Monospace accents (descriptions, cards, chips, footer): IBM Plex Mono.
- Brand name: Marck Script. Handwritten skill "context" line: Caveat.
- Fluid sizing via `clamp()` is used throughout for responsive type.

### Reusable UI patterns
- **Chips (`.chip` / `.chip.core`):** two-tier tags. `.chip` = light (familiar/learning); `.chip.core` = solid navy (applied/completed). Used for coursework and technical skills.
- **Badges (`.badge-type`, `.status-badge`):** small uppercase navy pills (e.g., "Solo"/"Team", "Thesis · In Progress").
- **Cards:** each page restyles `.card` (mostly transparent background with a dashed or light border). The projects page is the exception (solid light card with `max-width`/height rules for the grid).
- **Skill tags (`.skill-tags` / `.skill-tag`):** CSS-grid (`repeat(auto-fill, minmax(175px, 1fr))`) of equal-height 3-line chips, used on the Skills "Courses & Certifications" cards.

### Animations & micro-interactions
- **Typed.js typewriter** — home page only, cycles role strings (see §6.1).
- **AOS (fade-up)** — education page only, on cards/headings, `once: true`.
- **Navbar brand color animation** — each letter of "Mirza Naeem Beg" runs a looping `@keyframes colorChange` with a staggered per-letter `--delay`; letters also lift slightly (`translateY(-2px) scale(1.1)`) on hover.
- **Navbar glass / scroll state** — the navbar uses `backdrop-filter: blur()`; scrolling past 40px adds a `scrolled` class (stronger blur + shadow), toggled in `include.js`.
- **Waving emoji** — the 👋 in the home bio uses `@keyframes wave` (`.animated-emoji`) for a repeating rotation.
- **Hover lifts** — chips, skill tags, footer/social icons, CV button, and the education GitHub button use small `translateY` + box-shadow transitions; skill tags also invert to navy background with white text on hover.
- **Profile photo** — scales to `1.05` on hover.
- **Smooth scrolling** — `html { scroll-behavior: smooth }`.

### Responsive breakpoints (Bootstrap-aligned)
- `991.98px` / `991px`: tablet adjustments; text switches to `left`/`justify` per page; nav collapses.
- `768px`: smaller skill tags, larger logos.
- `576px`: smallest-screen tweaks (tagline size, CV button margins, single-column skill grid, footer link spacing).

---

## 8. Footer & content-gap mechanism (subtle — read before editing spacing)

The body is a **flex column** with `min-height: 100vh`. The spacing between the last content block and the footer is engineered to be **identical on every page**:

1. The footer has a **fixed** `margin-top: 3rem` in `common.css` (NOT `margin-top: auto`). Using `auto` would make the footer absorb leftover vertical space, so the gap would vary with each page's height — this was a real bug that was fixed. Do **not** revert it to `auto`, and do **not** re-add Bootstrap's `mt-5` class to the footer markup (that's `margin-top: 3rem !important` and historically masked this).
2. Each page's **last content block carries a 3rem trailing margin** so totals match:
   - index: message-to-visitors quote (`.visitor-quote`) `mb-5` — now the last block, after the thesis card.
   - projects: grid row `mb-5`.
   - papers: last paper row `mb-5`.
   - education: school row `mb-4` + its columns' `mb-4` (1.5 + 1.5 = 3rem).
   - skills: soft-skills row `mb-4` + its columns' `mb-4`.
   Net: **3rem (content) + 3rem (footer) ≈ 6rem on every page.**
3. **No page-specific `main { padding-bottom }` overrides may exist.** `education.css` and `papers.css` previously had `main { padding-bottom: 2rem }` (and papers also had `main { flex: 1 0 auto }` + `html { min-height: 100% }`), which made those two pages' gaps larger — these were removed. Spacing must be governed only by `common.css`.
4. Because **footer background = page background (`#eef2f7`)**, any leftover space below the footer on short pages is the same color and visually seamless; only the footer's `border-top` line and text are visible. This is why a fixed (non-sticky) footer margin looks fine on short pages.

**Rule of thumb:** if you change card spacing, preserve the 3rem trailing margin on each page's final block, and never introduce a `main` override in a page-specific stylesheet.

---

## 9. SEO, social sharing & accessibility

- **`<meta name="robots" content="noindex, nofollow">`** on all five pages — keeps the site out of search engines (deliberate).
- Each page has a unique **`meta description`**, plus **canonical**, **Open Graph** (`og:type/title/description/image/url`), and **Twitter Card** (`summary_large_image`, `@mn_beg`) tags. The shared social-preview image is `assets/profile1.jpg`. These power link previews on LinkedIn/X/etc. (independent of search indexing).
- All external links use `target="_blank" rel="noopener"`.
- Icon-only links (nav + footer social icons, home-page social icons) have `aria-label`s.
- Images have descriptive `alt` text. `<html lang="en">` and viewport meta are present everywhere.

> If the site ever moves to a custom domain, update every `canonical` and `og:url` (currently hard-coded to `https://mirzanaeembeg.github.io/...`).

---

## 10. Known TODOs / placeholders in the code

- **skills.html** — a commented-out certificate link for "CS50's Intro to Databases with SQL" awaits a real certificate URL (currently shows plain "Completed").
- **papers.html** — a commented-out GitHub button for the CSE4138 course paper awaits a public repository URL.

### Intentionally absent (do not "helpfully" add these)
- **No `robots.txt` and no `sitemap.xml`** — omitted on purpose; the site is `noindex` (see §9), and a `robots.txt` `Disallow` could actually prevent crawlers from reading the `noindex` tag.
- **No `404.html`** custom error page.
- **No build tooling / package manager / `node_modules`** — it's a hand-written static site by design.

---

## 11. How to run / deploy

- **Run locally:** open `index.html` directly, or serve the folder (e.g. `python -m http.server 8000` then visit `http://localhost:8000`). No build step.
- **Deploy:** push to the GitHub Pages repo (`mirzanaeembeg.github.io`); the live site is `https://mirzanaeembeg.github.io/`. As a `username.github.io` repo, GitHub Pages serves it from the **root of the default branch (`main`)** — there is no `gh-pages` branch and no `/docs` folder.
- **Project screencast (walkthrough):** `https://youtu.be/6o7jbOOSK1U`.

---

## 12. Editing guidelines (for any LLM/developer touching this repo)

- **Navbar/footer:** edit only in `include.js` (applies site-wide). Don't hard-code them into pages.
- **Shared look:** put cross-page rules in `common.css`; page-only rules in the matching `styles/<page>.css` (loaded after, so it can override).
- **HTML entities:** use `&amp;` for ampersands in markup and meta content.
- **Tone of written copy:** the bio/descriptions are intentionally plain, first-person, and human — short sentences, simple words. Keep that voice; avoid corporate/AI-sounding phrasing.
- **Footer spacing:** see §8 before changing any bottom margins.
- **Claims:** only list skills/courses the owner has genuinely done; descriptions are tied to real coursework and projects.
- **Accessibility/SEO:** keep `aria-label`s on icon links, `rel="noopener"` on `target="_blank"` links, and the `noindex` meta on every page.

### Implementation quirks / gotchas
- **Row overrides:** `index.css` sets `.row { margin-right: 1px }` and `education.css` sets `.row { margin-right: 5px }` — small Bootstrap-row tweaks that can cause subtle horizontal alignment surprises. Check these before debugging row spacing on those pages.
- **`.fonts` helper:** a utility class (defined in `common.css`) that simply applies the IBM Plex Mono font; used inline throughout the markup.
- **Carousel a11y:** Bootstrap carousel controls on the projects page include `.visually-hidden` "Previous"/"Next" text for screen readers — keep it when editing carousels.
- **Download links:** the CV uses `download="m-naeem-beg-cv.pdf"` and the HackerRank certificate uses `download="hr_certificate.png"`, so they save with friendly filenames instead of opening in a tab. Preserve the `download` attribute if you touch these links.

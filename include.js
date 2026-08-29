// Shared navbar + footer for all pages — the single source of truth.
// Injected synchronously (no fetch), so it works over file:// and never
// shifts the layout after libraries like AOS have measured the page.
(function () {
    const NAV_HTML = `
<nav class="navbar navbar-expand-lg navbar-light">
    <div class="container">
        <div class="navbar-brand">
            <div class="name-container">
                <span class="nav-name">
                    <span class="letter" style="--delay: 0s">M</span>
                    <span class="letter" style="--delay: 0.2s">i</span>
                    <span class="letter" style="--delay: 0.4s">r</span>
                    <span class="letter" style="--delay: 0.6s">z</span>
                    <span class="letter" style="--delay: 0.8s">a</span>
                    <span class="letter" style="--delay: 1.0s">&nbsp;</span>
                    <span class="letter" style="--delay: 1.2s">N</span>
                    <span class="letter" style="--delay: 1.4s">a</span>
                    <span class="letter" style="--delay: 1.6s">e</span>
                    <span class="letter" style="--delay: 1.8s">e</span>
                    <span class="letter" style="--delay: 2.0s">m</span>
                    <span class="letter" style="--delay: 2.2s">&nbsp;</span>
                    <span class="letter" style="--delay: 2.4s">B</span>
                    <span class="letter" style="--delay: 2.6s">e</span>
                    <span class="letter" style="--delay: 2.8s">g</span>
                </span>
            </div>
            <div class="social-links-nav">
                <a href="https://www.linkedin.com/in/mirza-naeem-beg/" target="_blank" rel="noopener" class="nav-social-icon" aria-label="LinkedIn">
                    <i class="fab fa-linkedin"></i>
                </a>
                <a href="https://x.com/mn_beg" target="_blank" rel="noopener" class="nav-social-icon" aria-label="X (Twitter)">
                    <i class="fab fa-x-twitter"></i>
                </a>
                <a href="mailto:mirzanaeem278@gmail.com" class="nav-social-icon" aria-label="Email">
                    <i class="fas fa-envelope"></i>
                </a>
            </div>
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link" href="index.html"><i class="fs-6 fa-solid fa-id-badge"></i>
                        <span>Preface</span></a></li>
                <li class="nav-item"><a class="nav-link" href="education.html"><i class="fs-6 fa-solid fa-graduation-cap"></i>
                        <span>Academic</span></a></li>
                <li class="nav-item"><a class="nav-link" href="skills.html"><i class="fs-6 fa-solid fa-code"></i>
                        <span>Skills</span></a></li>
                <li class="nav-item"><a class="nav-link" href="projects.html"><i class="fs-6 fa-solid fa-folder"></i>
                        <span>Projects</span></a></li>
                <li class="nav-item"><a class="nav-link" href="papers.html"><i class="fs-6 fa-solid fa-file-lines"></i>
                        <span>Papers</span></a></li>
            </ul>
        </div>
    </div>
</nav>`;

    const FOOTER_HTML = `
<footer class="footer">
    <div class="container">
        <p class="text-center mb-3">&copy;
            <span id="year"></span>, Mirza Naeem Beg.
        </p>
        <div class="row">
            <div class="col-md-6 mb-3 mb-md-0">
                <p><i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> Dhaka, Bangladesh</p>
                <p><i class="fas fa-briefcase"></i> <strong>Open to Opportunities:</strong> Internships, Full-time
                    Positions, Research Collaborations.</p>
            </div>
            <div class="col-md-6">
                <p class="text-md-end"><i class="fa-solid fa-envelope-open-text"></i> <strong>Let's Connect.</strong></p>
                <div class="contact-info text-md-end">
                    <a href="mailto:mirzanaeem278@gmail.com" class="footer-link" aria-label="Email"><i class="fas fa-envelope"></i></a>
                    <a href="https://www.linkedin.com/in/mirza-naeem-beg/" class="footer-link" target="_blank" rel="noopener" aria-label="LinkedIn"><i
                            class="fab fa-linkedin"></i></a>
                    <a href="https://github.com/mirzanaeembeg" class="footer-link" target="_blank" rel="noopener" aria-label="GitHub"><i
                            class="fab fa-github"></i></a>
                </div>
            </div>
        </div>
    </div>
</footer>`;

    function inject(id, markup) {
        const host = document.getElementById(id);
        if (host) host.outerHTML = markup;
    }

    inject('site-nav', NAV_HTML);
    inject('site-footer', FOOTER_HTML);

    // Highlight the current page in the nav
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
        if (link.getAttribute('href') === page) link.classList.add('active');
    });

    // Footer year
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // Navbar scroll behaviour (glass effect + auto-close on mobile)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        const collapse = document.getElementById('navbarNav');
        if (window.innerWidth < 992 && collapse.classList.contains('show')) {
            const bs = bootstrap.Collapse.getInstance(collapse) || new bootstrap.Collapse(collapse);
            bs.hide();
        }
    });
})();

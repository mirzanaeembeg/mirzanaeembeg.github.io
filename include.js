// Injects the shared navbar and footer (partials/nav.html, partials/footer.html)
// into every page, then wires up the behaviour they need.
(async function () {
    async function inject(id, url) {
        const host = document.getElementById(id);
        if (!host) return;
        const res = await fetch(url);
        host.outerHTML = await res.text();
    }

    await inject('site-nav', 'partials/nav.html');
    await inject('site-footer', 'partials/footer.html');

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

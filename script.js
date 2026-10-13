// Small helpers: theme toggle, year, menu, section highlighting, tool logos, fade-up on scroll, print-friendly project list.
(function () {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* theme: light by default, choice saved in localStorage */
    const themeBtn = document.querySelector('.theme');
    const syncTheme = () => {
        if (!themeBtn) return;
        const label = root.getAttribute('data-theme') === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        themeBtn.setAttribute('aria-label', label);
        themeBtn.setAttribute('title', label);
    };
    if (themeBtn) themeBtn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        syncTheme();
    });
    syncTheme();

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* mobile menu */
    const nav = document.querySelector('.rail nav');
    const menuBtn = nav.querySelector('.menu-btn');
    const setMenu = (open) => {
        nav.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 62.01rem)').addEventListener('change', () => setMenu(false));

    /* active section */
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const cur = nav.querySelector('.cur');
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            links.forEach((l, i) => {
                const on = l.getAttribute('href') === '#' + e.target.id;
                l.classList.toggle('on', on);
                if (on && cur) cur.textContent = String(i + 1).padStart(2, '0') + ' ' + l.textContent.trim();
            });
        });
    }, { rootMargin: '-20% 0px -65% 0px' });
    document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));

    /* tool logos (Simple Icons, pinned version); a missing logo is simply dropped */
    const iconBase = 'https://cdn.jsdelivr.net/npm/simple-icons@13.0.0/icons/';
    document.querySelectorAll('[data-i]').forEach((el) => {
        const img = new Image(16, 16);
        img.className = 'ti';
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.onerror = () => img.remove();
        img.src = iconBase + el.dataset.i + '.svg';
        el.prepend(img);
    });

    /* fade-up on scroll, skipped entirely when the visitor prefers reduced motion */
    if (!reduce.matches && 'IntersectionObserver' in window) {
        root.classList.add('js-reveal');
        const rv = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                e.target.classList.add('in');
                rv.unobserve(e.target);
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        document.querySelectorAll('main section').forEach((s) => {
            [...s.children].forEach((el, i) => {
                el.classList.add('reveal');
                el.style.setProperty('--d', Math.min(i * 0.06, 0.3) + 's');
                rv.observe(el);
            });
        });
    }

    /* project screenshots: auto-advancing carousel (manual swipe still works; no autoplay for reduced motion) */
    if (!reduce.matches) document.querySelectorAll('.shots').forEach((box) => {
        let paused = false, visible = false, resume;
        new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(box);
        const stop = () => { paused = true; clearTimeout(resume); };
        const go = (delay) => { clearTimeout(resume); resume = setTimeout(() => { paused = false; }, delay); };
        box.addEventListener('pointerenter', stop); box.addEventListener('pointerleave', () => go(300));
        box.addEventListener('focusin', stop); box.addEventListener('focusout', () => go(300));
        box.addEventListener('touchstart', stop, { passive: true }); box.addEventListener('touchend', () => go(4000));
        setInterval(() => {
            if (paused || !visible || box.children.length < 2) return;
            const gap = parseFloat(getComputedStyle(box).columnGap) || 0;
            const end = box.scrollWidth - box.clientWidth - 4;
            if (box.scrollLeft >= end) box.scrollTo({ left: 0, behavior: 'smooth' });
            else box.scrollBy({ left: box.children[0].offsetWidth + gap, behavior: 'smooth' });
        }, 3500);
    });

    window.addEventListener('beforeprint', () => document.querySelectorAll('details').forEach((d) => d.setAttribute('open', '')));
})();

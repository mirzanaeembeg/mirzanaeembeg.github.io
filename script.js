// Small helpers: theme toggle, year, menu, section highlighting, fade-up on scroll, print-friendly project list.
(function () {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let revealObserver;
    const revealOnScroll = (elements) => {
        if (!revealObserver) return;
        elements.forEach((element, index) => {
            if (element.classList.contains('reveal')) return;
            element.classList.add('reveal');
            element.style.setProperty('--d', Math.min(index * 0.06, 0.3) + 's');
            revealObserver.observe(element);
        });
    };

    if (!reduce.matches && 'IntersectionObserver' in window) {
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('in');
                revealObserver.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        root.classList.add('js-reveal');
        document.addEventListener('focusin', (event) => {
            const target = event.target.closest('.reveal:not(.in)');
            if (!target) return;
            target.classList.add('in');
            revealObserver.unobserve(target);
        });
    }

    /* theme: light by default, choice saved in localStorage */
    const themeBtns = document.querySelectorAll('.theme');
    const syncTheme = () => {
        const label = root.getAttribute('data-theme') === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        themeBtns.forEach((button) => {
            button.setAttribute('aria-label', label);
            button.setAttribute('title', label);
        });
    };
    themeBtns.forEach((button) => button.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        syncTheme();
    }));
    syncTheme();

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* reading progress */
    const progress = document.querySelector('.reading-progress span');
    let progressFrame = 0;
    const updateProgress = () => {
        if (!progress || progressFrame) return;
        progressFrame = requestAnimationFrame(() => {
            const available = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.transform = `scaleX(${available > 0 ? window.scrollY / available : 0})`;
            progressFrame = 0;
        });
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    /* project screenshot carousel; also used when a project mounts on scroll */
    const carouselBoxes = new WeakSet();
    const setupCarousel = (box) => {
        if (reduce.matches || carouselBoxes.has(box)) return;
        carouselBoxes.add(box);
        let paused = false, visible = false, resume;
        new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }).observe(box);
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
    };

    /* project search and team filters */
    const explorer = document.querySelector('.project-explorer');
    const projectList = document.querySelector('.projects');
    if (explorer && projectList) {
        const projectItems = [...projectList.querySelectorAll('details[data-project-type]')].map((element) => ({
            element,
            type: element.dataset.projectType,
            searchText: element.textContent.toLocaleLowerCase(),
            placeholder: null,
            template: null
        }));
        const search = explorer.querySelector('input[type="search"]');
        const filters = [...explorer.querySelectorAll('.project-filter')];
        const count = explorer.querySelector('.project-count');
        let activeFilter = 'all';
        let projectObserver;

        const mountProject = (item) => {
            if (!item.placeholder) return;
            projectObserver?.unobserve(item.placeholder);
            item.placeholder.replaceWith(item.element);
            item.placeholder = null;
            item.template.remove();
            item.template = null;
            revealOnScroll([item.element, ...item.element.querySelectorAll('.body > *')]);
            item.element.querySelectorAll('.shots').forEach(setupCarousel);
        };

        if ('IntersectionObserver' in window) {
            projectObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    mountProject(entry.target.projectItem);
                });
            }, { rootMargin: '250px 0px' });

            projectItems.slice(1).forEach((item) => {
                item.template = document.createElement('template');
                item.template.content.append(item.element);
                item.placeholder = document.createElement('div');
                item.placeholder.className = 'project-loading';
                item.placeholder.setAttribute('aria-hidden', 'true');
                item.placeholder.textContent = 'Project details load as you scroll';
                item.placeholder.projectItem = item;
                item.template.dataset.projectTemplate = '';
                projectList.append(item.placeholder, item.template);
                projectObserver.observe(item.placeholder);
            });
        } else {
            projectItems.slice(1).forEach((item) => setupCarousel(item.element.querySelector('.shots')));
        }

        const filterProjects = () => {
            const query = search.value.trim().toLocaleLowerCase();
            let visible = 0;
            projectItems.forEach((item) => {
                const matchesType = activeFilter === 'all' || item.type === activeFilter;
                const matchesQuery = !query || item.searchText.includes(query);
                const matches = matchesType && matchesQuery;
                if (item.placeholder) {
                    item.placeholder.hidden = !matches;
                    if (matches && query) mountProject(item);
                } else {
                    item.element.hidden = !matches;
                }
                if (matches) visible += 1;
            });
            count.textContent = visible
                ? `Showing ${visible} of ${projectItems.length} projects`
                : 'No projects match. Try another search or filter.';
        };

        filters.forEach((button) => button.addEventListener('click', () => {
            activeFilter = button.dataset.filter;
            filters.forEach((filter) => {
                const selected = filter === button;
                filter.classList.toggle('active', selected);
                filter.setAttribute('aria-pressed', String(selected));
            });
            filterProjects();
        }));
        search.addEventListener('input', filterProjects);
        explorer.hidden = false;
        filterProjects();
        if (!('IntersectionObserver' in window)) {
            projectItems.slice(1).forEach(mountProject);
        }
    }

    /* count-up stats once they enter view; reduced-motion users see the final values */
    const stats = document.querySelector('.stats');
    const statValues = [...document.querySelectorAll('.stats [data-count]')];
    const showStats = () => statValues.forEach((value) => {
        const target = Number(value.dataset.count);
        if (!Number.isFinite(target)) return;
        if (reduce.matches) {
            value.textContent = String(target);
            return;
        }
        const duration = 850;
        const start = performance.now();
        value.textContent = '0';
        const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            value.textContent = String(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    });
    if (stats && statValues.length) {
        if ('IntersectionObserver' in window) {
            const statsObserver = new IntersectionObserver((entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                showStats();
                statsObserver.disconnect();
            }, { threshold: 0.5 });
            statsObserver.observe(stats);
        } else {
            showStats();
        }
    }

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

    /* AOS-style reveals for section content and repeated content groups */
    revealOnScroll(document.querySelectorAll([
        'main section > :not(.projects)',
        '.timeline > li',
        '.tools-grid > *',
        '.traits > *',
        '.courses > li',
        '#papers > .paper',
        '.projects > details',
        '.body > *'
    ].join(',')));

    /* project screenshots: manual swipe still works when autoplay is reduced */
    document.querySelectorAll('.shots').forEach(setupCarousel);

    window.addEventListener('beforeprint', () => document.querySelectorAll('details').forEach((d) => d.setAttribute('open', '')));
})();

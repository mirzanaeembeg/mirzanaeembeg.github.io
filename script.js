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

    /* idea scene: avatar, comic bubble and branching code diagram, scrubbed by scroll position */
    const scene = document.getElementById('idea-scene');
    if (scene && !reduce.matches) {
        root.classList.add('idea-anim');
        const stage = scene.querySelector('.idea-stage');
        const clamp = (v) => Math.min(1, Math.max(0, v));
        const seg = (p, a, b) => clamp((p - a) / (b - a));
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const back = (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);
        const lenC = scene.querySelector('.chip').textContent.length;
        const lenA = scene.querySelector('.br-a .code').textContent.length;
        const lenB = scene.querySelector('.br-b .code').textContent.length;
        const typed = (t, len) => Math.round(t * len) / len;
        let forced = false, completed = false, frame = 0;

        const render = () => {
            frame = 0;
            let p = 1;
            if (!forced && !completed) {
                const vh = window.innerHeight;
                const top = scene.getBoundingClientRect().top;
                const stickTop = parseFloat(getComputedStyle(stage).top) || 0;
                const start = vh * 0.6;                                   /* avatar begins as the scene scrolls into view */
                const end = stickTop - (scene.offsetHeight - stage.offsetHeight);
                p = clamp((start - top) / (start - end));
            }
            const q = p * 0.78;                                          /* phases finish near p = .92, then a short pause */
            const v = {
                av: easeOut(seg(q, 0.00, 0.08)),
                bub: back(seg(q, 0.10, 0.18)),
                ct: typed(seg(q, 0.20, 0.32), lenC),
                st: seg(q, 0.32, 0.38),
                vb: seg(q, 0.38, 0.44),
                la: seg(q, 0.44, 0.49),
                lb: seg(q, 0.44, 0.49),
                ta: typed(seg(q, 0.49, 0.57), lenA),
                tb: typed(seg(q, 0.53, 0.61), lenB),
                ara: seg(q, 0.57, 0.63),
                arb: seg(q, 0.61, 0.67),
                ia: back(seg(q, 0.63, 0.68)),
                ib: back(seg(q, 0.67, 0.72))
            };
            if (!forced && v.ib >= 1) completed = true;
            for (const key in v) scene.style.setProperty('--' + key, v[key].toFixed(4));
            scene.classList.toggle('ready-a', v.ia > 0.9);
            scene.classList.toggle('ready-b', v.ib > 0.9);
            scene.classList.toggle('typing-c', v.ct > 0 && v.ct < 1);
            scene.classList.toggle('typing-a', v.ta > 0 && v.ta < 1);
            scene.classList.toggle('typing-b', v.tb > 0 && v.tb < 1);
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        /* keyboard users tabbing into the diagram, and printing, see the finished state */
        scene.addEventListener('focusin', () => { forced = true; schedule(); });
        scene.addEventListener('focusout', () => { forced = false; schedule(); });
        window.addEventListener('beforeprint', () => { forced = true; render(); });
        window.addEventListener('afterprint', () => { forced = false; render(); });
        render();
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
        'main section > :not(.projects):not(.idea-scene)',
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

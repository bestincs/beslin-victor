import { theme } from '../../common/theme.js';
import { basicAnimation, openAnimation } from '../../libs/confetti.js';

export const guest = (() => {

    /**
     * @returns {void}
     */
    const countDownDate = () => {
        const until = document.getElementById('count-down')?.getAttribute('data-time')?.replace(' ', 'T');
        if (!until) {
            alert('invalid count down date.');
            return;
        }

        const count = (new Date(until)).getTime();

        setInterval(() => {
            const distance = Math.abs(count - Date.now());

            document.getElementById('day').innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString();
            document.getElementById('hour').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString();
            document.getElementById('minute').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString();
            document.getElementById('second').innerText = Math.floor((distance % (1000 * 60)) / 1000).toString();
        }, 1000);
    };

    /**
     * @returns {void}
     */
    const showGuestName = () => {
        const raw = window.location.search.split('to=');
        let name = null;

        if (raw.length > 1 && raw[1].length >= 1) {
            name = window.decodeURIComponent(raw[1]);
        }

        if (name) {
            const guestName = document.getElementById('guest-name');
            const div = document.createElement('div');
            div.classList.add('m-2');
            div.innerHTML = `<small class="mt-0 mb-1 mx-0 p-0">${guestName?.getAttribute('data-message')}</small><p class="m-0 p-0" style="font-size: 1.5rem">${name}</p>`;

            guestName?.appendChild(div);
        }

        const form = document.getElementById('form-name');
        if (form) {
            form.value = name;
        }
    };

    /**
     * @returns {void}
     */
    const slide = () => {
        let index = 0;
        const slides = document.querySelectorAll('.slide-desktop');

        slides.forEach((s, i) => {
            if (i === index) {
                s.classList.add('slide-desktop-active');
                s.style.opacity = '1';
            }
        });

        const nextSlide = () => {
            slides[index].style.opacity = '0';
            slides[index].classList.remove('slide-desktop-active');

            index = (index + 1) % slides.length;

            slides[index].classList.add('slide-desktop-active');
            slides[index].style.opacity = '1';
        };

        setInterval(nextSlide, 6000);
    };

    /**
     * @param {HTMLButtonElement} button
     * @returns {void}
     */
    const open = (button) => {
        button.disabled = true;
        document.body.scrollIntoView({ behavior: 'instant' });
        document.dispatchEvent(new Event('undangan.open'));

        if (theme.isAutoMode()) {
            document.getElementById('button-theme').style.display = 'block';
        }

        slide();

        // Play local audio directly
        const audioEl = document.getElementById('background-audio');
        if (audioEl) {
            audioEl.play();
        }

        theme.spyTop();

        basicAnimation();
        setTimeout(openAnimation, 1500);
        document.getElementById('welcome').style.opacity = '0';
        document.getElementById('welcome').remove();
    };

    /**
     * @param {HTMLImageElement} img
     * @returns {void}
     */
    const modal = (img) => {
        const m = document.getElementById('show-modal-image');
        m.src = img.src;
        m.width = img.width;
        m.height = img.height;
        bs.modal('modal-image').show();
    };

    /**
     * @returns {void}
     */
    const normalizeArabicFont = () => {
        document.querySelectorAll('.font-arabic').forEach((el) => {
            el.innerHTML = String(el.innerHTML).normalize('NFC');
        });
    };

    /**
     * @returns {void}
     */
    const animateSvg = () => {
        document.querySelectorAll('svg').forEach((el) => {
            setTimeout(() => el.classList.add(el.getAttribute('data-class')), parseInt(el.getAttribute('data-time')));
        });
    };

    /**
     * @returns {void}
     */
    const buildGoogleCalendar = () => {
        const formatDate = (d) => (new Date(d + ':00Z')).toISOString().replace(/[-:]/g, '').split('.')[0];

        const url = new URL('https://calendar.google.com/calendar/render');
        const data = {
            action: 'TEMPLATE',
            text: 'The Wedding of Wahyu and Riski',
            dates: `${formatDate('2023-03-15 10:00')}/${formatDate('2023-03-15 11:00')}`,
            details: 'Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami. Terima kasih atas perhatian dan doa restu Anda, yang menjadi kebahagiaan serta kehormatan besar bagi kami.',
            location: 'https://goo.gl/maps/ALZR6FJZU3kxVwN86',
            ctz: 'Asia/Jakarta',
        };

        Object.entries(data).forEach(([k, v]) => url.searchParams.set(k, v));

        document.querySelector('#home button')?.addEventListener('click', () => window.open(url, '_blank'));
    };

    /**
     * @returns {Promise<void>}
     */
    const booting = async () => {
        animateSvg();
        countDownDate();
        showGuestName();
        normalizeArabicFont();
        buildGoogleCalendar();
        document.getElementById('root').style.opacity = '1';

        window.AOS.init();
        document.body.scrollIntoView({ behavior: 'instant' });

        document.getElementById('welcome').style.opacity = '1';
        document.getElementById('loading').style.opacity = '0';
        document.getElementById('loading').remove();
    };

    /**
     * @returns {void}
     */
    const domLoaded = () => {
        theme.init();

        // Directly initialize the application without waiting for progress events
        booting();

        document.addEventListener('hide.bs.modal', () => document.activeElement?.blur());
    };

    /**
     * @returns {object}
     */
    const init = () => {
        window.addEventListener('DOMContentLoaded', domLoaded);

        return {
            guest: {
                open,
                modal,
            },
        };
    };

    return {
        init,
    };
})();
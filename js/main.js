(function () {
    'use strict';

    const PAGES = {
        index: 'index.html',
        login: 'login.html',
        registro: 'registro.html',
        reportes: 'reportes.html',
        crearReporte: 'crear-reporte.html'
    };

    const THEME_KEY = 'ayudaya_theme';
    const REPORTS_KEY = 'ayudaya_reports';

    const CATEGORY_LABELS = {
        bache: 'Bache',
        alumbrado: 'Alumbrado',
        inseguridad: 'Inseguridad',
        convivencia: 'Convivencia vecinal'
    };

    const CATEGORY_BADGE_CLASS = {
        bache: 'badge--category-bache',
        alumbrado: 'badge--category-alumbrado',
        inseguridad: 'badge--category-inseguridad',
        convivencia: 'badge--category-convivencia'
    };

    // Trazos internos de los iconos SVG que el JS necesita insertar.
    // El <svg> contenedor ya existe en el HTML; acá solo se cambia su contenido.
    const ICON_MOON = '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>';
    const ICON_SUN = '<circle cx="12" cy="12" r="4"/>' +
        '<path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4' +
        'M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>';

    const ICON_PIN = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 21s7-6.6 7-11a7 7 0 1 0-14 0c0 4.4 7 11 7 11z"/>' +
        '<circle cx="12" cy="10" r="2.5"/></svg>';

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function formatDate(date) {
        return pad(date.getDate()) + '/' + pad(date.getMonth() + 1) + '/' + date.getFullYear();
    }

    function setActiveNav() {
        const current = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.navbar__item[href]').forEach(function (item) {
            const href = item.getAttribute('href');
            if (href === current) {
                item.classList.add('navbar__item--active');
                item.setAttribute('aria-current', 'page');
            } else {
                item.classList.remove('navbar__item--active');
                item.removeAttribute('aria-current');
            }
        });
    }

    function showError(input, errorEl, message) {
        input.classList.add('form__input--error');
        input.setAttribute('aria-invalid', 'true');
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    function clearError(input, errorEl) {
        input.classList.remove('form__input--error');
        input.removeAttribute('aria-invalid');
        if (errorEl) {
            errorEl.textContent = '';
        }
    }

    function validateField(input, errorEl, validator) {
        const value = input.value.trim();
        const result = validator(value);
        if (!result.valid) {
            showError(input, errorEl, result.message);
            return false;
        }
        clearError(input, errorEl);
        return true;
    }

    function setupLoginForm() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        const userInput = document.getElementById('login-user');
        const passInput = document.getElementById('login-pass');
        const userError = document.getElementById('login-user-error');
        const passError = document.getElementById('login-pass-error');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            isValid = validateField(userInput, userError, function (value) {
                if (value.length < 3) return { valid: false, message: 'Ingresa tu usuario' };
                return { valid: true };
            }) && isValid;

            isValid = validateField(passInput, passError, function (value) {
                if (value.length < 6) return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
                return { valid: true };
            }) && isValid;

            if (isValid) {
                showFormSuccess(form, 'Ingresando...');
                setTimeout(function () {
                    window.location.href = PAGES.reportes;
                }, 800);
            }
        });

        userInput.addEventListener('input', function () {
            clearError(userInput, userError);
        });
        passInput.addEventListener('input', function () {
            clearError(passInput, passError);
        });
    }

    function setupRegisterForm() {
        const form = document.getElementById('registerForm');
        if (!form) return;

        const nameInput = document.getElementById('reg-name');
        const userInput = document.getElementById('reg-user');
        const emailInput = document.getElementById('reg-email');
        const passInput = document.getElementById('reg-pass');
        const passConfirmInput = document.getElementById('reg-pass-confirm');

        const nameError = document.getElementById('reg-name-error');
        const userError = document.getElementById('reg-user-error');
        const emailError = document.getElementById('reg-email-error');
        const passError = document.getElementById('reg-pass-error');
        const passConfirmError = document.getElementById('reg-pass-confirm-error');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            isValid = validateField(nameInput, nameError, function (value) {
                if (value.trim().length < 3) return { valid: false, message: 'Ingresa tu nombre completo' };
                return { valid: true };
            }) && isValid;

            isValid = validateField(userInput, userError, function (value) {
                if (value.trim().length < 3) return { valid: false, message: 'El usuario debe tener al menos 3 caracteres' };
                return { valid: true };
            }) && isValid;

            isValid = validateField(emailInput, emailError, function (value) {
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return { valid: false, message: 'Ingresa un correo electrónico válido' };
                return { valid: true };
            }) && isValid;

            isValid = validateField(passInput, passError, function (value) {
                if (value.length < 6) return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
                return { valid: true };
            }) && isValid;

            isValid = validateField(passConfirmInput, passConfirmError, function (value) {
                if (value !== passInput.value || value === '') return { valid: false, message: 'Las contraseñas no coinciden' };
                return { valid: true };
            }) && isValid;

            if (isValid) {
                showFormSuccess(form, 'Cuenta creada correctamente. Redirigiendo al login...');
                setTimeout(function () {
                    window.location.href = PAGES.login;
                }, 1200);
            }
        });

        var inputs = [nameInput, userInput, emailInput, passInput, passConfirmInput];
        var errors = [nameError, userError, emailError, passError, passConfirmError];
        inputs.forEach(function (input, index) {
            input.addEventListener('input', function () {
                clearError(input, errors[index]);
            });
        });
    }

    function getPhotoDataUrl(label) {
        const img = label && label.querySelector('img');
        return img ? img.getAttribute('src') : null;
    }

    function setupPhotoPreview() {
        const input = document.getElementById('report-photo');
        const label = document.getElementById('reportPhotoLabel');
        if (!input || !label) return;

        input.addEventListener('change', function () {
            const file = input.files && input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function () {
                label.classList.add('placeholder-visual--filled');
                label.innerHTML =
                    '<img class="placeholder-visual__preview" src="' + reader.result + '" alt="Vista previa de la foto seleccionada">' +
                    '<span>' + escapeHtml(file.name) + ' · Toca para cambiar</span>';
            };
            reader.readAsDataURL(file);
        });
    }

    // Muestra el mini mapa centrado en las coordenadas dadas.
    // Usa el mapa embebido de OpenStreetMap: no necesita clave de API ni
    // cargar ninguna librería, solo conexión para descargar las imágenes.
    function showLocationMap(lat, lng) {
        const map = document.getElementById('reportMap');
        if (!map) return;

        if (!navigator.onLine) {
            map.classList.remove('location-map--visible');
            return;
        }

        const margen = 0.004;
        const bbox = [
            (lng - margen).toFixed(5),
            (lat - margen).toFixed(5),
            (lng + margen).toFixed(5),
            (lat + margen).toFixed(5)
        ].join(',');

        map.src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + bbox +
            '&layer=mapnik&marker=' + lat.toFixed(5) + ',' + lng.toFixed(5);
        map.classList.add('location-map--visible');
    }

    function setupLocationField() {
        const btn = document.getElementById('useLocationBtn');
        const input = document.getElementById('report-location');
        const status = document.getElementById('report-location-status');
        if (!btn || !input) return;

        btn.addEventListener('click', function () {
            if (!('geolocation' in navigator)) {
                if (status) {
                    status.classList.remove('location-status--ok');
                    status.textContent = 'Tu navegador no soporta geolocalización. Escribe la ubicación manualmente.';
                }
                return;
            }

            btn.disabled = true;
            if (status) {
                status.classList.remove('location-status--ok');
                status.textContent = 'Obteniendo tu ubicación...';
            }

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    input.value = 'Lat ' + lat.toFixed(5) + ', Lng ' + lng.toFixed(5);
                    clearError(input, document.getElementById('report-map-error'));
                    if (status) {
                        status.classList.add('location-status--ok');
                        status.textContent = navigator.onLine
                            ? 'Ubicación actual detectada.'
                            : 'Ubicación guardada. El mapa se verá cuando haya conexión.';
                    }
                    showLocationMap(lat, lng);
                    btn.disabled = false;
                },
                function () {
                    if (status) {
                        status.classList.remove('location-status--ok');
                        status.textContent = 'No se pudo obtener tu ubicación. Escríbela manualmente.';
                    }
                    btn.disabled = false;
                },
                { timeout: 8000 }
            );
        });
    }

    // Preselecciona la categoría cuando se llega desde una tarjeta del inicio
    // (por ejemplo crear-reporte.html?categoria=bache).
    function applyCategoryFromUrl(categoryInput) {
        if (!categoryInput) return;

        let categoria;
        try {
            categoria = new URLSearchParams(window.location.search).get('categoria');
        } catch (e) {
            return;
        }

        if (categoria && Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, categoria)) {
            categoryInput.value = categoria;
        }
    }

    function setupCreateReportForm() {
        const form = document.getElementById('createReportForm');
        if (!form) return;

        const titleInput = document.getElementById('report-title');
        const categoryInput = document.getElementById('report-category');
        const descriptionInput = document.getElementById('report-description');
        const locationInput = document.getElementById('report-location');
        const photoLabel = document.getElementById('reportPhotoLabel');

        const titleError = document.getElementById('report-title-error');
        const categoryError = document.getElementById('report-category-error');
        const descriptionError = document.getElementById('report-description-error');

        applyCategoryFromUrl(categoryInput);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            isValid = validateField(titleInput, titleError, function (value) {
                if (value.trim().length < 5) return { valid: false, message: 'El título debe tener al menos 5 caracteres' };
                return { valid: true };
            }) && isValid;

            isValid = validateField(categoryInput, categoryError, function (value) {
                if (!value) return { valid: false, message: 'Selecciona una categoría' };
                return { valid: true };
            }) && isValid;

            isValid = validateField(descriptionInput, descriptionError, function (value) {
                if (value.trim().length < 10) return { valid: false, message: 'La descripción debe tener al menos 10 caracteres' };
                return { valid: true };
            }) && isValid;

            if (isValid) {
                saveUserReport({
                    title: titleInput.value.trim(),
                    category: categoryInput.value,
                    description: descriptionInput.value.trim(),
                    location: locationInput ? locationInput.value.trim() : '',
                    photo: getPhotoDataUrl(photoLabel),
                    date: formatDate(new Date())
                });

                showFormSuccess(form, 'Reporte enviado correctamente. Redirigiendo...');
                setTimeout(function () {
                    window.location.href = PAGES.reportes;
                }, 1200);
            }
        });

        var inputs = [titleInput, categoryInput, descriptionInput];
        var errors = [titleError, categoryError, descriptionError];
        inputs.forEach(function (input, index) {
            if (!input) return;
            input.addEventListener('change', function () {
                clearError(input, errors[index]);
            });
            input.addEventListener('input', function () {
                clearError(input, errors[index]);
            });
        });
    }

    function loadUserReports() {
        try {
            const raw = localStorage.getItem(REPORTS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveUserReport(report) {
        try {
            const reports = loadUserReports();
            reports.push(report);
            localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
        } catch (e) {}
    }

    function renderUserReports() {
        const list = document.querySelector('.list');
        if (!list) return;

        const reports = loadUserReports();
        if (!reports.length) return;

        reports.slice().reverse().forEach(function (report) {
            const article = document.createElement('article');
            article.className = 'report-card report-card--highlight';

            const categoryClass = CATEGORY_BADGE_CLASS[report.category] || 'badge--category-bache';
            const categoryLabel = CATEGORY_LABELS[report.category] || report.category;
            const photoHtml = report.photo
                ? '<img class="report-card__photo" src="' + report.photo + '" alt="Foto adjunta del reporte">'
                : '';

            article.innerHTML =
                '<div class="report-card__header">' +
                    '<div class="report-card__title">' + escapeHtml(report.title) + '</div>' +
                    '<span class="badge badge--status-pending">Pendiente</span>' +
                '</div>' +
                photoHtml +
                '<div class="report-card__meta">' +
                    '<span class="badge ' + categoryClass + '">' + escapeHtml(categoryLabel) + '</span>' +
                    '<span class="report-card__date">' + escapeHtml(report.date) + '</span>' +
                '</div>' +
                '<div class="report-card__location">' + ICON_PIN + ' ' + escapeHtml(report.location || 'Ubicación no especificada') + '</div>';

            list.insertBefore(article, list.firstChild);
        });
    }

    function setupThemeToggle() {
        const btn = document.getElementById('themeToggle');
        const icon = document.getElementById('themeToggleIcon');
        if (!btn) return;

        function syncIcon() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            btn.setAttribute('aria-pressed', String(isDark));
            if (icon) icon.innerHTML = isDark ? ICON_SUN : ICON_MOON;
        }

        syncIcon();

        btn.addEventListener('click', function () {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
            try {
                localStorage.setItem(THEME_KEY, isDark ? 'light' : 'dark');
            } catch (e) {}
            syncIcon();
        });
    }

    // Registra el service worker que permite usar la app sin internet.
    // Ojo: los service workers no funcionan con file://, solo con http(s).
    function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        if (window.location.protocol === 'file:') return;

        navigator.serviceWorker.register('sw.js').catch(function () {});
    }

    // Muestra un aviso cuando el dispositivo se queda sin conexión.
    function setupOfflineIndicator() {
        const banner = document.createElement('div');
        banner.className = 'offline-banner';
        banner.setAttribute('role', 'status');
        banner.textContent = 'Sin conexión — puedes seguir creando reportes, se guardan en tu dispositivo.';
        document.body.appendChild(banner);

        function sync() {
            banner.classList.toggle('offline-banner--visible', !navigator.onLine);
        }

        window.addEventListener('online', sync);
        window.addEventListener('offline', sync);
        sync();
    }

    function showFormSuccess(form, message) {
        var btn = form.querySelector('.btn--primary');
        if (btn) {
            var originalText = btn.textContent;
            btn.textContent = message;
            btn.disabled = true;
            setTimeout(function () {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
        }
    }

    function init() {
        setActiveNav();
        setupThemeToggle();
        setupLoginForm();
        setupRegisterForm();
        setupCreateReportForm();
        setupPhotoPreview();
        setupLocationField();
        renderUserReports();
        setupOfflineIndicator();
        registerServiceWorker();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

import { loadPlugins, loadChangelog } from './main.js';

// Словарь, который связывает URL с файлом контента
const routes = {
    '/': 'pages/home.html',
    '/plugins': 'pages/plugins.html',
    '/changelog': 'pages/changelog.html',
    '/documentation': 'pages/documentation.html'
};

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const routeFile = routes[path] || routes['/']; // Если путь не найден, показываем главную

    // 1. Загружаем нужный HTML-контент
    const html = await fetch(routeFile).then((data) => data.text());
    
    // 2. Вставляем его в главный контейнер на index.html
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = html;
    // Даем небольшую задержку, чтобы DOM успел обновиться перед запуском скриптов
    await new Promise(r => setTimeout(r, 0));


    // 3. После загрузки контента, вызываем скрипты для этой страницы, если они нужны
    if (path === '/plugins') {
        loadPlugins();
    }
    if (path === '/changelog') {
        loadChangelog();
    }
    
    // 4. Обновляем активную ссылку в меню
    updateActiveNavLinks();
};

const updateActiveNavLinks = () => {
    const path = window.location.pathname;
    document.querySelectorAll('nav a.nav-link').forEach(link => {
        // Условие для главной страницы: path должен быть ровно "/"
        const isActive = (path === '/' && link.pathname === '/') || (path !== '/' && link.pathname === path);

        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};


// Вешаем обработчик на все клики
document.addEventListener('click', (e) => {
    // Проверяем, что кликнули именно на ссылку в навигации
    const navLink = e.target.closest('a.nav-link');
    if (navLink) {
        route(e);
    }
});


// Обрабатываем навигацию по истории браузера (кнопки "вперед/назад")
window.onpopstate = handleLocation;
// Загружаем контент для текущего URL при первой загрузке страницы
window.addEventListener('DOMContentLoaded', handleLocation);
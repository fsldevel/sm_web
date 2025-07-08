// Функции теперь экспортируются, чтобы router.js мог их вызывать
export async function loadPlugins() {
    try {
        const response = await fetch('data/plugins.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const plugins = await response.json();
        const container = document.getElementById('plugins-container');
        
        container.innerHTML = ''; 

        plugins.forEach((plugin, index) => {
            const pluginCard = document.createElement('div');
            pluginCard.className = 'plugin-card';
            pluginCard.style.animationDelay = `${index * 0.1}s`;
            
            // Этот блок кода ищет ключи name, description, и download_url.
            // Они должны точно совпадать с теми, что в файле plugins.json.
            pluginCard.innerHTML = `
                <h3>${plugin.name}</h3>
                <p>${plugin.description}</p>
                <a href="${plugin.download_url}" class="btn btn-primary" download>
                    Скачать
                </a>
            `;
            container.appendChild(pluginCard);
        });
    } catch (error) {
        console.error('Ошибка загрузки плагинов:', error);
        const container = document.getElementById('plugins-container');
        if(container) container.innerHTML = '<p>Не удалось загрузить список плагинов. Проверьте консоль (F12) на наличие ошибок.</p>';
    }
}

export async function loadChangelog() {
    try {
        const response = await fetch('data/changelog.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const changelog = await response.json();
        const container = document.getElementById('changelog-container');

        container.innerHTML = '';

        changelog.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'changelog-item';
            item.style.animationDelay = `${index * 0.1}s`;
            
            let changesHTML = '<ul>';
            entry.changes.forEach(change => {
                changesHTML += `<li class="tag-${change.type}">${change.text}</li>`;
            });
            changesHTML += '</ul>';

            item.innerHTML = `
                <div class="changelog-header">
                    <h2>Версия ${entry.version}</h2>
                    <span class="date">${entry.date}</span>
                </div>
                ${changesHTML}
            `;
            container.appendChild(item);
        });
    } catch (error) {
        console.error('Ошибка загрузки списка изменений:', error);
        const container = document.getElementById('changelog-container');
        if(container) container.innerHTML = '<p>Не удалось загрузить историю изменений.</p>';
    }
}

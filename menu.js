document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.hub-header');
    const navMenuOriginal = document.querySelector('.nav-plataformas');
    
    // Só executa se os elementos existirem e a tela for mobile
    if (header && navMenuOriginal && window.innerWidth <= 800) {
        
        // 1. Cria o botão 3 barras no header
        const btnMobile = document.createElement('button');
        btnMobile.className = 'mobile-menu-btn';
        btnMobile.innerHTML = '<span></span><span></span><span></span>';
        header.appendChild(btnMobile);

        // 2. Cria o container do novo menu mobile (Tela Cheia)
        const menuMobile = document.createElement('div');
        menuMobile.className = 'mobile-menu-overlay';
        menuMobile.id = 'mobile-menu-overlay';

        // Pega os links corretos (para funcionar na Home e em Details)
        const isSubpasta = window.location.pathname.includes('/detalhes/');
        const base = isSubpasta ? '../' : '';

        menuMobile.innerHTML = `
            <div class="mobile-menu-header">
                <div class="menu-logo">ZER0 STORE</div>
                <button class="mobile-close-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div class="menu-grid">
                <a href="${base}loja.html?p=pc">PC</a>
                <a href="${base}loja.html?p=ps5">PS5</a>
                <a href="${base}loja.html?p=ps4">PS4</a>
                <a href="${base}loja.html?p=ps3">PS3</a>
            </div>

            <div class="menu-list">
                <a href="${base}loja.html?p=ps2">PS2</a>
                <a href="${base}loja.html?p=psp">PSP</a>
                <a href="${base}loja.html?p=xbox">XBOX</a>
                <a href="${base}loja.html?p=apps">APPS</a>
                <a href="${base}loja.html?p=themes">THEMES</a>
                <a href="${base}loja.html?p=emulators">EMULATORS</a>
                <a href="${base}loja.html?p=dlc">DLCs</a>
                <a href="${base}loja.html?p=updates">UPDATES</a>
            </div>

            <div class="menu-actions">
                <a href="${base}jb.html" class="btn-desbloquear">PS4 Jailbreak</a>
                <a href="https://discord.gg/seu-link" target="_blank" class="btn-discord"><i class="fa-brands fa-discord"></i> Entrar no Discord</a>
            </div>
        `;

        document.body.appendChild(menuMobile);

        // 3. Lógica de Abrir e Fechar
        const btnClose = menuMobile.querySelector('.mobile-close-btn');

        btnMobile.addEventListener('click', () => {
            menuMobile.classList.add('open');
            btnMobile.style.display = 'none'; // Esconde as 3 barras
            document.body.style.overflow = 'hidden'; // Trava o scroll
        });

        btnClose.addEventListener('click', () => {
            menuMobile.classList.remove('open');
            btnMobile.style.display = 'flex'; // Mostra as 3 barras
            document.body.style.overflow = ''; // Libera o scroll
        });

        // Fecha ao clicar em qualquer link
        menuMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuMobile.classList.remove('open');
                btnMobile.style.display = 'flex';
                document.body.style.overflow = '';
            });
        });
    }
});
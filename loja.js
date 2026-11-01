// loja.js
async function iniciarLoja() {
    const urlParams = new URLSearchParams(window.location.search);
    let plataformaFiltro = urlParams.get('p') || 'ps4';

    // Load all data
    const jogos = await carregarDados();
    
    if (jogos.length === 0) {
        document.getElementById('loading').innerText = "Error loading data.";
        return;
    }

    // Marca o link ativo no menu
    document.querySelectorAll('.nav-plataformas a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-plataforma') === plataformaFiltro) {
            link.classList.add('active');
        }
    });

    // Títulos atualizados
    const titulos = {
        ps5: '<i class="fa-brands fa-playstation"></i> PlayStation 5 Games',
        ps4: '<i class="fa-brands fa-playstation"></i> PlayStation 4 Games',
        ps3: '<i class="fa-brands fa-playstation"></i> PlayStation 3 Games',
        ps2: '<i class="fa-brands fa-playstation"></i> PlayStation 2 Games',
        psp: '<i class="fa-brands fa-playstation"></i> PSP Games',
        pc: '<i class="fa-brands fa-steam"></i> PC / Steam Games',
        xbox: '<i class="fa-brands fa-xbox"></i> Xbox Games',
        apps: '<i class="fa-solid fa-screwdriver-wrench"></i> Ferramentas do Sistema',
        themes: '<i class="fa-solid fa-palette"></i> Dynamic Themes',
        emulators: '<i class="fa-solid fa-gamepad"></i> Emulators',
        dlc: '<i class="fa-solid fa-puzzle-piece"></i> DLCs (Additional Content)',
        updates: '<i class="fa-solid fa-arrow-up-from-bracket"></i> Updates e Patches'
    };

    document.getElementById('titulo-plataforma').innerHTML = titulos[plataformaFiltro] || 'Catalogue';
    document.getElementById('loading').style.display = 'none';

    const container = document.getElementById('grid-jogos');
    const btnToggle = document.getElementById('btn-toggle-view');

    // --- AQUI ESTÁ A MÁGICA DA SEPARAÇÃO ---
    let jogosDaPlatform;

    if (plataformaFiltro === 'apps') {
        // Mostra apenas aplicativos
        jogosDaPlatform = jogos.filter(j => obterTipo(j) === "app");
    } else if (plataformaFiltro === 'emulators') {
        // Show emulators only
        jogosDaPlatform = jogos.filter(j => obterTipo(j) === "emulator");
    } else if (plataformaFiltro === 'themes') {
        // Show themes only
        jogosDaPlatform = jogos.filter(j => obterTipo(j) === "theme");
    } else if (plataformaFiltro === 'dlc') {
        // Mostra apenas as DLCs
        jogosDaPlatform = jogos.filter(j => obterTipo(j) === "dlc");
    } else if (plataformaFiltro === 'updates') {
        // Mostra apenas Updates
        jogosDaPlatform = jogos.filter(j => obterTipo(j) === "update");
    } else {
        // Se for PS4, PC, etc., mostra apenas os GAMES BASE (game)
        jogosDaPlatform = jogos.filter(j => 
            obterPlatform(j) === plataformaFiltro && 
            obterTipo(j) === "game"
        );
    }
    // ----------------------------------------

    // Function that renders the cards
    function renderizar(jogosFiltrados) {
        container.innerHTML = '';

        if (jogosFiltrados.length === 0) {
            container.innerHTML = '<p style="color: white; text-align: center; width: 100%;">No items found in this category.</p>';
            return;
        }

        jogosFiltrados.forEach(jogo => {
            const imagemCapa = jogo.cover_url || 'https://via.placeholder.com/150';
            const idSeguro = encodeURIComponent(jogo.link);
            const plataforma = obterPlatform(jogo);
            const tipo = obterTipo(jogo);

            container.innerHTML += `
                <a href="detalhes/detalhes.html?id=${idSeguro}" class="game-card ${plataforma}-card ${tipo}-card">
                    <div class="cover-wrapper">
                        <img src="${imagemCapa}" class="game-cover" onerror="this.style.display='none'; this.parentElement.style.background='#222'">
                    </div>
                    <div class="game-info">
                        <div class="game-title">${jogo.name}</div>
                        <div class="download-btn">View Details</div>
                    </div>
                </a>
            `;
        });
    }

    // Renderiza a lista principal
    renderizar(jogosDaPlatform);

    // Grid/List button logic
    const modoSalvo = localStorage.getItem('modoVisualizacao') || 'grid-view';
    aplicarModo(modoSalvo);

    btnToggle.addEventListener('click', () => {
        const modoAtual = container.classList.contains('grid-view') ? 'grid-view' : 'list-view';
        const novoModo = modoAtual === 'grid-view' ? 'list-view' : 'grid-view';
        
        aplicarModo(novoModo);
        localStorage.setItem('modoVisualizacao', novoModo); 
    });

    function aplicarModo(modo) {
        if (modo === 'grid-view') {
            container.classList.remove('list-view');
            container.classList.add('grid-view');
            btnToggle.innerHTML = '<i class="fa-solid fa-list"></i> Switch to List';
        } else {
            container.classList.remove('grid-view');
            container.classList.add('list-view');
            btnToggle.innerHTML = '<i class="fa-solid fa-border-all"></i> Switch to Grid';
        }
    }

    // Search bar logic
    document.getElementById('busca').addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtrados = jogosDaPlatform.filter(jogo => 
            jogo.name.toLowerCase().includes(termo)
        );
        renderizar(filtrados);
    });
}

if (document.getElementById('grid-jogos')) {
    iniciarLoja();
}
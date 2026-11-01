// hub.js
async function iniciarHome() {
    const todosOsGames = await carregarDados();

    if (todosOsGames.length === 0) return;

    document.getElementById('loading').style.display = 'none';

    const prateleirasContainer = document.querySelector('.prateleiras-container');
    const inputBusca = document.getElementById('busca');
    
    const containerResultados = document.createElement('div');
    containerResultados.id = 'resultados-busca';
    containerResultados.className = 'loja-container grid-view';
    containerResultados.style.display = 'none';
    prateleirasContainer.parentNode.appendChild(containerResultados);

    function criarCard(jogo) {
        const imagemCapa = jogo.cover_url || 'https://via.placeholder.com/150';
        const idSeguro = encodeURIComponent(jogo.link);
        const plataforma = obterPlatform(jogo);
        const tipo = obterTipo(jogo);
        
        return `
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
    }

    function renderizarPrateleiras() {
        containerResultados.innerHTML = '';
        containerResultados.style.display = 'none';
        prateleirasContainer.style.display = 'block';

        // FILTRO ATUALIZADO: Separa por plataforma E por tipo (game)
        const grupos = {
            ps5: todosOsGames.filter(j => obterPlatform(j) === "ps5" && obterTipo(j) === "game"),
            ps4: todosOsGames.filter(j => obterPlatform(j) === "ps4" && obterTipo(j) === "game"),
            ps3: todosOsGames.filter(j => obterPlatform(j) === "ps3" && obterTipo(j) === "game"),
            pc: todosOsGames.filter(j => obterPlatform(j) === "pc" && obterTipo(j) === "game"),
            
            // Para as outras categorias, filtramos pelo TIPO
            apps: todosOsGames.filter(j => obterTipo(j) === "app" || obterTipo(j) === "emulator"),
            themes: todosOsGames.filter(j => obterTipo(j) === "theme"),
            dlc: todosOsGames.filter(j => obterTipo(j) === "dlc"),
            updates: todosOsGames.filter(j => obterTipo(j) === "update")
        };

        // Renderiza as prateleiras se houver itens
        if (grupos.emulators && grupos.emulators.length > 0) {
            document.getElementById('prateleira-emulators').style.display = 'block';
            document.getElementById('lista-emulators').innerHTML = grupos.emulators.slice(0, 10).map(criarCard).join('');
        } else {
            // Caso não ache "emulators" diretamente, ele busca dentro dos apps
            const emuladores = grupos.apps.filter(j => obterTipo(j) === "emulator");
            if (emuladores.length > 0) {
                document.getElementById('prateleira-emulators').style.display = 'block';
                document.getElementById('lista-emulators').innerHTML = emuladores.slice(0, 10).map(criarCard).join('');
            }
        }

        if (grupos.ps5.length > 0) {
            document.getElementById('prateleira-ps5').style.display = 'block';
            document.getElementById('lista-ps5').innerHTML = grupos.ps5.slice(0, 10).map(criarCard).join('');
        }
        if (grupos.ps4.length > 0) {
            document.getElementById('prateleira-ps4').style.display = 'block';
            document.getElementById('lista-ps4').innerHTML = grupos.ps4.slice(0, 10).map(criarCard).join('');
        }
        if (grupos.ps3.length > 0) {
            document.getElementById('prateleira-ps3').style.display = 'block';
            document.getElementById('lista-ps3').innerHTML = grupos.ps3.slice(0, 10).map(criarCard).join('');
        }
        if (grupos.pc.length > 0) {
            document.getElementById('prateleira-pc').style.display = 'block';
            document.getElementById('lista-pc').innerHTML = grupos.pc.slice(0, 10).map(criarCard).join('');
        }
        if (grupos.apps.length > 0) {
            document.getElementById('prateleira-apps').style.display = 'block';
            document.getElementById('lista-apps').innerHTML = grupos.apps.slice(0, 10).map(criarCard).join('');
        }
        if (grupos.themes.length > 0) {
            document.getElementById('prateleira-themes').style.display = 'block';
            document.getElementById('lista-themes').innerHTML = grupos.themes.slice(0, 10).map(criarCard).join('');
        }
        if (grupos.dlc.length > 0) {
            document.getElementById('prateleira-dlc').style.display = 'block';
            document.getElementById('lista-dlc').innerHTML = grupos.dlc.slice(0, 10).map(criarCard).join('');
        }
        if (grupos.updates.length > 0) {
            document.getElementById('prateleira-updates').style.display = 'block';
            document.getElementById('lista-updates').innerHTML = grupos.updates.slice(0, 10).map(criarCard).join('');
        }
    }

    function renderizarBusca(termo) {
        prateleirasContainer.style.display = 'none';
        const filtrados = todosOsGames.filter(jogo => jogo.name.toLowerCase().includes(termo));
        containerResultados.style.display = 'grid';
        
        if (filtrados.length === 0) {
            containerResultados.innerHTML = '<p style="color: white; text-align: center; width: 100%;">No items found.</p>';
            return;
        }
        containerResultados.innerHTML = filtrados.map(criarCard).join('');
    }

    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        if (termo.length > 0) {
            renderizarBusca(termo);
        } else {
            renderizarPrateleiras();
        }
    });

    renderizarPrateleiras();
}

if (document.getElementById('prateleira-ps4')) {
    iniciarHome();
}
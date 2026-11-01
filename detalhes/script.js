// detalhes/script.js
async function carregarDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const idJogo = urlParams.get('id');

    if (!idJogo) {
        document.getElementById('loading').innerText = "No game selected.";
        return;
    }

    try {
        const todosOsGames = await carregarDados();
        
        const linkOriginal = decodeURIComponent(idJogo);
        const jogo = todosOsGames.find(j => j.link === linkOriginal);

        if (!jogo) throw new Error("Item not found in the database.");

        document.getElementById('loading').style.display = 'none';
        const container = document.getElementById('conteudo');
        container.style.display = 'flex';

        const imagemCapa = jogo.cover_url || 'https://via.placeholder.com/400x600/1b2838/66c0f4?text=No+Cover';
        
        const banner = document.getElementById('steam-banner');
        banner.style.backgroundImage = `linear-gradient(to bottom, rgba(15,15,17,0.3), rgba(15,15,17,1)), url('${imagemCapa}')`;

        let htmlExtras = '';
        
        // Get the base game name to match related entries
        const nomeBaseJogo = jogo.name.split(' [')[0].split(' (')[0].trim().toLowerCase();

        const extrasRelacionados = todosOsGames.filter(item => {
            if (item.link === jogo.link) return false;
            if (item.title_id === jogo.title_id) return true;
            if (item.name.toLowerCase().includes(nomeBaseJogo)) return true;
            return false;
        });

        if (extrasRelacionados.length > 0) {
            const updates = extrasRelacionados.filter(i => obterTipo(i) === 'update');
            const dlcs = extrasRelacionados.filter(i => obterTipo(i) === 'dlc');
            
            let htmlLista = '';

            // FUNÇÃO MÁGICA QUE LIMPA O NOME (Remove the base game name from the DLC title)
            const limparNome = (nomeCompleto) => {
                let nomeLimpo = nomeCompleto.replace(new RegExp(nomeBaseJogo, 'gi'), '');
                nomeLimpo = nomeLimpo.replace(/^[\s\-\(\)\[\]:]+|[\s\-\(\)\[\]:]+$/g, '');
                return nomeLimpo || nomeCompleto; 
            };

            if (updates.length > 0) {
                htmlLista += `<h4>Updates Oficiais</h4>`;
                htmlLista += updates.map(ext => `
                    <div class="dlc-card">
                        <div class="dlc-info">
                            <span class="dlc-name">${limparNome(ext.name)}</span>
                            <span class="dlc-meta">v${ext.version} • ${formatarTamanho(ext.size)}</span>
                        </div>
                        <a href="${ext.link}" class="btn-dlc" target="_blank"><i class="fa-solid fa-download"></i> Download</a>
                    </div>
                `).join('');
            }

            if (dlcs.length > 0) {
                htmlLista += `<h4>Additional Content (DLCs)</h4>`;
                htmlLista += dlcs.map(ext => `
                    <div class="dlc-card">
                        <div class="dlc-info">
                            <span class="dlc-name">${limparNome(ext.name)}</span>
                            <span class="dlc-meta">v${ext.version} • ${formatarTamanho(ext.size)}</span>
                        </div>
                        <a href="${ext.link}" class="btn-dlc" target="_blank"><i class="fa-solid fa-download"></i> Download</a>
                    </div>
                `).join('');
            }

            htmlExtras = `
                <div class="steam-dlc-section">
                    <h3><i class="fa-solid fa-box-open"></i> Additional Files for This Game</h3>
                    <div class="dlc-list">
                        ${htmlLista}
                    </div>
                </div>
            `;
        }

        let tagTipo = '';
        if (obterTipo(jogo) === 'app') tagTipo = 'Ferramenta / App';
        else if (obterTipo(jogo) === 'theme') tagTipo = 'Tema';
        else if (obterTipo(jogo) === 'emulator') tagTipo = 'Emulador';
        else if (obterTipo(jogo) === 'dlc') tagTipo = 'DLC';
        else if (obterTipo(jogo) === 'update') tagTipo = 'Update';
        else tagTipo = 'Jogo Base';

        container.innerHTML = `
            <div class="steam-header">
                <h1>${jogo.name}</h1>
                <div class="steam-tags">
                    <span class="steam-tag">Region: ${jogo.region}</span>
                    <span class="steam-tag" style="background: rgba(139, 195, 74, 0.2); color: #8bc34a; border-color: #8bc34a;">${tagTipo}</span>
                    <span class="steam-tag">Version: ${jogo.version}</span>
                    <span class="steam-tag">Release Date: ${jogo.release}</span>
                </div>
            </div>

            <div class="steam-content">
                <div class="steam-cover-col">
                    <img src="${imagemCapa}" class="steam-cover-img" alt="${jogo.name}">
                </div>
                <div class="steam-info-col">
                    <p class="steam-description">
                        Download ${jogo.name} to your device. Make sure you have enough storage space and that your firmware meets the minimum requirement.
                    </p>
                    <ul class="steam-meta-list">
                        <li><span>ID do Sistema:</span> <span>${jogo.title_id || 'N/A'}</span></li>
                        <li><span>Minimum Firmware:</span> <span>${jogo.min_fw || 'Unknown'}</span></li>
                        <li><span>Tamanho do Arquivo:</span> <span>${formatarTamanho(jogo.size)}</span></li>
                    </ul>

                    ${htmlExtras} <!-- AQUI ENTRAM AS DLCs E PATCHES VINCULADAS -->

                    <div class="steam-actions">
                        <a href="${linkOriginal}" class="btn-steam-green" download target="_blank"><i class="fa-solid fa-download"></i> Download</a>
                        <a href="../index.html" class="btn-steam-blue"><i class="fa-solid fa-arrow-left"></i> Back to Store</a>
                    </div>
                </div>
            </div>
        `;
    } catch (erro) {
        console.error(erro);
        document.getElementById('loading').innerText = "Error loading details. Check the console.";
        document.getElementById('loading').style.color = "#e63946";
    }
}

carregarDetails();
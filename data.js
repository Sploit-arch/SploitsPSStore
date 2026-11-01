// data.js
let bancoDeDados = [];

async function carregarDados(plataforma = '') {
    try {
        const isSubpasta = window.location.pathname.includes('/detalhes/');
        const basePath = isSubpasta ? '../data/' : 'data/';

        const arquivos = [
            'DATA_GAMES.json',
            'DATA_APPSS.json',
            'DATA_THEMES.json', 
            'DATA_DLC.json',
            'DATA_UPDATE.json',
            'DATA_EMULATORS.json'
        ];

        const promessas = arquivos.map(arquivo => 
            fetch(basePath + arquivo)
                .then(res => res.ok ? res.json() : { DATA: {} })
                .catch(() => ({ DATA: {} }))
        );

        const resultados = await Promise.all(promessas);

        bancoDeDados = [];
        
        resultados.forEach(json => {
            if (json && json.DATA) {
                const jogosDoArquivo = Object.keys(json.DATA)
                    .filter(link => link.startsWith('http'))
                    .map(link => {
                        return { ...json.DATA[link], link: link };
                    });
                bancoDeDados = bancoDeDados.concat(jogosDoArquivo);
            }
        });

        return bancoDeDados;
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        return [];
    }
}

function formatarTamanho(bytes) {
    if (!bytes) return "Unknown";
    if (bytes < 1073741824) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

// Retorna a plataforma principal do jogo (ps4, pc, ps3, etc.)
function obterPlatform(jogo) {
    if (!jogo) return "ps4";
    
    // 1. Usa a plataforma explícita se existir
    if (jogo.platform) return jogo.platform.toLowerCase();

    // 2. Fallback para os arquivos antigos
    const nome = (jogo.name || "").toLowerCase();
    const regiao = (jogo.region || "").toUpperCase();

    if (regiao === "PC" || nome.includes("(pc)") || nome.includes("steam")) return "pc";
    if (nome.includes("ps5")) return "ps5";
    if (nome.includes("ps3")) return "ps3";
    if (nome.includes("ps2")) return "ps2";
    if (nome.includes("psp")) return "psp";
    if (nome.includes("xbox")) return "xbox";

    return "ps4";
}

// Retorna o TIPO do conteúdo (game, app, dlc, update, theme, emulator)
function obterTipo(jogo) {
    if (!jogo) return "game";
    
    if (jogo.type) return jogo.type.toLowerCase();

    // Fallback antigo (baseado na região ou nome)
    const nome = (jogo.name || "").toLowerCase();
    const regiao = (jogo.region || "").toUpperCase();

    if (regiao === "APPS" || nome.includes("[app]")) return "app";
    if (regiao === "THEME" || nome.includes("[theme]")) return "theme";
    if (nome.includes("[emulador]") || nome.includes("mgba")) return "emulator";
    if (nome.includes("[dlc]") || nome.includes("dlc:")) return "dlc";
    if (nome.includes("[update]") || nome.includes("patch")) return "update";

    return "game";
}
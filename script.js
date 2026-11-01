// script.js
// Variável global para guardar os jogos (se precisar em outra página)
let todosOsGames = [];

// Função global para formatar tamanho (usada em todas as páginas)
function formatarTamanho(bytes) {
    if (!bytes) return "Tamanho Unknown";
    if (bytes < 1073741824) {
        const mb = bytes / (1024 * 1024);
        return mb.toFixed(2) + " MB";
    }
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2) + " GB";
}

// Nada mais é carregado aqui. Cada página faz o seu próprio fetch.
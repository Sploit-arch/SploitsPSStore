// footer.js
document.addEventListener("DOMContentLoaded", () => {
    // Verifica se estamos na pasta /detalhes/
    const isSubpasta = window.location.pathname.includes('/detalhes/');
    const caminhoFooter = isSubpasta ? '../footer.html' : 'footer.html';
    
    fetch(caminhoFooter)
        .then(response => {
            if (!response.ok) throw new Error("Footer não encontrado");
            return response.text();
        })
        .then(html => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const footerElement = tempDiv.querySelector('footer');
            if (footerElement) {
                document.body.appendChild(footerElement);
            }
        })
        .catch(erro => console.log("Aviso: O footer não foi encontrado ou já está no HTML."));
});
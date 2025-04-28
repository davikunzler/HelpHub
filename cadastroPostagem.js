document.getElementById('postagemForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const filtro = document.getElementById('filtro').value;

    if (!titulo || !descricao || !filtro) {
        alert('Todos os campos são obrigatórios');
        return;
    }

    const postagem = {
        titulo: titulo,
        descricao: descricao,
        filtro: filtro,
    };

    fetch('http://localhost:3000/postar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postagem)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao cadastrar usuário', error);
        alert(error.message);
    });
    window.location.reload();
});

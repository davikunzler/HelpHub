function carregarPostagens() {
    fetch('http://localhost:3000/listar_postagens')
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById('duvidas');
            lista.innerHTML = ''; // Limpa o que tiver antes

            data.data.forEach(postagem => {
                const card = document.createElement('div');
                card.className = 'card-postagem';

                card.innerHTML = `
                    <h3>${postagem.titulo}</h3>
                    <p>${postagem.descricao}</p>
                    <span class="filtro">${postagem.filtro}</span>

                    <div class="botoes">
                        <button onclick="editar(${postagem.id_postagem})">Editar</button>
                        <button onclick="excluir(${postagem.id_postagem})">Excluir</button>
                    </div>

                    <div class="comentario-area">
                        <textarea id="comentario-${postagem.id_postagem}" placeholder="Escreva seu comentário..."></textarea>
                        <button onclick="comentar(${postagem.id_postagem})" class="btn-comentar">Publicar Comentário</button>

                        <div id="comentarios-${postagem.id_postagem}" class="comentarios-lista"></div>
                    </div>
                `;

                lista.appendChild(card);

                // Depois de criar o card, carregar os comentários dessa postagem
                carregarComentarios(postagem.id_postagem);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar postagens:', error);
        });
}


function excluir(id_postagem) {
    fetch(`http://localhost:3000/delete_postagem/${id_postagem}`, { method: 'DELETE' })
        .then(() => carregarPostagens());
}

function editar(id_postagem) {
    const novoTitulo = prompt('Digite o novo título:');
    const novaDescricao = prompt('Digite a nova descrição:');

    if (!novoTitulo || !novaDescricao) {
        alert('Título e descrição são obrigatórios.');
        return;
    }

    // Primeiro buscamos a postagem atual para pegar o filtro antigo
    fetch(`http://localhost:3000/listar_postagens`)
        .then(response => response.json())
        .then(data => {
            const postagem = data.data.find(p => p.id_postagem === id_postagem);
            if (!postagem) {
                alert('Postagem não encontrada.');
                return;
            }

            const filtroAtual = postagem.filtro; // Mantemos o filtro original

            // Agora mandamos o update
            fetch(`http://localhost:3000/editar_postagem/${id_postagem}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titulo: novoTitulo,
                    descricao: novaDescricao,
                    filtro: filtroAtual // Continua o mesmo
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Postagem atualizada com sucesso!');
                    carregarPostagens();
                } else {
                    alert('Erro ao atualizar postagem.');
                }
            })
            .catch(error => {
                console.error('Erro ao atualizar postagem:', error);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar postagem:', error);
        });
}





async function comentar(id_postagem) {
    const conteudo = document.getElementById(`comentario-${id_postagem}`).value;

    try {
        const response = await fetch('http://localhost:3000/comentar', { // agora sem /:id_postagem/:id_usuario
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conteudo, id_postagem })
        });

        const result = await response.json();
        if (result.success) {
            alert('Comentário publicado!');
            // Aqui você poderia atualizar a lista de comentários também se quiser
        } else {
            alert('Erro ao comentar.');
        }
    } catch (error) {
        console.error(error);
        alert('Ocorreu um erro ao comentar.');
    }
    window.location.reload();
}

function carregarComentarios(idPostagem) {
    fetch(`http://localhost:3000/listar_comentarios/${idPostagem}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const comentariosDiv = document.getElementById(`comentarios-${idPostagem}`);
            comentariosDiv.innerHTML = ''; // Limpa antes de listar

            data.data.forEach(comentario => {
                const comentarioItem = document.createElement('div');
                comentarioItem.className = 'comentario-item';

                comentarioItem.innerHTML = `
                    <p>${comentario.conteudo}</p>
                    <button onclick="editarComentario(${comentario.id_comentario}, '${comentario.conteudo}', ${idPostagem})">Editar</button>
                    <button onclick="deletarComentario(${comentario.id_comentario}, ${idPostagem})">Excluir</button>
                `;

                comentariosDiv.appendChild(comentarioItem);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar comentários:', error);
        });
        
}



window.onload = carregarPostagens;

document.addEventListener('DOMContentLoaded', () => {
    carregarUsuarios();
});

function abrirCadastro() {
    window.location.href = 'cadastro.html';
}

// Carregar a lista de usuários
async function carregarUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/listar_usuario');
        if (!response.ok) {
            throw new Error('Erro ao buscar usuários: ' + response.statusText);
        }
        const result = await response.json();
        if (result.success) {
            renderizarTabela(result.data);
        } else {
            alert('Falha ao carregar lista de usuários.');
        }
    } catch (error) {
        console.error(error);
        alert('Ocorreu um erro ao carregar usuários.');
    }
}

// Renderizar a tabela de usuários
function renderizarTabela(usuarios) {
    const tbody = document.getElementById('usuariosTableBody');
    tbody.innerHTML = '';

    usuarios.forEach(user => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${user.id_usuario || user.id}</td>
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn-edit" onclick="editar(${user.id_usuario || user.id}, '${user.nome}', '${user.email}')">Editar</button>
                <button class="btn-delete" onclick="deletar(${user.id_usuario || user.id})">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Abrir o modal e preencher o formulário de edição
function editar(id, nome, email) {
    document.getElementById('modal-editar').style.display = 'flex';
    document.getElementById('usuario-id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('email').value = email;
    document.getElementById('senha').value = ''; // deixa o campo senha vazio
}

// Fechar o modal
function fecharModal() {
    document.getElementById('modal-editar').style.display = 'none';
}

// Submeter o formulário de edição
document.getElementById('form-editar').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('usuario-id').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const dados = { nome, email, senha };

    try {
        const response = await fetch(`http://localhost:3000/editar_usuario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        if (result.success) {
            alert('Usuário editado com sucesso!');
            carregarUsuarios();
            fecharModal();
        } else {
            alert(result.message || 'Falha ao editar usuário.');
        }
    } catch (error) {
        console.error(error);
        alert('Ocorreu um erro ao editar usuário.');
    }
});

// Deletar o usuário
async function deletar(id) {
    if (!confirm('Deseja realmente deletar este usuário?')) return;
    try {
        const response = await fetch(`http://localhost:3000/delete_usuario/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
            alert(result.message);
            carregarUsuarios();
        } else {
            alert('Falha ao deletar usuário.');
        }
    } catch (error) {
        console.error(error);
        alert('Ocorreu um erro ao deletar usuário.');
    }
}

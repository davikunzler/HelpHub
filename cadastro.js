document.getElementById('formCadastro').addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!nome || !email || !senha) {
        alert('Todos os campos são obrigatórios');
        return;
    }

    if (senha.length < 8) {
        alert('A senha precisa ter no mínimo 8 caracteres.');
        return;
    }
    if (senha.length > 15) {
        alert('A senha não pode ter mais que 15 caracteres.');
        return;
    }

    const user = {
        nome: nome,
        email: email,
        senha: senha,
    };

    fetch('http://localhost:3000/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
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

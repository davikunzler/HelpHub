const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');
const connection = require('./db_config');
const app = express();
 
app.use(cors());
app.use(express.json());
 
const port = 3000;


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/listar_usuario', (req, res) => {
    connection.query('SELECT * FROM Usuarios', (err, rows) => {
        if (err) {
            console.error('Erro ao buscar usuarios:', err);
            return res.status(500).json({ message: 'Erro ao buscar usuarios' });
        }
        res.json({ success: true, data: rows });

    });
});
 
app.post('/cadastrar', (req, res) => {
    const {nome, senha, email} = req.body
    const query = 'INSERT INTO Usuarios(nome, senha, email) VALUES(?, ?, ?)'
    if (senha.length < 8) {
        return res.status(400).send("A senha precisa ter no mínimo 8 caracteres.");
    }
    if (senha.length > 15) {
        return res.status(400).send("A senha não pode ter mais que 15 caracteres.");
    }
    connection.query(query, [nome, senha, email], (err, _result) => {
        if(err){
            return res.status(500).json({success: false, message: 'Erro ao cadastrar usuário.'})
        }
        res.json({success: true, message: 'Usuário cadastrado com sucesso!'})
    })
})


app.put('/editar_usuario/:id', (req, res) => {
    const query = 'UPDATE Usuarios SET nome = ?, senha = ?, email = ? WHERE id_usuario = ?';
    const {id} = req.params
    const {nome, senha, email} = req.body;

    if (!nome || !senha || !email) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }
    if (senha.length < 8) {
        return res.status(400).send("A senha precisa ter no mínimo 8 caracteres.");
    }
    if (senha.length > 15) {
        return res.status(401).send("A senha não pode ter mais que 15 caracteres.");
    }
    connection.query(query, [nome, senha, email, id], (err) => {
        if(err){
            return res.status(500).json({success: false, message: 'Erro ao editar usuário.'})
        }
       res.json({success: true, message: 'Usuário editado com sucesso'})
    })
})
 
app.delete('/delete_usuario/:id', (req, res) => {
    const {id} = req.params
    const query = 'DELETE FROM Usuarios WHERE id_usuario = ?'
    connection.query(query, [id], (err) => {
        if(err){
            return res.status(500).json({success: false, message: 'Erro ao deletar usuário.'})
        }
        res.json({success: true, message: 'Usuário deletado com sucesso!'})
    })
})

app.post('/login', (req, res) => {
    const {email, senha} = req.body;
 
    const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    connection.query(query, [email, senha], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro no servidor.'});
        }
 
        if (results.length > 0) {
            res.json({ success: true, message: 'Login bem-sucedido'})
        } else {
            res.json({ success: false, message: 'Email ou senha incorretos'})
        }
    })
})
////////////////////////
////////////////////////
/////////////////////
/////////////////////




app.get('/listar_postagens', (_req, res) => {
    const query = 'SELECT * FROM Postagens';
    connection.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao listar postagens.' });
        }
        res.json({ success: true, data: result }); // retornando também as postagens
    });
});



app.get('/listar_comentarios', (_req, res) => {
    const query = 'SELECT * FROM Comentarios';
    connection.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao listar comentarios.' });
        }
        res.json({ success: true, data: result }); // retornando também as postagens
    });
});









// Publicar uma nova postagem
app.post('/postar', (req, res) => {
    const { titulo, descricao, filtro } = req.body;
    const query = 'INSERT INTO Postagens(titulo, descricao, filtro) VALUES(?, ?, ?)';
    connection.query(query, [titulo, descricao, filtro], (err, _result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Erro ao publicar postagem.' });
        }
        res.json({ success: true, message: 'Postagem publicada com sucesso!' });
    });
});

// Editar uma postagem
app.put('/editar_postagem/:id', (req, res) => {
    const query = 'UPDATE Postagens SET titulo = ?, descricao = ?, filtro = ? WHERE id_postagem = ?';
    const { id } = req.params; // corrigido
    const { titulo, descricao, filtro } = req.body;

    connection.query(query, [titulo, descricao, filtro, id], (err) => { // corrigida a ordem dos parâmetros
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao editar postagem.' });
        }
        res.json({ success: true, message: 'Postagem editada com sucesso' });
    });
});

// Deletar uma postagem
app.delete('/delete_postagem/:id', (req, res) => {
    const { id } = req.params; // corrigido
    const query = 'DELETE FROM Postagens WHERE id_postagem = ?';
    connection.query(query, [id], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar postagem.' });
        }
        res.json({ success: true, message: 'Postagem deletada com sucesso!' });
    });
});



















// Listar todos os comentários
app.get('/listar_comentarios/:id', (req, res) => {
    const idPost = req.params.id
    const query = 'SELECT * FROM Comentarios WHERE id_postagem = ?';
    connection.query(query, idPost, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao listar comentários.' });
        }
        res.json({ success: true, data: result });
    });



});app.post('/comentar', (req, res) => {
    console.log(req.body.conteudo);
    const conteudo = req.body.conteudo;
    const id_postagem = req.body.id_postagem;

    if (!conteudo) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }
    
    const query = 'INSERT INTO Comentarios (conteudo, id_postagem) VALUES (?, ?)';
    
    connection.query(query, [conteudo, id_postagem], (err, _result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Erro ao publicar comentário' });
        }
        res.json({ success: true, message: 'Comentário publicado com sucesso!' });
    });
    
});



// Deletar uma postagem
app.delete('/delete_comentario/:id', (req, res) => {
    const { id } = req.params; // corrigido
    const query = 'DELETE FROM Comentarios WHERE id_comentario = ?';
    connection.query(query, [id], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar postagem.' });
        }
        res.json({ success: true, message: 'Postagem deletada com sucesso!' });
    });
});


app.post('/avaliar_usuario', (req, res) => {
    const { id_usuario, nota, comentario } = req.body;

    if (!id_usuario || !nota || nota < 1 || nota > 5) {
        return res.status(400).json({ success: false, message: 'Dados inválidos para avaliação.' });
    }

    const query = 'INSERT INTO Avaliacoes (id_usuario, nota, comentario) VALUES (?, ?, ?)';
    connection.query(query, [id_usuario, nota, comentario], (err) => {
        if (err) {
            console.error('Erro ao salvar avaliação:', err);
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar avaliação.' });
        }
        res.json({ success: true, message: 'Avaliação cadastrada com sucesso!' });
    });
});







app.get('/usuarios_com_media', (req, res) => {
    const query = `
        SELECT u.id_usuario, u.nome, u.email, 
               ROUND(AVG(a.nota), 1) AS media_avaliacao
        FROM Usuarios u
        LEFT JOIN Avaliacoes a ON u.id_usuario = a.id_usuario
        GROUP BY u.id_usuario
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários com média:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar dados.' });
        }
        res.json({ success: true, data: results });
    });
});




app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
})

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
  
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, senha })
      });
  
      const data = await response.json();
      if (data.success) { 
        alert('Login realizado!');

      } else {
        alert('Nome ou senha inválidos');
      }
    } catch (error) {
      alert('Erro de conexão.');
    }
    
  });
  
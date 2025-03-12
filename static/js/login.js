window.onload = function() {
  setTimeout(function() {
      document.body.style.opacity = 1;
  }, 1000); // Atraso de 1 segundo
};


document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Impede o envio tradicional do formulário
  
  nome = document.getElementById("nomeForm").value;
  senha = document.getElementById("senhaForm").value;
  number = 3
  
     const response = await fetch("http://127.0.0.1:8000/login", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',  // Indicando que estamos enviando JSON
      },
      body: JSON.stringify({
        "nomeForm":nome,
        "senhaForm": senha
      }),  // Convertendo os dados em JSON
    });

    if (response.ok) {
      const result = await response.json();
     
      if (result.redirect_url) {
          window.location.href = result.redirect_url;  // Redireciona para a página recebida
          console.log('Login successful:', result.user);
          LocalStorage.setItem("usuario", result.user);    
      }
      else {
          console.log('Login successful:', result)}; 
      
      console.log('Login successful:', result);
      


    } else {
      console.error('Login failed:', response.statusText);
    }

  })

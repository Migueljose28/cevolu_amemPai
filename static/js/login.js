window.onload = function() {
  setTimeout(function() {
      document.body.style.opacity = 1;
  }, 1000); // Atraso de 1 segundo
};


document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Impede o envio tradicional do formulário
  
  const formData = new URLSearchParams();
  formData.append("username", document.getElementById("nomeForm").value);
  formData.append("password", document.getElementById("senhaForm").value);
 

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/token/", {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });
  
      if (!response.ok) {
        throw new Error("Usuário inexistente ou senha incorreta");
      }
  
      const data = await response.json();
  
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        console.log("Token salvo:", localStorage.getItem("token"));
        window.location.href = "main.html";
      } else {
        throw new Error("Token não recebido. Verifique o servidor.");
      }
  
    } catch (error) {
      console.error("Erro:", error.message);
      document.getElementById("alert").innerHTML = error.message;
      document.getElementById("box-alert").style.display = "flex";
    }
  }
  
  );


 
  // Função para fazer login e obter o token
  const loginAndGetToken = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username:  nome,  // Nome de usuário que você criou
          password: senha,    // Senha
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        console.log('Token gerado:', token);
  
        // Agora que você tem o token, pode usá-lo para acessar rotas protegidas
        getProtectedData(token);
      } else {
        const errorData = await response.json();
        console.log('Erro ao obter token:', errorData);
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error);
    }
  };



function close_box_message(){
    document.getElementById("box-alert").style.display = "none";
}

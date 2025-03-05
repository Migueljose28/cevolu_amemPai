window.onload = function() {
    setTimeout(function() {
        document.body.style.opacity = 1;
    }, 1000); // Atraso de 1 segundo
};



document.getElementById("registrar").addEventListener("submit", async function (event) {
    event.preventDefault(); // Impede o envio tradicional do formulário
    
      nome = document.getElementById("nomeForm").value;
      email = document.getElementById("emailForm").value;
      telefone = document.getElementById("telefoneForm").value;
      cpf_cnpj = document.getElementById("cpfForm").value;
      senha = document.getElementById("senhaForm").value;
      confirmarsenha = document.getElementById("confirmarsenha").value;

      

      const response = await fetch('https://rowan-prickle-fenugreek.glitch.me/registrar', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',  // Indicando que estamos enviando JSON
        },
        body: JSON.stringify({
            "usuario": nome,
            "email": email,
            "telefone": telefone,
            "cpf_cnpj": cpf_cnpj,
            "senha": senha
        })
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error("Erro:", error));


})
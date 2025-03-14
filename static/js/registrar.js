window.onload = function() {
  setTimeout(function() {
      document.body.style.opacity = 1;
  }, 1000); // Atraso de 1 segundo
};

// Função para acessar dados protegidos usando o token
const getProtectedData = async (token) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/User/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Incluindo o token no cabeçalho
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Acesso autorizado:', data);
    } else {
      const errorData = await response.json();
      console.log('Erro de autorização:', errorData);
    }
  } catch (error) {
    console.error('Erro na requisição protegida:', error);
  }
};



document.getElementById("registrar").addEventListener("submit", async function (event) {
  event.preventDefault(); // Impede o envio tradicional do formulário
  
    nome = document.getElementById("nomeForm").value;
    email = document.getElementById("emailForm").value;
    phone = document.getElementById("telefoneForm").value;
    cpf_cnpj = document.getElementById("cpfForm").value;
    senha = document.getElementById("senhaForm").value;
    confirmarsenha = document.getElementById("confirmarsenha").value;


function box_mensagem(mensagem, type){
if(type == "erro"){
  title = "Erro";
  color = "red";
  color_hover = "darkred";

}if(type == "success"){
  title = "Sucesso"
  color = "green";
  color_hover = "darkgreen";

}if(type == "aviso"){
  title = "Aviso";
  color = "orange";
  color_hover = "darkorange";
}
document.getElementById("title_box_alert").innerHTML = title;
document.getElementById("alert").innerHTML = mensagem;
document.getElementById("alert").style.color = color;
button = document.getElementById("button_box_alert");
button.style.backgroundColor = color;

button.addEventListener('mouseover', () => {
  button.style.backgroundColor = color_hover;  
});

button.addEventListener('mouseout', () => {
  button.style.backgroundColor = color;  
});



document.getElementById("box-alert").style.display = "flex";
}

campos = {'nome':nome,
   'email':email,
    'telefone':phone,
     'cpf_cnpj':cpf_cnpj,
     'senha': senha};

campos_name = ['nome', 'email', 'telefone', 'cpf_cnpj', 'senha'];
for(i=0; i<campos_name.length; i++){
  if(campos[campos_name[i]] == ""){
    return box_mensagem(`${campos_name[i]} não pode ser vazio`, "erro");
  }
  
}


if (senha != confirmarsenha){
  return box_mensagem("Senhas não conferem", "aviso");
}

else{
  
    // Função para criar um novo usuário (sem gerar o token)
    const createUser = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: nome,  
                    email: email,
                    phone: phone,
                    cpf_cnpj: cpf_cnpj,
                    password: senha,  
                }),
            });

            if (response.ok) {
                const data = await response.json();

                console.log('Usuário criado com sucesso!');
                console.log('Username:', data.username);
                return box_mensagem("Usuario criado com Sucesso!", "success");
            } else {
                const errorData = await response.json();
                console.log('Erro ao criar usuário:', errorData);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    // CHAMANDO A FUNÇÃO PARA CRIAR O USUÁRIO
    createUser();


}});




function close_box_message(){
  document.getElementById("box-alert").style.display = "none";
}

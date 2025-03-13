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
    'telefone':telefone,
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
    const response = await fetch('http://127.0.0.1:8000/registrar', {
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
      }),
    });
    if (response.ok) {
      const result = await response.json();
      return box_mensagem("Você foi registrado!", "success");
    
    
    
    }
   
      else {
        //Usuario inexiste ou senha incorreta
          document.getElementById("alert").innerHTML = result.mensagem;
          document.getElementById("box-alert").style.display = "flex";
          console.log('Login failed:', result)};
}});




function close_box_message(){
  document.getElementById("box-alert").style.display = "none";
}

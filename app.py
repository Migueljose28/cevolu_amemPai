from fastapi import FastAPI,  Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Annotated


class User(BaseModel):
    nomeForm: str
    senhaForm: str

class UsuarioCreate(SQLModel, table=True):
    id: int |  None = Field(default=None, primary_key=True)
    usuario: str = Field(index=True)
    email: str = Field(index=True)
    telefone: str = Field(index=True)
    cpf_cnpj: str = Field(index=True)
    senha: str = Field(index=True)


class Token(BaseModel):
    access_token: str
    token_type: str



sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# armazena os objetos na memória e acompanha as alterações necessárias nos dados
def get_session():
    with Session(engine) as session:
        yield session
SessionDep = Annotated[Session, Depends(get_session)]


app = FastAPI()
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Configurando CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens. Para produção, você pode restringir para domínios específicos.
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos HTTP
    allow_headers=["*"],  # Permite todos os cabeçalhos
)


dados = {"mensagem":"deu bom"}
# Simulando um "banco de dados" de usuários
fake_users_db = {
        "username": "admin",
        "password": "1",
    }

#Rotas
@app.get("/")
def home():
    return JSONResponse(content={"redirect_url": "http://127.0.0.1:5500/templates/login.html"})

@app.get("/redirect")
def get_redirect():
    return JSONResponse(content={"redirect_url": "http://127.0.0.1:5500/templates/registrar.html"})

#Verficando usuario
@app.post("/login/")
async def verificar_user( user: User, session : SessionDep):
    if user.nomeForm is not None and user.senhaForm is not None:
        teste = session.query(UsuarioCreate).filter(user.nomeForm == UsuarioCreate.usuario).first()
        teste2 = session.query(UsuarioCreate).filter(user.senhaForm == UsuarioCreate.senha).first()
        if (teste):
            if (teste2):
                return JSONResponse(content={"redirect_url": "http://127.0.0.1:5500/templates/main.html", "user": user.nomeForm})
            else:
                return {"mensagem": "Senha incorreta"}
        else:
            return {"mensagem":"Usuario inexistente"}
    else:
        return {"mensagem":"Os Campos estão vazios"}







   # if user.nomeForm == fake_users_db["username"] and user.senhaForm == fake_users_db["password"]:
   #     return JSONResponse(content={"redirect_url": "http://127.0.0.1:5500/templates/main.html", "user": user.nomeForm, "token": "token"})

   # elif user.nomeForm == fake_users_db["username"] and user.senhaForm != fake_users_db["password"]:
    #    return {"mensagem": "Senha incorreta"}
    
   # else:
   #     return {"mensagem":"Usuario inexistente"}


@app.post("/registrar")
def registrar_usuario(dados: UsuarioCreate, session : SessionDep) -> UsuarioCreate:
    session.add(dados)
    session.commit()
    session.refresh(dados)
    return dados
    



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)


#uvicorn app:app --reload

from fastapi import FastAPI,  Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session, SQLModel
from db import  get_db, engine
from models import UsuarioCreate


class User(BaseModel):
    nomeForm: str
    senhaForm: str

class Token(BaseModel):
    access_token: str
    token_type: str


app = FastAPI()
def init_db():
    SQLModel.metadata.create_all(bind=engine)

@app.on_event("startup")
def on_startup():
    init_db()


# Configurando CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens. Para produção, você pode restringir para domínios específicos.
    allow_credentials=False,
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
async def home():
    return JSONResponse(content={"redirect_url": "http://127.0.0.1:5500/templates/login.html"})

@app.get("/registrar")
def get_redirect():
    return JSONResponse(content={"redirect_url": "http://127.0.0.1:5500/templates/registrar.html"})

#Verficando usuario
@app.post("/login/")
async def verificar_user(user: User, session: Session = Depends(get_db)):
    if user.nomeForm is not None and user.senhaForm is not None:
        teste = session.query(UsuarioCreate).filter(UsuarioCreate.usuario == user.nomeForm).first()
        teste2 = session.query(UsuarioCreate).filter(UsuarioCreate.senha == user.senhaForm).first()
        if teste:
            if teste2:
                return JSONResponse(content={"redirect_url": "http://127.0.0.1:5500/templates/main.html", "user": user.nomeForm})
            else:
                return {"mensagem": "Senha incorreta"}
        else:
            return {"mensagem": "Usuário inexistente"}
    else:
        return {"mensagem": "Os Campos estão vazios"}


@app.post("/registrar")
async def registrar_usuario(dados: UsuarioCreate, db: Session = Depends(get_db)):
    usuario = UsuarioCreate(**dados.dict())  # Converte os dados para o modelo Usuario
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario



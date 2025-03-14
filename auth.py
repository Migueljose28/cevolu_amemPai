from datetime import timedelta, datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from models import Users
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import JWTError
import jwt
from db import get_db


router = APIRouter(
    prefix='/auth',
    tags=['auth']
)
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"


bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl= 'auth/token')


class UsersRegister(BaseModel):
    username: str
    email: str
    phone: str
    cpf_cnpj: str
    password: str
    

class Token(BaseModel):
    access_token: str
    token_type: str



db_dependency = Annotated[Session, Depends(get_db)]

#Rota para criar user
@router.post("/", status_code= status.HTTP_201_CREATED)
async def create_user(db: db_dependency,
                      create_user_request: UsersRegister):
    create_user_model = Users(
        username= create_user_request.username,
        email = create_user_request.email,
        phone = create_user_request.phone,
        cpf_cnpj = create_user_request.cpf_cnpj,
        hashed_password = bcrypt_context.hash(create_user_request.password),

    )
    db.add(create_user_model)
    db.commit()
    return create_user_model

#Rota de login
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED, detail= 'Could not validate user.')
    token = create_access_token(user.username, user.id, timedelta(minutes = 1))
    return {'access_token': token, 'token_type': 'bearer'}



def authenticate_user(username: str, password: str, db):
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user



def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM) 
 

async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithm=ALGORITHM)
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code = status.HTTP_400_UNAUTHORIZED, detail = 'Could not validate user.')
        return {'username': username, 'id': user_id}
    except JWTError:
        raise HTTPException(status_code = status.HTTP_400_UNAUTHORIZED,
                            detail= 'Could not validate user.')
    



#Rotas e def que funcionam, mais não segue o codigo acima
def verificar_token(token: str = Depends(oauth2_bearer)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

@router.get("/protected")
async def rota_protegida(user: dict = Depends(verificar_token)):
    return {"message": "Acesso permitido", "user": user}


from sqlmodel import SQLModel, Field


class UsuarioCreate(SQLModel, table=True):
    id: int |  None = Field(default=None, primary_key=True)
    usuario: str = Field(index=True)
    email: str = Field(index=True)
    telefone: str = Field(index=True)
    cpf_cnpj: str = Field(index=True)
    senha: str = Field(index=True)

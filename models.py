from sqlmodel import SQLModel, Field


class Users(SQLModel, table=True):
    id: int |  None = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    email: str = Field(index=True)
    phone: str = Field(index=True)
    cpf_cnpj: str = Field(index=True)
    hashed_password: str = Field(index=True)

from datetime import datetime
from typing import List, Optional

from sqlalchemy import JSON, Column
from sqlmodel import Field, Relationship, Session, SQLModel, create_engine

DATABASE_URL = "sqlite:///data/database.db"
engine = create_engine(
    DATABASE_URL, echo=False, connect_args={"check_same_thread": False}
)


def get_session():
    with Session(engine) as session:
        yield session


class AlertRead(SQLModel):
    id: Optional[int] = None
    title: str
    time: str
    date: str
    image: str
    isNew: bool
    recognised_user_id: Optional[int]
    embedding: Optional[List[float]]


class FaceTemplateRead(SQLModel):
    id: int
    filepath: str
    user_id: int


class UserRead(SQLModel):
    id: int
    name: str
    images: List[FaceTemplateRead] = []
    alerts: List[AlertRead] = []
    is_trusted: bool
    is_temporary: bool


class Alert(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    image: str
    time: str
    date: str
    isNew: bool = Field(default=True)
    recognised_user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    user: Optional["User"] = Relationship(back_populates="alerts")
    embedding: Optional[List[float]] = Field(sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=lambda: datetime.now())


class FaceTemplate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    filepath: str
    embedding: List[float] = Field(sa_column=Column(JSON))
    user: "User" = Relationship(back_populates="images")


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    images: List["FaceTemplate"] = Relationship(back_populates="user")
    alerts: List["Alert"] = Relationship(back_populates="user")
    is_trusted: bool = Field(default=False)
    is_temporary: bool = Field(default=True)

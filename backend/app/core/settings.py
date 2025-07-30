from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    database_url: str = "mysql+pymysql://church_connect_user:admin@localhost/church_connect_db"
    secret_key: str = "your-secret-key-change-this-in-production"
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"
    
    class Config:
        env_file = ".env"


settings = Settings()

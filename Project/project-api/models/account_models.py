from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List
from beanie import Document
from uuid import UUID, uuid4
from enum import Enum


class OAuthMethod(str, Enum):
    google = "google"
    github = "github"
    # facebook = "facebook"
    # twitter = "twitter"
    # discord = "discord"
    # microsoft = "microsoft"


class OAuthAccount(BaseModel):
    name: str
    email: EmailStr
    oauth_method: OAuthMethod
    oauth_id: str


class AccountAuth(BaseModel):
    email: EmailStr
    password: str

    # GPT snippet
    @validator("password")
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return value

    # GPT snippet end


class AccountIn(AccountAuth):
    name: str
    email: EmailStr
    password: str


class AccountOut(BaseModel):
    account_id: UUID
    name: str
    email: EmailStr
    projects: Optional[List[UUID]] = Field([])
    projects_shared_with_me: Optional[List[UUID]] = Field([])
    my_templates: Optional[List[UUID]] = Field([])
    isAdmin: Optional[bool] = Field(False)
    emailVerified: Optional[bool] = Field(False)


class Account(AccountOut):
    account_id: UUID = Field(default_factory=uuid4)
    # optional password field for accounts created with oauth
    password: Optional[str] = Field(default=None)
    # Accounts with verified emails and multiple oauth methods will be merged
    oauth_accounts: Optional[List[OAuthAccount]] = Field([])
    isDeactivated: Optional[bool] = Field(False)


class AccountDB(Account, Document):
    class Settings:
        name = "Account"


class AccountWithToken(Account):
    access_token: str

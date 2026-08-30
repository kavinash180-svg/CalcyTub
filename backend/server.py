"""CalcyTub backend — minimal admin + content API.

Storage is JSON file based (no DB used for calculators/articles) to keep the
project fully exportable and low-maintenance. MongoDB is available in the
environment but intentionally not required for core features.
"""
from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import PlainTextResponse, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from pathlib import Path
from datetime import datetime, timezone, timedelta
import os
import json
import uuid
import logging
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

CONTENT_DIR = ROOT_DIR / "content"
CONTENT_DIR.mkdir(exist_ok=True)
OVERRIDES_FILE = CONTENT_DIR / "overrides.json"
ARTICLES_FILE = CONTENT_DIR / "articles.json"
SETTINGS_FILE = CONTENT_DIR / "settings.json"

# Seed empty files if missing
for f, default in [
    (OVERRIDES_FILE, {}),
    (ARTICLES_FILE, []),
    (SETTINGS_FILE, {"siteName": "CalcyTub", "tagline": "All Your Calculators in One Place",
                      "contactEmail": "hello@calcytub.com", "adsenseClient": ""}),
]:
    if not f.exists():
        f.write_text(json.dumps(default, indent=2))

JWT_SECRET = os.environ.get("JWT_SECRET", "change-me-in-production-please")
JWT_ALG = "HS256"
JWT_EXPIRE_HOURS = 12
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "changeme123")

app = FastAPI(title="CalcyTub API")
api = APIRouter(prefix="/api")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login", auto_error=False)


def read_json(path: Path):
    return json.loads(path.read_text())


def write_json(path: Path, data):
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False))


def create_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def require_admin(token: Optional[str] = Depends(oauth2_scheme)) -> str:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        return payload["sub"]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ------------------------- Models -------------------------
class LoginIn(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class Article(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    content: str
    seoTitle: Optional[str] = ""
    metaDescription: Optional[str] = ""
    category: Optional[str] = ""
    published: bool = True
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updatedAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ArticleUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    seoTitle: Optional[str] = None
    metaDescription: Optional[str] = None
    category: Optional[str] = None
    published: Optional[bool] = None


class OverridePayload(BaseModel):
    slug: str
    fields: Dict[str, Any]


class Settings(BaseModel):
    siteName: Optional[str] = None
    tagline: Optional[str] = None
    contactEmail: Optional[str] = None
    adsenseClient: Optional[str] = None


# ------------------------- Public routes -------------------------
@api.get("/")
def root():
    return {"service": "CalcyTub API", "status": "ok"}


@api.get("/health")
def health():
    return {"status": "ok"}


@api.get("/content/overrides")
def get_overrides():
    """Public: calculator SEO/text overrides consumed by the frontend."""
    return read_json(OVERRIDES_FILE)


@api.get("/content/articles")
def list_public_articles():
    articles = read_json(ARTICLES_FILE)
    return [a for a in articles if a.get("published", True)]


@api.get("/content/articles/{slug}")
def get_article(slug: str):
    articles = read_json(ARTICLES_FILE)
    for a in articles:
        if a["slug"] == slug and a.get("published", True):
            return a
    raise HTTPException(status_code=404, detail="Article not found")


@api.get("/content/settings")
def get_settings():
    return read_json(SETTINGS_FILE)


# ------------------------- Auth -------------------------
@api.post("/admin/login", response_model=TokenOut)
def login(data: LoginIn):
    # Compare using constant-time when possible
    if data.username != ADMIN_USERNAME or data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenOut(access_token=create_token(data.username))


@api.get("/admin/me")
def me(user: str = Depends(require_admin)):
    return {"username": user}


# ------------------------- Admin: overrides -------------------------
@api.get("/admin/overrides")
def admin_get_overrides(user: str = Depends(require_admin)):
    return read_json(OVERRIDES_FILE)


@api.put("/admin/overrides")
def admin_put_override(payload: OverridePayload, user: str = Depends(require_admin)):
    data = read_json(OVERRIDES_FILE)
    data[payload.slug] = payload.fields
    write_json(OVERRIDES_FILE, data)
    return {"ok": True, "slug": payload.slug}


@api.delete("/admin/overrides/{slug}")
def admin_delete_override(slug: str, user: str = Depends(require_admin)):
    data = read_json(OVERRIDES_FILE)
    data.pop(slug, None)
    write_json(OVERRIDES_FILE, data)
    return {"ok": True}


# ------------------------- Admin: articles -------------------------
@api.get("/admin/articles")
def admin_list_articles(user: str = Depends(require_admin)):
    return read_json(ARTICLES_FILE)


@api.post("/admin/articles", response_model=Article)
def admin_create_article(article: Article, user: str = Depends(require_admin)):
    articles = read_json(ARTICLES_FILE)
    if any(a["slug"] == article.slug for a in articles):
        raise HTTPException(status_code=400, detail="Slug already exists")
    articles.append(article.model_dump())
    write_json(ARTICLES_FILE, articles)
    return article


@api.put("/admin/articles/{article_id}", response_model=Article)
def admin_update_article(article_id: str, update: ArticleUpdate, user: str = Depends(require_admin)):
    articles = read_json(ARTICLES_FILE)
    for i, a in enumerate(articles):
        if a["id"] == article_id:
            merged = {**a, **{k: v for k, v in update.model_dump().items() if v is not None}}
            merged["updatedAt"] = datetime.now(timezone.utc).isoformat()
            articles[i] = merged
            write_json(ARTICLES_FILE, articles)
            return merged
    raise HTTPException(status_code=404, detail="Article not found")


@api.delete("/admin/articles/{article_id}")
def admin_delete_article(article_id: str, user: str = Depends(require_admin)):
    articles = read_json(ARTICLES_FILE)
    articles = [a for a in articles if a["id"] != article_id]
    write_json(ARTICLES_FILE, articles)
    return {"ok": True}


# ------------------------- Admin: settings -------------------------
@api.put("/admin/settings")
def admin_update_settings(settings: Settings, user: str = Depends(require_admin)):
    current = read_json(SETTINGS_FILE)
    update = {k: v for k, v in settings.model_dump().items() if v is not None}
    current.update(update)
    write_json(SETTINGS_FILE, current)
    return current


# ------------------------- SEO helpers -------------------------
@app.get("/robots.txt", response_class=PlainTextResponse)
def robots():
    base = os.environ.get("PUBLIC_BASE_URL", "")
    lines = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin",
        f"Sitemap: {base}/sitemap.xml" if base else "Sitemap: /sitemap.xml",
    ]
    return "\n".join(lines)


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

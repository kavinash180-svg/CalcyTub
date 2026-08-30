"""CalcyTub backend API tests (public content, admin auth, overrides, articles, settings)."""
import os

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")

ADMIN_USER = "admin"
ADMIN_PASS = "changeme123"
TEST_SLUG = "TEST_bmi-calculator"
TEST_ART_SLUG = "TEST_article-slug"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def token(client):
    r = client.post(f"{BASE_URL}/api/admin/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    if r.status_code != 200:
        pytest.fail(f"admin login failed {r.status_code}: {r.text[:300]}")
    tok = r.json().get("access_token")
    assert isinstance(tok, str) and tok
    return tok


@pytest.fixture(scope="session")
def auth(token):
    return {"Authorization": f"Bearer {token}"}


# ---------------- Public / health ----------------
class TestPublic:
    def test_health(self, client):
        r = client.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        assert r.json() == {"status": "ok"}

    def test_root(self, client):
        r = client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"

    def test_overrides_is_object(self, client):
        r = client.get(f"{BASE_URL}/api/content/overrides")
        assert r.status_code == 200
        assert isinstance(r.json(), dict)

    def test_articles_is_list(self, client):
        r = client.get(f"{BASE_URL}/api/content/articles")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_settings(self, client):
        r = client.get(f"{BASE_URL}/api/content/settings")
        assert r.status_code == 200
        d = r.json()
        for k in ("siteName", "tagline", "contactEmail"):
            assert k in d and d[k]

    def test_article_404(self, client):
        r = client.get(f"{BASE_URL}/api/content/articles/TEST_does-not-exist")
        assert r.status_code == 404

    def test_robots(self, client):
        r = client.get(f"{BASE_URL}/robots.txt")
        assert r.status_code == 200, r.text[:200]
        assert "User-agent" in r.text, f"robots.txt not served by backend: {r.text[:200]}"


# ---------------- Auth ----------------
class TestAuth:
    def test_login_wrong_password(self, client):
        r = client.post(f"{BASE_URL}/api/admin/login", json={"username": ADMIN_USER, "password": "wrong"})
        assert r.status_code == 401

    def test_login_wrong_user(self, client):
        r = client.post(f"{BASE_URL}/api/admin/login", json={"username": "nope", "password": ADMIN_PASS})
        assert r.status_code == 401

    def test_login_validation(self, client):
        r = client.post(f"{BASE_URL}/api/admin/login", json={"username": "x"})
        assert r.status_code == 422

    def test_me_with_token(self, client, auth):
        r = client.get(f"{BASE_URL}/api/admin/me", headers=auth)
        assert r.status_code == 200
        assert r.json()["username"] == ADMIN_USER

    def test_me_no_token(self, client):
        r = client.get(f"{BASE_URL}/api/admin/me")
        assert r.status_code == 401

    def test_me_bad_token(self, client):
        r = client.get(f"{BASE_URL}/api/admin/me", headers={"Authorization": "Bearer garbage"})
        assert r.status_code == 401

    def test_admin_overrides_requires_auth(self, client):
        r = client.get(f"{BASE_URL}/api/admin/overrides")
        assert r.status_code == 401


# ---------------- Overrides CRUD ----------------
class TestOverrides:
    def test_put_get_delete_override(self, client, auth):
        payload = {"slug": TEST_SLUG, "fields": {"shortDescription": "TEST desc", "seoTitle": "TEST seo"}}
        r = client.put(f"{BASE_URL}/api/admin/overrides", json=payload, headers=auth)
        assert r.status_code == 200
        assert r.json()["slug"] == TEST_SLUG

        r = client.get(f"{BASE_URL}/api/content/overrides")
        assert r.status_code == 200
        assert r.json().get(TEST_SLUG, {}).get("shortDescription") == "TEST desc"

        r = client.get(f"{BASE_URL}/api/admin/overrides", headers=auth)
        assert r.status_code == 200
        assert TEST_SLUG in r.json()

        r = client.delete(f"{BASE_URL}/api/admin/overrides/{TEST_SLUG}", headers=auth)
        assert r.status_code == 200
        r = client.get(f"{BASE_URL}/api/content/overrides")
        assert TEST_SLUG not in r.json()


# ---------------- Articles CRUD ----------------
class TestArticles:
    created_id = None

    def test_create_and_fetch(self, client, auth):
        payload = {"slug": TEST_ART_SLUG, "title": "TEST Title", "content": "TEST body content",
                   "metaDescription": "TEST meta", "published": True}
        r = client.post(f"{BASE_URL}/api/admin/articles", json=payload, headers=auth)
        assert r.status_code == 200, r.text[:300]
        a = r.json()
        assert a["slug"] == TEST_ART_SLUG and a["title"] == "TEST Title"
        assert "_id" not in a
        TestArticles.created_id = a["id"]

        r = client.get(f"{BASE_URL}/api/content/articles/{TEST_ART_SLUG}")
        assert r.status_code == 200
        assert r.json()["content"] == "TEST body content"

        r = client.get(f"{BASE_URL}/api/content/articles")
        assert any(x["slug"] == TEST_ART_SLUG for x in r.json())

    def test_duplicate_slug(self, client, auth):
        payload = {"slug": TEST_ART_SLUG, "title": "dup", "content": "dup"}
        r = client.post(f"{BASE_URL}/api/admin/articles", json=payload, headers=auth)
        assert r.status_code == 400

    def test_update_article(self, client, auth):
        assert TestArticles.created_id
        r = client.put(f"{BASE_URL}/api/admin/articles/{TestArticles.created_id}",
                       json={"title": "TEST Updated"}, headers=auth)
        assert r.status_code == 200
        assert r.json()["title"] == "TEST Updated"
        r = client.get(f"{BASE_URL}/api/content/articles/{TEST_ART_SLUG}")
        assert r.json()["title"] == "TEST Updated"

    def test_unpublish_hides_from_public(self, client, auth):
        r = client.put(f"{BASE_URL}/api/admin/articles/{TestArticles.created_id}",
                       json={"published": False}, headers=auth)
        assert r.status_code == 200
        pub = client.get(f"{BASE_URL}/api/content/articles/{TEST_ART_SLUG}")
        assert pub.status_code == 404, "unpublished article still public (published=False ignored)"
        # re-publish
        client.put(f"{BASE_URL}/api/admin/articles/{TestArticles.created_id}",
                   json={"published": True}, headers=auth)

    def test_update_404(self, client, auth):
        r = client.put(f"{BASE_URL}/api/admin/articles/TEST_nope", json={"title": "x"}, headers=auth)
        assert r.status_code == 404

    def test_delete_article(self, client, auth):
        r = client.delete(f"{BASE_URL}/api/admin/articles/{TestArticles.created_id}", headers=auth)
        assert r.status_code == 200
        r = client.get(f"{BASE_URL}/api/content/articles/{TEST_ART_SLUG}")
        assert r.status_code == 404


# ---------------- Settings ----------------
class TestSettings:
    def test_update_settings_and_restore(self, client, auth):
        original = client.get(f"{BASE_URL}/api/content/settings").json()
        r = client.put(f"{BASE_URL}/api/admin/settings", json={"tagline": "TEST tagline"}, headers=auth)
        assert r.status_code == 200
        assert r.json()["tagline"] == "TEST tagline"
        assert client.get(f"{BASE_URL}/api/content/settings").json()["tagline"] == "TEST tagline"
        # restore
        client.put(f"{BASE_URL}/api/admin/settings", json={"tagline": original.get("tagline")}, headers=auth)
        assert client.get(f"{BASE_URL}/api/content/settings").json()["tagline"] == original.get("tagline")

    def test_settings_requires_auth(self, client):
        r = client.put(f"{BASE_URL}/api/admin/settings", json={"tagline": "x"})
        assert r.status_code == 401

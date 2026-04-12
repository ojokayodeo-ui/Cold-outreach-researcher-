import httpx
from bs4 import BeautifulSoup
import re

SCRAPE_TIMEOUT = 15.0
MAX_CONTENT_CHARS = 4000


def _clean_text(text: str) -> str:
    return re.sub(r'\s+', ' ', text).strip()


def _extract_text_blocks(soup: BeautifulSoup, tag: str, limit: int = 5) -> list:
    blocks = [_clean_text(el.get_text()) for el in soup.find_all(tag)]
    return [b for b in blocks if len(b) > 20][:limit]


def scrape_company_website(url: str) -> dict:
    """Fetch a company URL and return structured text content for Claude."""
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    headers = {
        'User-Agent': (
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/120.0.0.0 Safari/537.36'
        )
    }

    try:
        with httpx.Client(timeout=SCRAPE_TIMEOUT, follow_redirects=True, verify=False) as client:
            response = client.get(url, headers=headers)
            response.raise_for_status()
            html = response.text
    except httpx.TimeoutException:
        raise ValueError(f"Timed out fetching {url} — the site may be slow or blocking requests.")
    except httpx.HTTPStatusError as e:
        raise ValueError(f"HTTP {e.response.status_code} error fetching {url}.")
    except Exception as e:
        raise ValueError(f"Could not fetch {url}: {str(e)}")

    soup = BeautifulSoup(html, 'lxml')

    # Strip noise
    for tag in soup.find_all(['script', 'style', 'nav', 'footer', 'noscript',
                               'meta', 'link', 'iframe', 'aside', 'form']):
        tag.decompose()

    # Page metadata
    title = _clean_text(soup.title.get_text()) if soup.title else ''
    meta_desc = ''
    og_desc = soup.find('meta', attrs={'property': 'og:description'})
    plain_desc = soup.find('meta', attrs={'name': 'description'})
    if plain_desc:
        meta_desc = plain_desc.get('content', '')
    elif og_desc:
        meta_desc = og_desc.get('content', '')

    # Headings
    h1s = _extract_text_blocks(soup, 'h1', 3)
    h2s = _extract_text_blocks(soup, 'h2', 8)
    h3s = _extract_text_blocks(soup, 'h3', 8)

    # Body copy
    paragraphs = _extract_text_blocks(soup, 'p', 30)
    main_content = ' '.join(paragraphs)[:MAX_CONTENT_CHARS]

    # List items (features, services, team bios)
    list_items = _extract_text_blocks(soup, 'li', 25)

    return {
        'url': url,
        'title': title[:200],
        'meta_description': meta_desc[:500] if meta_desc else '',
        'h1_headings': h1s,
        'h2_headings': h2s,
        'h3_headings': h3s,
        'main_content': main_content,
        'list_items': list_items[:20],
    }

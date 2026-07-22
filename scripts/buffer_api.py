#!/usr/bin/env python3
"""
Buffer GraphQL API wrapper for PYP social posting.
Endpoint: https://api.buffer.com/graphql
Org ID: 69ce9c55b5725a6caf7701c8

Channel IDs:
  Facebook:  69ce9c97af47dacb69807866
  Instagram: 69ce9cb6af47dacb698078da
  Pinterest: 69ce9cd3af47dacb6980795e

Pinterest Board:
  "Orlando Theme Parks" serviceId: 1106900483355706576

Rate limits: 20 calls/15min, 100 calls/24hr

Usage:
  python3 buffer_api.py profiles
  python3 buffer_api.py test
  python3 buffer_api.py facebook "Post text" [image_url]
  python3 buffer_api.py instagram "Post text" image_url
  python3 buffer_api.py pinterest "Post text" image_url [destination_url] [title]
  python3 buffer_api.py idea "Title" "Body text"
  python3 buffer_api.py delete <post_id>

Key schema notes (discovered 2026-04-02):
  - Facebook requires metadata.facebook.type ("post"|"story"|"reel")
  - Instagram requires metadata.instagram.type + shouldShareToFeed + an image/video asset
  - Pinterest requires metadata.pinterest.boardServiceId + an image asset
  - Assets are passed via assets.image.url (singular; must be publicly accessible, direct URL)
  - Image URLs must respond with proper Content-Type headers (Buffer fetches dimensions)
"""
import urllib.request
import json
import os
import time
import sys
from pathlib import Path

BUFFER_API_URL = 'https://api.buffer.com/graphql'
ORG_ID = '69ce9c55b5725a6caf7701c8'

# Prefer env / local secret file over any hard-coded key.
_ROOT = Path(__file__).resolve().parents[1]
_SECRET_CANDIDATES = [
    Path(os.environ['BUFFER_API_KEY_FILE']) if os.environ.get('BUFFER_API_KEY_FILE') else None,
    _ROOT / '.hermes' / 'buffer_api_key',
    Path.home() / '.hermes' / 'buffer_api_key',
]


def _load_token() -> str:
    env_token = os.environ.get('BUFFER_API_KEY') or os.environ.get('BUFFER_ACCESS_TOKEN')
    if env_token:
        return env_token.strip()
    for path in _SECRET_CANDIDATES:
        if path and path.exists():
            value = path.read_text().strip()
            if value:
                return value
    raise RuntimeError(
        'Missing Buffer API key. Create one at https://publish.buffer.com/settings/api '
        'then save it to .hermes/buffer_api_key or export BUFFER_API_KEY.'
    )


TOKEN = _load_token()

# Channel IDs
FACEBOOK_CHANNEL = '69ce9c97af47dacb69807866'
INSTAGRAM_CHANNEL = '69ce9cb6af47dacb698078da'
PINTEREST_CHANNEL = '69ce9cd3af47dacb6980795e'

# Pinterest board
PINTEREST_BOARD_SERVICE_ID = '1106900483355706576'

_rate_count = 0
_rate_reset = time.time()

CREATE_POST_MUTATION = '''
mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
        ... on PostActionSuccess {
            post { id text }
        }
        ... on MutationError {
            message
        }
    }
}
'''

CREATE_IDEA_MUTATION = '''
mutation CreateIdea($input: CreateIdeaInput!) {
    createIdea(input: $input) {
        ... on Idea {
            id
        }
        ... on IdeaResponse {
            idea { id }
            refreshIdeas
        }
        ... on InvalidInputError {
            message
        }
        ... on UnauthorizedError {
            message
        }
        ... on UnexpectedError {
            message
        }
        ... on LimitReachedError {
            message
        }
    }
}
'''

DELETE_POST_MUTATION = '''
mutation DeletePost($input: DeletePostInput!) {
    deletePost(input: $input) {
        ... on DeletePostSuccess {
            __typename
        }
        ... on VoidMutationError {
            message
        }
    }
}
'''


def buffer_query(query, variables=None, retry=2):
    """Make a GraphQL query with rate limit handling."""
    global _rate_count, _rate_reset

    if time.time() - _rate_reset > 900:
        _rate_count = 0
        _rate_reset = time.time()
    if _rate_count >= 18:
        wait = 900 - (time.time() - _rate_reset) + 1
        print(f'Rate limit close, waiting {wait:.0f}s...', file=sys.stderr)
        time.sleep(wait)
        _rate_count = 0
        _rate_reset = time.time()

    payload = {'query': query}
    if variables:
        payload['variables'] = variables

    for attempt in range(retry):
        req = urllib.request.Request(
            BUFFER_API_URL,
            data=json.dumps(payload).encode(),
            headers={
                'Authorization': f'Bearer {TOKEN}',
                'Content-Type': 'application/json',
                'User-Agent': 'PYP-BufferBot/1.0'
            }
        )
        try:
            resp = urllib.request.urlopen(req, timeout=15)
            _rate_count += 1
            return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:500]
            if e.code == 429 and attempt < retry - 1:
                print(f'Rate limited, waiting 60s... (attempt {attempt+1})', file=sys.stderr)
                time.sleep(60)
                continue
            return {'error': e.code, 'body': body}


def get_profiles():
    """Get all channel profile IDs for the org."""
    result = buffer_query(
        f'{{ channels(input: {{ organizationId: "{ORG_ID}" }}) '
        '{ id name service serviceId isDisconnected } }'
    )
    if 'error' in result:
        return result
    channels = result.get('data', {}).get('channels', [])
    profiles = {}
    for ch in channels:
        svc = ch.get('service', 'unknown')
        if svc not in profiles:
            profiles[svc] = []
        profiles[svc].append({
            'channel_id': ch['id'],
            'name': ch.get('name', ''),
            'service_id': ch.get('serviceId', ''),
            'disconnected': ch.get('isDisconnected', False),
        })
    return profiles


def post_to_facebook(text, image_url=None, mode='addToQueue'):
    """Post to Facebook page.
    
    Args:
        text: Post text content
        image_url: Optional publicly accessible image URL
        mode: addToQueue | shareNow | shareNext
    """
    input_data = {
        'channelId': FACEBOOK_CHANNEL,
        'text': text,
        'schedulingType': 'automatic',
        'mode': mode,
        'metadata': {
            'facebook': {
                'type': 'post'
            }
        }
    }
    if image_url:
        input_data['assets'] = {
            'image': {'url': image_url}
        }
    return buffer_query(CREATE_POST_MUTATION, {'input': input_data})


def post_to_instagram(text, image_url, mode='addToQueue'):
    """Post to Instagram. Image is REQUIRED.
    
    Args:
        text: Post text/caption (include hashtags here)
        image_url: Publicly accessible image URL (REQUIRED)
        mode: addToQueue | shareNow | shareNext
    """
    if not image_url:
        return {'error': 'Instagram requires an image URL'}
    input_data = {
        'channelId': INSTAGRAM_CHANNEL,
        'text': text,
        'schedulingType': 'automatic',
        'mode': mode,
        'metadata': {
            'instagram': {
                'type': 'post',
                'shouldShareToFeed': True
            }
        },
        'assets': {
            'image': {'url': image_url}
        }
    }
    return buffer_query(CREATE_POST_MUTATION, {'input': input_data})


def post_to_pinterest(text, image_url, destination_url='https://planyourpark.com',
                      title=None, board_service_id=None, mode='addToQueue'):
    """Post a Pin to Pinterest. Image is REQUIRED.
    
    Args:
        text: Pin description
        image_url: Publicly accessible image URL (REQUIRED)
        destination_url: Link the pin points to
        title: Pin title (defaults to first 100 chars of text)
        board_service_id: Pinterest board service ID (defaults to Orlando Theme Parks)
        mode: addToQueue | shareNow | shareNext
    """
    if not image_url:
        return {'error': 'Pinterest requires an image URL'}
    input_data = {
        'channelId': PINTEREST_CHANNEL,
        'text': text,
        'schedulingType': 'automatic',
        'mode': mode,
        'metadata': {
            'pinterest': {
                'title': title or text[:100],
                'url': destination_url,
                'boardServiceId': board_service_id or PINTEREST_BOARD_SERVICE_ID
            }
        },
        'assets': {
            'image': {'url': image_url}
        }
    }
    return buffer_query(CREATE_POST_MUTATION, {'input': input_data})


def post_to_all(text, image_url, pinterest_title=None, pinterest_url='https://planyourpark.com'):
    """Post to all three channels (Facebook, Instagram, Pinterest).
    
    Args:
        text: Post text (used for all platforms)
        image_url: Publicly accessible image URL (REQUIRED for IG/Pinterest)
        pinterest_title: Optional title for the Pin
        pinterest_url: Destination URL for the Pin
    
    Returns: dict with results per platform
    """
    results = {}
    results['facebook'] = post_to_facebook(text, image_url)
    results['instagram'] = post_to_instagram(text, image_url)
    # Pinterest title maxes at 100 chars
    pin_title = (pinterest_title or text)[:97] + "..." if len(pinterest_title or text) > 100 else (pinterest_title or text)
    results['pinterest'] = post_to_pinterest(
        text, image_url, 
        destination_url=pinterest_url,
        title=pin_title
    )
    return results


def create_idea(text, organization_id=None, title=None):
    """Create a Buffer Idea (content in the ideas board)."""
    content = {'text': text}
    if title:
        content['title'] = title
    result = buffer_query(CREATE_IDEA_MUTATION, {
        'input': {
            'organizationId': organization_id or ORG_ID,
            'content': content
        }
    })
    return result


def delete_post(post_id):
    """Delete a post by ID."""
    return buffer_query(DELETE_POST_MUTATION, {
        'input': {'id': post_id}
    })


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'help'

    if cmd == 'profiles':
        profiles = get_profiles()
        print(json.dumps(profiles, indent=2))

    elif cmd == 'test':
        result = buffer_query('{ account { id name email } }')
        print(json.dumps(result, indent=2))

    elif cmd == 'facebook':
        text = sys.argv[2] if len(sys.argv) > 2 else 'Test Facebook post from API'
        image = sys.argv[3] if len(sys.argv) > 3 else None
        print(json.dumps(post_to_facebook(text, image), indent=2))

    elif cmd == 'instagram':
        if len(sys.argv) < 4:
            print('Usage: buffer_api.py instagram "text" image_url', file=sys.stderr)
            sys.exit(1)
        text = sys.argv[2]
        image = sys.argv[3]
        print(json.dumps(post_to_instagram(text, image), indent=2))

    elif cmd == 'pinterest':
        if len(sys.argv) < 4:
            print('Usage: buffer_api.py pinterest "text" image_url [dest_url] [title]', file=sys.stderr)
            sys.exit(1)
        text = sys.argv[2]
        image = sys.argv[3]
        dest = sys.argv[4] if len(sys.argv) > 4 else 'https://planyourpark.com'
        title = sys.argv[5] if len(sys.argv) > 5 else None
        print(json.dumps(post_to_pinterest(text, image, dest, title), indent=2))

    elif cmd == 'all':
        if len(sys.argv) < 4:
            print('Usage: buffer_api.py all "text" image_url [pinterest_url]', file=sys.stderr)
            sys.exit(1)
        text = sys.argv[2]
        image = sys.argv[3]
        purl = sys.argv[4] if len(sys.argv) > 4 else 'https://planyourpark.com'
        print(json.dumps(post_to_all(text, image, pinterest_url=purl), indent=2))

    elif cmd == 'idea':
        text = sys.argv[2] if len(sys.argv) > 2 else 'Test idea from API'
        print(json.dumps(create_idea(text), indent=2))

    elif cmd == 'delete':
        if len(sys.argv) < 3:
            print('Usage: buffer_api.py delete <post_id>', file=sys.stderr)
            sys.exit(1)
        print(json.dumps(delete_post(sys.argv[2]), indent=2))

    else:
        print(f'''Buffer API CLI
Usage: {sys.argv[0]} <command> [args]

Commands:
  profiles                          List connected channels
  test                              Test API connection
  facebook "text" [image_url]       Post to Facebook
  instagram "text" image_url        Post to Instagram (image required)
  pinterest "text" image_url [url] [title]  Pin to Pinterest (image required)
  all "text" image_url [pin_url]    Post to all three channels
  idea "text"                       Create a Buffer idea
  delete <post_id>                  Delete a post
''')

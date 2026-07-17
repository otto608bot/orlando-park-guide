# Plan Your Park — Buffer social access

Hermes posts through Buffer’s GraphQL API using the existing Plan Your Park org.

## Connected channels (verified)

| Platform  | Account        | Notes                          |
|-----------|----------------|--------------------------------|
| Instagram | planyourparknow | Connected                      |
| Facebook  | Plan Your Park  | Connected                      |
| Pinterest | PlanYourPark    | Board: Orlando Theme Parks     |

No X/Twitter channel in this Buffer org yet.

## How Hermes gets access

1. Create/copy an API key in Buffer:  
   https://publish.buffer.com/settings/api
2. Save it locally (gitignored):

```bash
# from repo root
printf '%s\n' 'YOUR_BUFFER_API_KEY' > .hermes/buffer_api_key
chmod 600 .hermes/buffer_api_key
```

Or export for the session:

```bash
export BUFFER_API_KEY='YOUR_BUFFER_API_KEY'
```

3. Verify:

```bash
python3 scripts/buffer_api.py test
python3 scripts/buffer_api.py profiles
```

## CLI

```bash
python3 scripts/buffer_api.py profiles
python3 scripts/buffer_api.py facebook "Post text" [image_url]
python3 scripts/buffer_api.py instagram "Caption" image_url   # image required
python3 scripts/buffer_api.py pinterest "Desc" image_url [dest_url] [title]
python3 scripts/buffer_api.py all "Text" image_url [pin_dest_url]
python3 scripts/buffer_api.py idea "Draft idea text"
python3 scripts/buffer_api.py delete <post_id>
```

Default mode queues posts (`addToQueue`). Image URLs must be publicly reachable with correct `Content-Type`.

## Rotate / revoke

1. Create a new key at Buffer Settings → API  
2. Overwrite `.hermes/buffer_api_key`  
3. Delete/revoke the old key in Buffer  

If a key was ever committed to git, rotate it.

"""Delete only the Amazon tag-swap drafts created by apply.py. Never touches published docs or held drafts."""
import json, os, sys, urllib.request

P = "https://hd7qwtcq.api.sanity.io/v2023-10-01/"
ids = json.load(open("publish-ids.json"))["draftIdsToPublish"]
assert ids and all(i.startswith("drafts.") for i in ids)
# Hard guard: never delete the held Universal / Disney-vs-Universal / Orlando parks drafts
forbidden = set(json.load(open("publish-ids.json"))["doNotTouch"])
assert not (set(ids) & forbidden)

if "--apply" not in sys.argv:
    print("dry run would delete", ids)
    sys.exit(0)

req = urllib.request.Request(
    P + "data/mutate/production?returnIds=true",
    data=json.dumps({"mutations": [{"delete": {"id": i}} for i in ids]}).encode(),
    headers={
        "Authorization": "Bearer " + os.environ["SANITY_API_TOKEN"],
        "Content-Type": "application/json",
    },
)
r = json.load(urllib.request.urlopen(req))
json.dump(r, open("revert-result.json", "w"), indent=1)
print("deleted", ids)

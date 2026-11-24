"""Delete only the Amazon-link drafts created by apply.py. Never touches published docs or parked drafts."""
import json, os, sys, urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
ids = json.load(open(HERE / "publish-ids.json"))["draftIdsToPublish"]
do_not_touch = set(json.load(open(HERE / "publish-ids.json"))["doNotTouch"])
for i in ids:
    assert i.startswith("drafts.")
    assert i not in do_not_touch

if "--apply" not in sys.argv:
    print("dry run, would delete:")
    for i in ids:
        print(" ", i)
    print("Re-run with --apply to delete these drafts.")
    sys.exit(0)

muts = [{"delete": {"id": i}} for i in ids]
req = urllib.request.Request(
    "https://hd7qwtcq.api.sanity.io/v2023-10-01/data/mutate/production?returnIds=true",
    data=json.dumps({"mutations": muts}).encode(),
    headers={
        "Authorization": "Bearer " + os.environ["SANITY_API_TOKEN"],
        "Content-Type": "application/json",
    },
)
r = json.load(urllib.request.urlopen(req))
json.dump(r, open(HERE / "revert-result.json", "w"), indent=1)
print("deleted", len(ids), "drafts")

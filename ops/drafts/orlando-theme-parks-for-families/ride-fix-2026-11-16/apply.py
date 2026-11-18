"""Ride-data fixes + LEGOLAND closures update, 2026-11-16. Sanity DRAFTS only (drafts.*), never publishes.
Usage: python3 apply.py [--apply]   (default: dry run, prints mutations)
Every target had NO existing draft; each drafts.<id> is a createOrReplace copy of the published doc + the change."""
import json, os, secrets, sys, copy, urllib.request
P = "https://hd7qwtcq.api.sanity.io/v2023-10-01/"
def api(path, body=None):
    req = urllib.request.Request(P+path, data=json.dumps(body).encode() if body else None,
        headers={"Authorization": "Bearer "+os.environ["SANITY_API_TOKEN"], "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))
def get(i):
    d = api("data/doc/production/"+i)["documents"]; return d[0] if d else None
CHK = "Nov 16, 2026"
UO = "https://www.universalorlando.com/web/en/us/plan-your-visit/hours-information/ride-height-requirements"
SW = "https://seaworld.com/orlando/rides/"
muts, manifest = [], []
def draft_copy(pid):
    pub = get(pid); assert pub, pid
    assert get("drafts."+pid) is None, "draft already exists: "+pid
    d = {k: v for k, v in pub.items() if k not in ("_rev", "_createdAt", "_updatedAt")}
    d["_id"] = "drafts."+pid
    return pub, d
def change(pid, fields, src):
    pub, d = draft_copy(pid)
    for k, v in fields.items():
        manifest.append({"draftId": "drafts."+pid, "name": pub["name"], "field": k, "before": pub.get(k), "after": v, "source": src})
        d[k] = v
    muts.append({"createOrReplace": d})
# 1. height fixes on existing Epic Universe docs (official UO ride height page)
change("r5PBb5Nahg2bY9oktiHnab", {"heightRequirement": 40}, UO+" (Mine-Cart Madness: Minimum Height 40\")")
change("UzjbPEJ4gI65TQn8dVaVm8", {"heightRequirement": 48}, UO+" (Monsters Unchained: Minimum Height 48\")")
change("r5PBb5Nahg2bY9oktiHnwC", {"heightRequirement": 34}, UO+" (Yoshi's Adventure: Minimum Height 34\")")
change("q5bQv6QFqWcAZeLNadCzDU", {"heightRequirement": 40}, UO+" (Mario Kart: Bowser's Challenge: Minimum Height 40\")")
change("UzjbPEJ4gI65TQn8dVaTDu", {"heightRequirement": 40}, UO+" (Harry Potter and the Battle at the Ministry: Minimum Height 40\")")
change("UzjbPEJ4gI65TQn8dVaSlm", {"heightRequirement": 0}, UO+" (Constellation Carousel: no minimum; supervising companion under 48\")")
change("q5bQv6QFqWcAZeLNadCxqZ", {"heightRequirement": 0}, UO+" (Fyre Drill: no minimum; supervising companion under 48\")")
# closures: only undated or past Jan 31, 2027
change("UzjbPEJ4gI65TQn8dT7ymH", {"isClosed": True, "closureNote": f"Closed for annual maintenance; SeaWorld lists no reopening date (checked {CHK})"},
       "https://seaworld.com/orlando/rides/ + https://seaworld.com/orlando/park-info/ride-attraction-schedule (\"Closed for Annual Maintenance\", no date)")
change("ride-legoland-kid-power-towers", {"isClosed": True, "closureNote": f"Closed starting Nov 10, 2026; LEGOLAND lists no reopening date (checked {CHK})"},
       "https://www.legoland.com/florida/plan-your-visit/know-before-you-go/temporary-closures/ (\"Kid Power Towers (Starting 11/10)\", no end date)")
# 2. new ride docs (drafts.<id>), schema copied from published ride docs (park is a plain string, slug object, accessibility array)
UOR = "https://www.universalorlando.com/web/en/us/things-to-do/rides-attractions/"
SWC = "https://seaworld.com/orlando/roller-coasters/"
SWS = "https://seaworld.com/orlando/sesame-street/attractions/"
new = [
 ("ride-usf-villain-con-minion-blast","Illumination's Villain-Con Minion Blast","Universal Studios Florida","Illumination's Minion Land",0,"Interactive","usf-villain-con",
  "An interactive blaster attraction in Minion Land where you test your skill as a Villain-Con recruit. Children under 48 inches need a supervising companion.", UOR+"illuminations-villain-con-minion-blast + "+UO),
 ("ride-usf-trolls-trollercoaster","Trolls Trollercoaster","Universal Studios Florida","DreamWorks Land",36,"Family Coaster","usf-trolls",
  "A family coaster aboard the caterpillar Caterbus with Poppy, Tiny and the twins, escaping spooky spiders. Children under 48 inches need a supervising companion.", UOR+"trolls-trollercoaster + "+UO),
 ("ride-ioa-flight-of-the-hippogriff","Flight of the Hippogriff","Islands of Adventure","Hogsmeade",36,"Family Coaster","ioa-hippogriff",
  "A family roller coaster that spirals and dives around Hagrid's pumpkin patch. Children under 48 inches need a supervising companion.", UOR+"flight-of-the-hippogriff + "+UO),
 ("ride-sw-elmos-choo-choo-train","Elmo's Choo Choo Train","SeaWorld Orlando","Sesame Street Land",36,"Train","sw-elmo-choo-choo",
  "An interactive bell-ringing, horn-honking train ride with Elmo as your guide.", SWS+"elmos-choo-choo-train + "+SW+" (36\" min; the ride page's accessibility paragraph separately mentions 42\")"),
 ("ride-sw-super-grovers-box-car-derby","Super Grover's Box Car Derby","SeaWorld Orlando","Sesame Street Land",38,"Family Coaster","sw-grover-box-car",
  "A family-friendly steel coaster with hills, big turns and mini-dives. Guests 38 to 41 inches need a supervising companion.", SWS+"super-grovers-box-car-derby + "+SW),
 ("ride-sw-expedition-odyssey-fire-ice","Expedition Odyssey: Fire & Ice","SeaWorld Orlando",None,39,None,"sw-expedition-odyssey",
  "A story-driven Arctic research adventure that ends in a live encounter with beluga whales and walruses.", SW+"expedition-odyssey-fire-ice + "+SW),
 ("ride-sw-penguin-trek","Penguin Trek","SeaWorld Orlando",None,42,"Family Coaster","sw-penguin-trek",
  "A family launch coaster through Antarctica at up to 43 mph. Maximum height 78 inches.", SWC+"penguin-trek + "+SW),
 ("ride-sw-ice-breaker","Ice Breaker","SeaWorld Orlando",None,48,"Coaster","sw-ice-breaker",
  "A roller coaster with four launches and Florida's steepest beyond-vertical drop. Guests 48 to 54 inches need a supervising companion.", SWC+"ice-breaker + "+SW),
]
for _id,name,park,land,h,rt,slug,desc,src in new:
    assert get(_id) is None and get("drafts."+_id) is None
    doc = {"_id":"drafts."+_id,"_type":"ride","name":name,"park":park,"heightRequirement":h,"description":desc,
           "accessibility":[],"slug":{"_type":"slug","current":slug}}
    if land: doc["land"]=land
    if rt: doc["rideType"]=rt
    muts.append({"createOrReplace": doc})
    manifest.append({"draftId":"drafts."+_id,"name":name,"field":"NEW DOC heightRequirement","before":None,"after":h,"source":src})
# 3. LEGOLAND post draft (published doc is live; draft copy created from it)
LLC = "https://www.legoland.com/florida/plan-your-visit/know-before-you-go/temporary-closures/"
pub, post = draft_copy("blogPost-legoland-florida-rides-by-height")
body = post["body"]; K = lambda: secrets.token_hex(6)
def sp(t, m=None): return {"_key":K(),"_type":"span","marks":m or [],"text":t}
def find(key): return next(i for i,b in enumerate(body) if b["_key"]==key)
def blk(bold, rest): return {"_key":K(),"_type":"block","children":[sp(bold,["strong"]),sp(rest)],"level":1,"listItem":"bullet","markDefs":[],"style":"normal"}
body[find("a38619c0c6a5")]["children"][0]["text"] = "Closed Right Now (Checked November 16, 2026)"
b = body[find("2c99f66b6035")]  # DUPLO Train and DUPLO Tractor 11/2-11/11 -> Tractor only, no end date
b["children"][0]["text"] = "DUPLO Tractor:"; b["children"][1]["text"] = " closed starting November 2, no reopening date listed"
i = find("002a19e58e40")  # after Imagination Zone
body.insert(i+1, blk("Kid Power Towers:", " closed starting November 10, no reopening date listed"))
body.insert(i+2, blk("Cypress Gardens:", " closed November 10 to 20"))
body.insert(i+3, blk("LEGO NINJAGO The Ride and The Dragon:", " closed November 30 to December 18"))
b = body[find("b40a08a412fa")]; b["children"][1]["text"] += " Closed November 30 to December 18."
b = body[find("26687ef9b1e7")]; b["children"][1]["text"] += " Closed November 30 to December 18."
b = body[find("613eebff2714")]; b["children"][1]["text"] = b["children"][1]["text"].replace(" Closed November 2 to 11.", "")
b = body[find("76d400c915c3")]; b["children"][1]["text"] = b["children"][1]["text"].replace("Closed November 2 to 11.", "Closed starting November 2, with no reopening date listed.")
b = body[find("7bd025e95f60")]; b["children"][-1]["text"] += " It has also been closed since November 10, with no reopening date listed, so check LEGOLAND's closures page before you plan around it."
b = body[find("c96f6d460fc8")]; b["children"][1]["text"] = b["children"][1]["text"].replace("DUPLO Valley (Train, Tractor and the splash area)", "DUPLO Valley (Train and the splash area; the Tractor is closed right now)")
post["body"] = body
muts.append({"createOrReplace": post})
manifest.append({"draftId":post["_id"],"name":pub["title"],"field":"body (closures list, ride entries, Kid Power Towers, plan-by-age)","before":"see legoland-post-published-BEFORE.json","after":"see legoland-post-draft-AFTER.json","source":LLC})
for m in muts: assert list(m.values())[0]["_id"].startswith("drafts.")
json.dump(manifest, open("manifest.json","w"), indent=1)
json.dump(post, open("legoland-post-draft-AFTER.json","w"), indent=1)
if "--apply" in sys.argv:
    r = api("data/mutate/production?returnIds=true", {"mutations": muts})
    json.dump(r, open("apply-result.json","w"), indent=1); print("applied", len(r["results"]))
else:
    print("dry run", len(muts), "mutations;", len(manifest), "manifest rows")

"""Build Sanity draft mutations for LEGOLAND Florida ride docs (2026-11-09).
Drafts only (drafts.*). Never publishes. Usage: python3 build_ride_drafts.py [--apply]"""
import json, os, sys, urllib.request
CHECKED = "2026-11-09"
B = "https://www.legoland.com/florida/things-to-do/theme-park/rides-attractions/"
CHART = "https://www.legoland.com/florida/plan-your-visit/know-before-you-go/attraction-height-restrictions/"
CLOSURES = "https://www.legoland.com/florida/plan-your-visit/know-before-you-go/temporary-closures/"
PROJECT, DATASET = "hd7qwtcq", "production"

# Existing docs: patch on top of a draft copy of the published doc
existing = [
  dict(id="200HsSeCmp0rIIhq3n1hwQ", name="Lost Kingdom Adventure", set={"heightRequirement": 30}, before=0,
       sources=[B+"lost-kingdom-adventure/", CHART]),
  dict(id="r5PBb5Nahg2bY9oktfrH4o", name="Beetle Bounce", set={"heightRequirement": 36}, before=0,
       sources=[B+"beetle-bounce/", CHART]),
  dict(id="q5bQv6QFqWcAZeLNaYbW4i", name="Flying School", before=44,
       set={"isClosed": True, "closureNote": "Permanently closed after its final rides on Aug 16, 2023, per LEGOLAND Florida's Jul 13, 2023 press release (reprinted by Mousesteps and reported by ClickOrlando and The Ledger). No longer listed on LEGOLAND Florida's official rides or height pages, and its official page returns 404 (checked Nov 9, 2026)."},
       sources=["https://www.mousesteps.com/2023/07/14/flying-school-roller-coaster-at-legoland-florida-to-make-final-flight-on-august-16th-2023/",
                "https://www.clickorlando.com/theme-parks/2023/07/13/flying-school-roller-coaster-set-to-close-at-legoland-florida-resort/",
                "https://www.theledger.com/story/news/local/2025/03/25/legoland-florida-plans-to-launch-indoor-roller-coast-next-year/82649663007/",
                B+"flying-school/ (404)", B]),
]

def closed(dates, reopen):
    return f"Temporarily closed {dates}{reopen}, per LEGOLAND Florida's official temporary closures page (checked Nov 9, 2026)."

new = [
 # slug, name, height, rideType, thrill, accessibility, description, extra
 ("galacticoaster","Galacticoaster",36,"Coaster",3,[],"An indoor LEGO space coaster you customize; riders under 48\" ride with a responsible rider 13+ and 48\"+.",{}),
 ("kid-power-towers","Kid Power Towers",38,"Drop Tower",2,[],"Pull yourself up the tower, then float back down. Under 48\" ride with a responsible rider 14+. (Official height chart says 30\"; the ride page says 38\". Using 38\".)",{}),
 ("coast-guard-academy","Coast Guard Academy",34,"Boat Ride",1,["transfer-accessible"],"Captain your own boat on calm waterways; 34–48\" ride with a responsible rider 14+.",{}),
 ("rescue-academy","Rescue Academy",34,"Interactive",1,["transfer-accessible"],"Pump a fire truck and spray water to put out a pretend fire; 34–48\" ride with a responsible rider 14+.",{}),
 ("safari-trek","Safari Trek",34,"Car Ride",1,[],"A gentle jeep ride past LEGO animals; under 48\" ride with a responsible rider 14+.",{}),
 ("royal-joust","Royal Joust",36,"Kiddie Ride",1,[],"Kids ride their own LEGO horse through a medieval forest. Ages 4–12 only, max 170 lbs.",{}),
 ("technicycle","Technicycle",36,"Pedal Ride",2,["transfer-accessible"],"Pedal faster to fly higher on this rider-controlled spinner; 36–48\" ride with a responsible person 14+ and 48\"+.",
   {"isClosed":True,"closureNote":closed("Nov 2–20, 2026","")}),
 ("unikitty-disco-drop","Unikitty's Disco Drop",40,"Drop Tower",2,[],"A spinning, bouncing drop tower in Unikitty's disco; 40–48\" ride with a supervising companion 14+ and 48\"+.",{}),
 ("masters-of-flight","THE LEGO MOVIE Masters of Flight",40,"Flying Theater",2,[],"A suspended flying-theater ride on Emmet's triple-decker couch; 40–52\" ride with a companion 14+ and 52\"+.",{}),
 ("great-lego-race","The Great LEGO Race",42,"Coaster",3,["transfer-accessible"],"A wild-mouse family coaster (optional VR experience needs 35\"+ and is separate); 42–47\" ride with a responsible rider 14+ and 48\"+.",{}),
 ("mias-riding-adventure","Mia's Riding Adventure",48,"Coaster",4,[],"A spinning disc coaster at Mia's riding camp; 48\" minimum.",{}),
 ("aquazone-wave-racers","AQUAZONE Wave Racers",40,"Water Ride",3,[],"Spinning jet-ski style ride dodging water blasts; riders stand. Under 52\" ride with a responsible rider 14+. (Ride page says 40\" minimum; the chart's first line says 52\". Using 40\".)",{}),
 ("grand-carousel","The Grand Carousel",0,"Carousel",1,["transfer-accessible"],"Double-decker carousel in Fun Town; under 48\" ride with a responsible person 14+ and 48\"+.",{}),
 ("duplo-tractor","DUPLO Tractor",0,"Kiddie Ride",1,[],"A toddler tractor ride through DUPLO Valley; under 42\" ride with a responsible person 14+ and 48\"+. No handheld infants.",
   {"isClosed":True,"closureNote":closed("Nov 2–11, 2026","")}),
 ("battle-of-bricksburg","Battle of Bricksburg",0,"Water Ride",1,[],"Interactive splash boat ride in THE LEGO MOVIE WORLD; under age 6 or under 48\" ride with a responsible person 16+.",
   {"isClosed":True,"closureNote":"Temporarily closed starting Nov 2, 2026, with no reopening date given, per LEGOLAND Florida's official temporary closures page (checked Nov 9, 2026)."}),
 ("pirate-river-quest","Pirate River Quest",0,"Boat Ride",1,[],"A pirate boat ride and treasure hunt; riders may get splashed.",{}),
]
official_url = {"galacticoaster":"galacticoaster","kid-power-towers":"kid-power-towers","coast-guard-academy":"coast-guard-academy",
 "rescue-academy":"rescue-academy","safari-trek":"safari-trek","royal-joust":"royal-joust","technicycle":"technicycle",
 "unikitty-disco-drop":"unikitty-s-disco-drop","masters-of-flight":"the-lego-movie-masters-of-flight","great-lego-race":"the-great-lego-race",
 "mias-riding-adventure":"mia-s-riding-adventure","aquazone-wave-racers":"aquazone-wave-racers","grand-carousel":"the-grand-carousel",
 "duplo-tractor":"duplo-tractor","battle-of-bricksburg":"battle-of-bricksburg","pirate-river-quest":"pirate-river-quest"}

def api(path, body=None):
    req = urllib.request.Request(f"https://{PROJECT}.api.sanity.io/v2023-10-01/{path}",
        data=json.dumps(body).encode() if body else None,
        headers={"Authorization": "Bearer "+os.environ["SANITY_API_TOKEN"], "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))

muts, manifest = [], []
for e in existing:
    pub = api(f"data/doc/{DATASET}/{e['id']}")["documents"][0]
    doc = {k: v for k, v in pub.items() if not k.startswith("_") or k == "_type"}
    doc.update(e["set"]); doc["_id"] = "drafts."+e["id"]
    muts.append({"createOrReplace": doc})
    manifest.append({"draftId": doc["_id"], "name": e["name"], "status": "updated",
        "heightBefore": e["before"], "heightAfter": doc.get("heightRequirement"),
        "changes": e["set"], "sources": e["sources"], "checked": CHECKED})
for slug, name, h, rt, th, acc, desc, extra in new:
    _id = "drafts.ride-legoland-"+slug
    doc = {"_id": _id, "_type": "ride", "name": name, "park": "LEGOLAND Florida", "slug": {"_type": "slug", "current": "ll-"+slug},
           "heightRequirement": h, "rideType": rt, "thrillLevel": th, "accessibility": acc, "description": desc, **extra}
    assert all(d.get("createOrReplace", {}).get("_id") != _id for d in muts)
    muts.append({"createOrReplace": doc})
    src = [B+official_url[slug]+"/", CHART] + ([CLOSURES] if "closureNote" in extra or slug=="pirate-river-quest" else [])
    manifest.append({"draftId": _id, "name": name, "status": "new", "heightBefore": None, "heightAfter": h,
        "changes": extra, "sources": src, "checked": CHECKED})
json.dump({"mutations": muts}, open("mutations.json","w"), indent=1)
json.dump(manifest, open("manifest.json","w"), indent=1)
print(len(muts), "mutations")
if "--apply" in sys.argv:
    for m in muts: assert list(m.values())[0]["_id"].startswith("drafts.")
    r = api(f"data/mutate/{DATASET}?returnIds=true", {"mutations": muts})
    print(json.dumps(r, indent=1)); json.dump(r, open("apply-result.json","w"), indent=1)

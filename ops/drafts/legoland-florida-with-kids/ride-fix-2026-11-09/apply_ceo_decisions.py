"""CEO decisions 2026-11-09 (round 2). Drafts only; never publishes."""
import json, os, secrets, urllib.request
P="https://hd7qwtcq.api.sanity.io/v2023-10-01/"
def api(path, body=None):
    req=urllib.request.Request(P+path,data=json.dumps(body).encode() if body else None,
        headers={"Authorization":"Bearer "+os.environ["SANITY_API_TOKEN"],"Content-Type":"application/json"})
    return json.load(urllib.request.urlopen(req))
def get(i): 
    d=api(f"data/doc/production/{i}")["documents"]; return d[0] if d else None
NOTLIST="Not on LEGOLAND Florida's current ride list (checked Nov 9, 2026)"
muts=[]
muts.append({"patch":{"id":"drafts.ride-legoland-pirate-river-quest","set":{"isClosed":True,
  "closureNote":"Temporarily closed; LEGOLAND hasn't announced a reopening date (checked Nov 9, 2026)"}}})
for pid in ["RLBxGAumPb4EPh1Y0BD12c","q5bQv6QFqWcAZeLNaYbnsf"]:
    pub=get(pid); assert pub and pub["park"]=="LEGOLAND Florida", pid
    assert get("drafts."+pid) is None
    doc={k:v for k,v in pub.items() if not k.startswith("_") or k=="_type"}
    doc.update({"_id":"drafts."+pid,"isClosed":True,"closureNote":NOTLIST}); muts.append({"createOrReplace":doc})
for i in ["drafts.ride-legoland-duplo-tractor","drafts.ride-legoland-technicycle"]:
    muts.append({"patch":{"id":i,"unset":["isClosed","closureNote"]}})

# Post body: Wave Racers 40", under 52" with an adult
post=get("drafts.blogPost-legoland-florida-rides-by-height"); body=post["body"]
k=lambda: secrets.token_hex(6)
def sp(t,m=None): return {"_key":k(),"_type":"span","marks":m or [],"text":t}
def find(key): return next(i for i,b in enumerate(body) if b["_key"]==key)
def setkids(key,kids): body[find(key)]["children"]=kids
setkids("2aea803bc471",[sp("LEGOLAND Florida is built for younger kids, and it shows in the height chart. Most rides open up somewhere between "),sp("30 and 42 inches",["strong"]),sp(", and only one ride in the theme park needs a child taller than that: Mia's Riding Adventure ("),sp("48 inches",["strong"]),sp("). AQUAZONE Wave Racers starts at "),sp("40 inches",["strong"]),sp(", and riders under 52 inches ride with an adult.")])
setkids("cfdf87e05ada",[sp("40 inches:",["strong"]),sp(" The Dragon, Unikitty's Disco Drop, THE LEGO MOVIE Masters of Flight, AQUAZONE Wave Racers (under 52 inches with an adult)")])
body.pop(find("df40229afdf0"))  # "52 inches: AQUAZONE Wave Racers"
wr=body.pop(find("38354c7babb6"))
wr["children"]=[sp("AQUAZONE Wave Racers (40 inches):",["strong"]),sp(" you race through the waves in LEGO Technic vehicles and dodge water blasts, standing the whole time. Riders 40 to 52 inches ride with an adult (a responsible rider 14 or older) in the same vehicle; 52 inches and up can ride alone.")]
body.insert(find("2664da95f29f")+1, wr)  # after Masters of Flight in the 40-42 section
setkids("5daea0746898",[sp("36 to 41 inches:",["strong"]),sp(" go straight to Galacticoaster at opening, since it's the newest ride. Then Merlin's Challenge, Beetle Bounce and Royal Joust. At 40 inches, add The Dragon, Unikitty's Disco Drop and AQUAZONE Wave Racers (with an adult). Fill gaps with MINILAND USA, a walk-through of American cities built from more than 32 million LEGO bricks.")])
setkids("9d5a582b6614",[sp("48 inches and up:",["strong"]),sp(" everything in the theme park is open (AQUAZONE Wave Racers still needs an adult along until 52 inches). Ride Mia's Riding Adventure and Galacticoaster early, then repeat favorites.")])
setkids("c494a3a7b894",[sp("There's no single park-wide rule. Several rides have no minimum height, most rides open between 30 and 42 inches, and Mia's Riding Adventure needs 48 inches. AQUAZONE Wave Racers starts at 40 inches, with riders under 52 inches riding with an adult (checked November 9, 2026).")])
setkids("95d5eb19f3cb",[sp("Mia's Riding Adventure has the tallest minimum in the theme park at 48 inches. AQUAZONE Wave Racers starts at 40 inches, but riders under 52 inches must ride with an adult.")])
muts.append({"patch":{"id":post["_id"],"ifRevisionID":post["_rev"],"set":{"body":body}}})
for m in muts: assert list(m.values())[0]["id" if "patch" in m else "_id"].startswith("drafts.")
r=api("data/mutate/production?returnIds=true",{"mutations":muts}); print(json.dumps(r["results"]))
json.dump(r,open("apply-result-round2.json","w"),indent=1)

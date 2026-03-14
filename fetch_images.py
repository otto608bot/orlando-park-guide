#!/usr/bin/env python3
"""Download Wikimedia Commons images for theme park rides."""
import json, time, urllib.request, urllib.parse, os, sys

BASE = "/Users/rufusbot/.openclaw/workspace/orlando-park-guide/images/rides"
UA = "PlanYourPark/1.0 (planyourpark.com; educational)"

# Map: ride_id -> wikimedia filename (from our searches)
RIDES = {
    # USF
    "usf-minion": "Despicable Me- Minion Mayhem (Orlando) May 2023.jpg",
    "usf-fast-furious": "Fast & Furious Supercharged (Universal Studios Florida) 1.jpg",
    "usf-mib": "Men in Black - panoramio.jpg",
    "usf-jimmy-fallon": "Race Through New York Starring Jimmy Fallon (36916486110).jpg",
    "usf-mummy": "Revenge of the Mummy (Universal Studios Florida) entrance.jpg",
    "usf-simpsons": "The Simpsons Ride at Universal Studios Florida.jpg",
    "usf-transformers": "Transformers The Ride - Universal Studios Florida.JPG",
    # IOA
    "ioa-cat-hat": "The Cat in the Hat dark ride entrance.jpg",
    "ioa-doom": "Doctor Doom's Fearfall 1.jpg",
    "ioa-dudley": "Dudley Do-Right June 2025.jpg",
    "ioa-hagrid": "Hagrid's Magical Creatures Motorbike Adventure 1.jpg",
    "ioa-forbidden-journey": "Universal-Islands-of-Adventure-Harry-Potter-Castle-8892i.jpg",
    "ioa-seuss-trolley": "TheHighInTheSkySeussTrolleyTrainRide.JPG",
    "ioa-hulk": "The Incredible Hulk (roller coaster) May 2023.JPG",
    "ioa-jurassic-river": "Jurassic Park River Adventure May 2023.JPG",
    "ioa-velocicoaster": "Islands of Adventure Orlando (51149417278) (cropped).jpg",
    "ioa-one-fish": "Seuss Landing 12.jpg",
    "ioa-popeye": "Popeye and Blutos Bilge-Rat Barges 13.jpg",
    "ioa-pteranodon": "Pteranodon Flyers 5.jpg",
    "ioa-kong": "Skull Island Reign of Kong 01.jpg",
    "ioa-spiderman": "Amazing Adventures of Spider-Man ride vehicle IOA.jpg",
    "ioa-storm": "Marvel Super Hero Island 12.jpg",
    # SeaWorld
    "sw-mako": "Mako (SeaWorld Orlando) 1.jpg",
    "sw-kraken": "Seaworld-Orlando-Kraken-1629.jpg",
    "sw-manta": "Manta (SeaWorld Orlando) 2023 1.jpg",
    "sw-pipeline": "Pipeline The Surf Coaster's over-banked turn.jpg",
    "sw-infinity": "Infinity Falls layout drop.jpg",
    "sw-journey-atlantis": "Journey to Atlantis - SeaWorld Orlando.jpg",
    "sw-antarctica": "Antarctica Empire of the Penguin entrance 1.jpg",
    "sw-sky-tower": "Seaworld-Orlando-Tower-1473.jpg",
    # LEGOLAND
    "ll-coastersaurus": "Coastersaurus (Legoland California) 1.jpg",
    "ll-dragon": "Legoland FL (8219689220).jpg",
    "ll-flying-school": "LEGOLAND Florida Flight School (6256989881).jpg",
    "ll-ninjago": "Ninjago The Ride 01.jpg",
    "ll-lost-kingdom": "Lost Kingdom Adventure entrance.jpg",
    "ll-beetle-bounce": "Beetle Bounce. (4771424449).jpg",
}

def get_url(filename):
    """Get direct URL for a Wikimedia Commons file."""
    encoded = urllib.parse.quote(filename.replace(" ", "_"))
    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{encoded}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(api_url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read())
        pages = data["query"]["pages"]
        page = list(pages.values())[0]
        if "imageinfo" in page:
            return page["imageinfo"][0]["url"]
    return None

def download(ride_id, filename):
    """Download image for a ride."""
    outpath = os.path.join(BASE, f"{ride_id}.jpg")
    try:
        url = get_url(filename)
        if not url:
            print(f"FAIL: {ride_id} - could not resolve URL for '{filename}'")
            return False
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            with open(outpath, "wb") as f:
                f.write(data)
        print(f"OK: {ride_id} ({len(data)} bytes) <- {filename}")
        return True
    except Exception as e:
        print(f"FAIL: {ride_id} - {e}")
        return False

ok = 0
fail = 0
for ride_id, filename in RIDES.items():
    if download(ride_id, filename):
        ok += 1
    else:
        fail += 1
    time.sleep(2)

print(f"\nDone: {ok} success, {fail} failed")

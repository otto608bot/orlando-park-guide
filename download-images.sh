#!/bin/bash
cd /Users/rufusbot/.openclaw/workspace/orlando-park-guide
UA="User-Agent: PlanYourPark/1.0 (planyourpark.com; educational)"

download() {
    local id="$1"
    local filename="$2"
    local url
    
    # Get URL via Wikimedia API
    url=$(curl -s "https://commons.wikimedia.org/w/api.php?action=query&titles=File:${filename}&prop=imageinfo&iiprop=url&format=json" | python3 -c "import sys,json; d=json.load(sys.stdin); pages=d['query']['pages']; print(list(pages.values())[0]['imageinfo'][0]['url'])" 2>/dev/null)
    
    if [ -z "$url" ]; then
        echo "FAIL: $id - could not resolve URL for $filename"
        return 1
    fi
    
    local code
    code=$(curl -L -o "images/rides/${id}.jpg" "$url" -H "$UA" --max-time 30 -s -w "%{http_code}")
    
    if [ "$code" = "200" ]; then
        local ftype
        ftype=$(file "images/rides/${id}.jpg" | head -1)
        if echo "$ftype" | grep -qi "jpeg\|JFIF\|Exif"; then
            echo "OK: $id ($filename)"
        else
            echo "WARN: $id downloaded but not JPEG: $ftype"
        fi
    else
        echo "FAIL: $id - HTTP $code"
    fi
    
    sleep 2
}

# USF rides
echo "=== Universal Studios Florida ==="
download "usf-minion" "Despicable_Me_Minion_Mayhem_at_Universal_Studios_Florida.jpg"
download "usf-fast-furious" "Fast_%26_Furious_-_Supercharged_at_Universal_Studios_Florida.jpg"
download "usf-mib" "MIBAlienAttack.jpg"
download "usf-jimmy-fallon" "Race_Through_New_York_Starring_Jimmy_Fallon.jpg"
download "usf-mummy" "Revenge_of_the_Mummy_(Universal_Studios_Florida)_entrance.JPG"
download "usf-simpsons" "Simpsons_Ride.jpg"
download "usf-transformers" "TransformersTheRide3D-USF.jpg"

echo ""
echo "=== Islands of Adventure ==="
download "ioa-cat-hat" "The_Cat_in_the_Hat_(Universal_Orlando_Resort).jpg"
download "ioa-doom" "Doctor_Doom%27s_Fearfall_2.jpg"
download "ioa-dudley" "Dudley_Do-Right%27s_Ripsaw_Falls.jpg"
download "ioa-hagrid" "Hagrid%27s_Magical_Creatures_Motorbike_Adventure.jpg"
download "ioa-forbidden-journey" "Harry_Potter_and_the_Forbidden_Journey.jpg"
download "ioa-seuss-trolley" "High_in_the_Sky_Seuss_Trolley_Train_Ride.jpg"
download "ioa-hulk" "Incredible_Hulk_Coaster.jpg"
download "ioa-jurassic-river" "Jurassic_Park_River_Adventure.jpg"
download "ioa-velocicoaster" "VelociCoaster.jpg"
download "ioa-one-fish" "One_Fish_Two_Fish_Red_Fish_Blue_Fish.jpg"
download "ioa-popeye" "Popeye_%26_Bluto%27s_Bilge-Rat_Barges.jpg"
download "ioa-pteranodon" "Pteranodon_Flyers.jpg"
download "ioa-kong" "Skull_Island_Reign_of_Kong.jpg"
download "ioa-spiderman" "The_Amazing_Adventures_of_Spider-Man_marquee.jpg"
download "ioa-storm" "Storm_Force_Accelatron.jpg"

echo ""
echo "=== SeaWorld Orlando ==="
download "sw-mako" "Mako_(SeaWorld_Orlando)_01.jpg"
download "sw-kraken" "Kraken_(SeaWorld_Orlando)_01.jpg"
download "sw-manta" "Manta_(SeaWorld_Orlando)_01.jpg"
download "sw-pipeline" "Pipeline_The_Surf_Coaster.jpg"
download "sw-infinity" "Infinity_Falls.jpg"
download "sw-journey-atlantis" "Journey_to_Atlantis_(SeaWorld_Orlando).jpg"
download "sw-antarctica" "Antarctica_Empire_of_the_Penguin.jpg"
download "sw-sky-tower" "Sky_Tower_(SeaWorld_Orlando).jpg"

echo ""
echo "=== LEGOLAND Florida ==="
download "ll-coastersaurus" "Coastersaurus.jpg"
download "ll-dragon" "The_Dragon_(LEGOLAND_Florida).jpg"
download "ll-flying-school" "Flying_School_(LEGOLAND_Florida).jpg"
download "ll-duplo-express" "DUPLO_Express.jpg"
download "ll-drivingschool" "Ford_Driving_School.jpg"
download "ll-juniordriving" "Ford_Jr_Driving_School.jpg"
download "ll-boating" "Boating_School_(LEGOLAND_Florida).jpg"
download "ll-beetle-bounce" "Beetle_Bounce.jpg"
download "ll-fairy-tale-brook" "Fairy_Tale_Brook.jpg"
download "ll-merlin" "Merlin%27s_Challenge.jpg"
download "ll-lost-kingdom" "Lost_Kingdom_Adventure.jpg"
download "ll-ninjago" "Lego_Ninjago_The_Ride.jpg"

echo ""
echo "=== DONE ==="

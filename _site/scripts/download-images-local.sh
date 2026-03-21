#!/bin/bash
# Download ride images from Wikimedia Commons
# Run this on your local machine (not blocked by Wikimedia)

# Create output directory
mkdir -p images/rides

# Magic Kingdom
curl -L -o images/rides/space-mountain.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Space_Mountain_in_the_Magic_Kingdom_in_2021.jpg/800px-Space_Mountain_in_the_Magic_Kingdom_in_2021.jpg"
curl -L -o images/rides/mk-big-thunder.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Big_Thunder_Mountain_Railroad_at_Magic_Kingdom.jpg/800px-Big_Thunder_Mountain_Railroad_at_Magic_Kingdom.jpg"
curl -L -o images/rides/mk-haunted-mansion.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/The_Haunted_Mansion_at_Magic_Kingdom.jpg/800px-The_Haunted_Mansion_at_Magic_Kingdom.jpg"
curl -L -o images/rides/mk-pirates.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Pirates_of_the_Caribbean_at_Magic_Kingdom.jpg/800px-Pirates_of_the_Caribbean_at_Magic_Kingdom.jpg"
curl -L -o images/rides/mk-seven-dwarfs.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Seven_Dwarfs_Mine_Train.jpg/800px-Seven_Dwarfs_Mine_Train.jpg"

# EPCOT
curl -L -o images/rides/epcot-guardians.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Guardians_of_the_Galaxy_Cosmic_Rewind.jpg/800px-Guardians_of_the_Galaxy_Cosmic_Rewind.jpg"
curl -L -o images/rides/epcot-remy.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Remy%27s_Ratatouille_Adventure.jpg/800px-Remy%27s_Ratatouille_Adventure.jpg"
curl -L -o images/rides/epcot-test-track.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Test_Track_at_Epcot.jpg/800px-Test_Track_at_Epcot.jpg"
curl -L -o images/rides/epcot-soarin.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Soarin%27_Around_the_World_at_Epcot.jpg/800px-Soarin%27_Around_the_World_at_Epcot.jpg"

# Hollywood Studios
curl -L -o images/rides/hs-rise-resistance.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Star_Wars_Rise_of_the_Resistance.jpg/800px-Star_Wars_Rise_of_the_Resistance.jpg"
curl -L -o images/rides/hs-slinky.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Slinky_Dog_Dash.jpg/800px-Slinky_Dog_Dash.jpg"
curl -L -o images/rides/hs-tower-terror.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/The_Twilight_Zone_Tower_of_Terror_at_Disney%27s_Hollywood_Studios.jpg/800px-The_Twilight_Zone_Tower_of_Terror_at_Disney%27s_Hollywood_Studios.jpg"
curl -L -o images/rides/hs-smugglers-run.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Millennium_Falcon_Smugglers_Run.jpg/800px-Millennium_Falcon_Smugglers_Run.jpg"

# Animal Kingdom
curl -L -o images/rides/ak-avatar.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Avatar_Flight_of_Passage.jpg/800px-Avatar_Flight_of_Passage.jpg"
curl -L -o images/rides/ak-everest.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Expedition_Everest.jpg/800px-Expedition_Everest.jpg"
curl -L -o images/rides/ak-safari.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Kilimanjaro_Safaris.jpg/800px-Kilimanjaro_Safaris.jpg"

# Universal Studios
curl -L -o images/rides/uo-gringotts.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Harry_Potter_and_the_Escape_from_Gringotts.jpg/800px-Harry_Potter_and_the_Escape_from_Gringotts.jpg"
curl -L -o images/rides/uo-mummy.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Revenge_of_the_Mummy.jpg/800px-Revenge_of_the_Mummy.jpg"
curl -L -o images/rides/uo-transformers.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Transformers_The_Ride_3D.jpg/800px-Transformers_The_Ride_3D.jpg"

# Islands of Adventure
curl -L -o images/rides/ioa-hagrids.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hagrid%27s_Magical_Creatures_Motorbike_Adventure.jpg/800px-Hagrid%27s_Magical_Creatures_Motorbike_Adventure.jpg"
curl -L -o images/rides/ioa-velocicoaster.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Jurassic_World_VelociCoaster.jpg/800px-Jurassic_World_VelociCoaster.jpg"
curl -L -o images/rides/ioa-spiderman.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/The_Amazing_Adventures_of_Spider-Man.jpg/800px-The_Amazing_Adventures_of_Spider-Man.jpg"

# SeaWorld
curl -L -o images/rides/sw-mako.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Mako_at_SeaWorld_Orlando.jpg/800px-Mako_at_SeaWorld_Orlando.jpg"
curl -L -o images/rides/sw-kraken.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Kraken_at_SeaWorld_Orlando.jpg/800px-Kraken_at_SeaWorld_Orlando.jpg"
curl -L -o images/rides/sw-atlantis.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Journey_to_Atlantis_at_SeaWorld_Orlando.jpg/800px-Journey_to_Atlantis_at_SeaWorld_Orlando.jpg"

# LEGOLAND
curl -L -o images/rides/ll-dragon.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/The_Dragon_at_LEGOLAND_Florida.jpg/800px-The_Dragon_at_LEGOLAND_Florida.jpg"
curl -L -o images/rides/ll-coastersaurus.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Coastersaurus_at_LEGOLAND_Florida.jpg/800px-Coastersaurus_at_LEGOLAND_Florida.jpg"

echo "Download complete. Check images/rides/ directory."

"""Build Sanity drafts.* for /character-dining/ hub fixes. Verified against official Disney pages on 2026-10-26.
Writes mutations.json; apply with apply.py (drafts only, never publishes)."""
import json
V="2026-10-26"; B="https://disneyworld.disney.go.com/dining/"
pub={d['_id']:d for d in json.load(open('published-snapshot-2026-10-26.json'))['result']}
T3="$$$ ($35–$59.99/adult)"; T4="$$$$ (over $60/adult)"
F={
"200HsSeCmp0rIIhq3n1iMx":dict(park="EPCOT",resort="EPCOT",src="epcot/garden-grill-restaurant/",characters=["Mickey Mouse","Chip","Dale","and more"],mealType=["breakfast","lunch","dinner"],priceRange="$$$–$$$$",priceByMeal={"breakfast":T3,"lunch":T4,"dinner":T4},
  description="Chip 'n' Dale's Harvest Feast: family-style meal in a slowly rotating dining room with views of Living with the Land. Characters at breakfast, lunch and dinner."),
"200HsSeCmp0rIIhq3n1inU":dict(park="Animal Kingdom",resort="Animal Kingdom",src="animal-kingdom/tusker-house-restaurant/",characters=["Donald Duck","Mickey Mouse","and other friends"],mealType=["breakfast","lunch","dinner"],priceRange="$$$–$$$$",priceByMeal={"breakfast":T3,"lunch":T4,"dinner":T4},
  description="Buffet in Africa hosted by Donald Duck and friends in safari outfits. Kid options listed by Disney include fruit and yogurt at breakfast and mac-and-cheese at lunch and dinner."),
"RLBxGAumPb4EPh1Y0BD39g":dict(park="Disney's Grand Floridian Resort & Spa",resort="Disney's Grand Floridian Resort & Spa",src="grand-floridian-resort-and-spa/1900-park-fare/",characters=["Aladdin","Cinderella","Mirabel","Tiana"],mealType=["breakfast","dinner"],priceRange="$$$$",priceByMeal={"breakfast":T4,"dinner":T4},
  description="Wish Makers Enchanted Dining buffet at breakfast and dinner. Resort hotel location, so no park ticket needed. Disney notes renovation work at the resort through early 2027."),
"RLBxGAumPb4EPh1Y0BD3eW":dict(park="EPCOT",resort="EPCOT",src="epcot/akershus-royal-banquet-hall/",characters=["Disney Princesses"],mealType=["breakfast","lunch","dinner"],priceRange="$$$–$$$$",priceByMeal={"breakfast":T3,"lunch":T4,"dinner":T4},
  description="Princess Storybook Dining in EPCOT's Norway pavilion: family-style Norwegian-inspired meals with a promenade of Disney Princesses. Disney does not list which princesses appear."),
"RLBxGAumPb4EPh1Y0BD4Om":dict(park="Disney's Contemporary Resort",resort="Disney's Contemporary Resort",src="contemporary-resort/chef-mickeys/",characters=["Mickey Mouse","and pals"],mealType=["breakfast","dinner"],priceRange="$$$–$$$$",priceByMeal={"breakfast":T3,"dinner":T4},
  description="Buffet breakfast and dinner where Mickey and pals move through the dining rooms. Each table gets an autographed keepsake card. Resort hotel location, so no park ticket needed."),
"RLBxGAumPb4EPh1Y0BD6Rz":dict(park="Disney's Polynesian Village Resort",resort="Disney's Polynesian Village Resort",src="polynesian-village/ohana/",characters=["Lilo","Stitch","and other friends"],mealType=["breakfast"],priceRange="$$$",priceByMeal={"breakfast":T3},
  description="Best Friends Breakfast featuring Lilo & Stitch, served family-style. Characters appear at breakfast only; 'Ohana dinner is not a character meal."),
"UzjbPEJ4gI65TQn8dT8Qjj":dict(park="Magic Kingdom",resort="Magic Kingdom",src="magic-kingdom/crystal-palace/",characters=["Winnie the Pooh","Hundred-Acre Wood pals"],mealType=["breakfast","lunch","dinner"],priceRange="$$$–$$$$",priceByMeal={"breakfast":T3,"lunch":T4,"dinner":T4},
  description="Buffet on Main Street, U.S.A. with Winnie the Pooh and friends. Disney suggests planning 90 minutes to see all the characters."),
"UzjbPEJ4gI65TQn8dT8TiK":dict(park="Hollywood Studios",resort="Hollywood Studios",src="hollywood-studios/hollywood-and-vine/",characters=["Minnie Mouse","and friends (seasonal outfits)"],mealType=["breakfast","lunch","dinner"],priceRange="$$$–$$$$",priceByMeal={"breakfast":T3,"lunch":T4,"dinner":T4},
  description="Minnie's Seasonal Dining buffet; the theme and character outfits change through the year."),
"UzjbPEJ4gI65TQn8dT8UCD":dict(park="Disney's Riviera Resort",resort="Disney's Riviera Resort",src="riviera-resort/topolinos-terrace/",characters=["Mickey Mouse","Minnie Mouse","Donald Duck","Daisy Duck"],mealType=["breakfast"],priceRange="$$$",priceByMeal={"breakfast":T3},
  description="Breakfast à la Art with Mickey & Friends: prix-fixe rooftop breakfast. Characters appear at breakfast only; dinner is a signature restaurant with a dress code."),
"q5bQv6QFqWcAZeLNaYbsnk":dict(park="Disney's Wilderness Lodge",resort="Disney's Wilderness Lodge",src="wilderness-lodge-resort/artist-point/",characters=["Snow White","Dopey","Grumpy"],mealType=["dinner"],priceRange="$$$$",priceByMeal={"dinner":T4},
  description="Dinner only, with plated entrées and shared starters and desserts. Snow White, Dopey and Grumpy appear every evening."),
"r5PBb5Nahg2bY9oktfrIWW":dict(park="Disney's Beach Club Resort",resort="Disney's Beach Club Resort",src="beach-club-resort/cape-may-cafe/",characters=["Minnie Mouse","and friends"],mealType=["breakfast"],priceRange="$$$",priceByMeal={"breakfast":T3},
  description="Minnie's Beach Bash Breakfast buffet at the Beach Club Resort (near EPCOT). Characters appear at breakfast only; the dinner buffet has no characters."),
"r5PBb5Nahg2bY9oktfrIqS":dict(park="Magic Kingdom",resort="Magic Kingdom",src="magic-kingdom/cinderella-royal-table/",characters=["Cinderella","Disney Princesses"],mealType=["breakfast","lunch","dinner"],priceRange="$$$$",priceByMeal={"breakfast":T4,"lunch":T4,"dinner":T4},
  description="Prix-fixe meal inside Cinderella Castle. Cinderella greets you in the Grand Hall and Disney Princesses visit for photos. Paid in full when you book; no changes after booking; cancel at least 2 hours ahead or the full price is charged."),
"UzjbPEJ4gI65TQn8dT8QAZ":dict(park="Magic Kingdom",resort="Magic Kingdom",src="magic-kingdom/be-our-guest-restaurant/",characters=[],mealType=[],priceRange="$$$$",priceByMeal={"lunch":T4,"dinner":T4},hideFromList=True,
  hideReason="Not a character dining location: Disney's official page (checked 2026-10-26) lists no Character Dining tag or character appearances.",
  description="Not a character meal. Prix-fixe lunch and dinner in Beast's Castle."),
}
muts=[]
for i,f in F.items():
    d={k:v for k,v in pub[i].items() if k not in('_rev','_createdAt','_updatedAt','_system')}
    src=f.pop('src'); d.update(f); d['_id']='drafts.'+i
    d['sourceUrl']=B+src; d['verifiedAt']=V; d['bookingUrl']=B+src
    muts.append({"createOrReplace":d})
json.dump({"mutations":muts},open('mutations.json','w'),indent=1,ensure_ascii=False)
print(len(muts),'drafts')

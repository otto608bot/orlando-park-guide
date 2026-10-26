"""CEO review 2026-10-26: replace filler ('and pals', 'and friends', ...) with only the characters Disney's official page names (pages fetched 2026-10-26). Patches drafts.* only."""
import json,os,urllib.request
NOTE="Disney's page names no other characters."
P={
 "drafts.200HsSeCmp0rIIhq3n1iMx":{"characters":["Chip","Dale","Mickey Mouse"],"description":"Chip 'n' Dale's Harvest Feast: family-style meal in a slowly rotating dining room with views of Living with the Land. Disney names Chip, Dale and Mickey Mouse; characters at breakfast, lunch and dinner."},
 "drafts.200HsSeCmp0rIIhq3n1inU":{"characters":["Donald Duck","Mickey Mouse"],"description":"Buffet in Africa where Donald Duck and Mickey Mouse visit in safari outfits. "+NOTE+" Kid options listed by Disney include fruit and yogurt at breakfast and mac-and-cheese at lunch and dinner."},
 "drafts.RLBxGAumPb4EPh1Y0BD4Om":{"characters":["Mickey Mouse"],"description":"Buffet breakfast and dinner with Mickey Mouse. "+NOTE+" Each table gets an autographed keepsake card. Resort hotel location; Disney's page lists no park admission requirement."},
 "drafts.RLBxGAumPb4EPh1Y0BD6Rz":{"characters":["Lilo","Stitch"]},
 "drafts.UzjbPEJ4gI65TQn8dT8Qjj":{"characters":["Winnie the Pooh"],"description":"Buffet on Main Street, U.S.A. with Winnie the Pooh. "+NOTE+" Disney suggests planning 90 minutes to see all the characters."},
 "drafts.UzjbPEJ4gI65TQn8dT8TiK":{"characters":["Minnie Mouse"],"description":"Minnie's Seasonal Dining buffet with Minnie Mouse; the theme and character outfits change through the year. "+NOTE},
 "drafts.r5PBb5Nahg2bY9oktfrIWW":{"characters":["Minnie Mouse"],"description":"Minnie's Beach Bash Breakfast buffet with Minnie Mouse at the Beach Club Resort (near EPCOT). "+NOTE+" Characters appear at breakfast only; the dinner buffet has no characters."},
 "drafts.RLBxGAumPb4EPh1Y0BD39g":{"description":"Wish Makers Enchanted Dining buffet at breakfast and dinner. Resort hotel location; Disney's page lists no park admission requirement. Disney notes renovation work at the resort through early 2027."},
}
m=[{"patch":{"id":k,"set":v}} for k,v in P.items()]; assert all(x["patch"]["id"].startswith("drafts.") for x in m)
r=urllib.request.Request('https://hd7qwtcq.api.sanity.io/v2023-01-01/data/mutate/production',data=json.dumps({"mutations":m}).encode(),headers={'Authorization':'Bearer '+os.environ['SANITY_API_TOKEN'],'Content-Type':'application/json'})
print(urllib.request.urlopen(r).read()[:200])

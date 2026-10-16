"""Build Sanity DRAFT mutations (not executed) for finder/chooser links + in-post disclosure.
Run: python3 build_patches.py  -> writes mutations.json + per-post .md previews.
Apply only after approval, to drafts.<id> documents, via Sanity Studio or the mutate API."""
import json, os, hashlib
H = os.path.dirname(os.path.abspath(__file__))
IDS = {'disney-world-guide':'200HsSeCmp0rIIhq3n1ivp','best-time-visit-disney-world-2026':'Azr6jnPnblfJFZmxqUQuot','free-things-disney-world':'RLBxGAumPb4EPh1Y0BD8NU','epic-universe-1-day-plan':'blogPost-epic-universe-1-day-plan','epic-universe-rides-ranked-guide':'blogPost-epic-universe-rides-ranked-guide','epic-universe-tickets-guide':'blogPost-epic-universe-tickets-guide','disney-world-packing-list':'disney-world-packing-list','disney-world-packing-list-kids':'disney-world-packing-list-kids','beat-disney-world-crowds':'q5bQv6QFqWcAZeLNacaufh','disney-world-with-baby-toddler':'r5PBb5Nahg2bY9okthych9','universal-orlando-height-requirements':'r5PBb5Nahg2bY9okthycnn','universal-orlando-summer-2026':'universal-orlando-summer-2026'}
DISC_AFTER = {  # posts lacking in-post disclosure -> insert after this block key
 'universal-orlando-height-requirements':'qA3myj3wioIqOqUk24ZD0G','disney-world-packing-list-kids':None,
 'disney-world-packing-list':'block-18968499cbcb','universal-orlando-summer-2026':'qA3myj3wioIqOqUk24ZGMK',
 'best-time-visit-disney-world-2026':'intro1','disney-world-guide':'blk79c3f6e84536','free-things-disney-world':'3ea5d9f1bcc9',
 'beat-disney-world-crowds':'blkf6075da8c872','disney-world-with-baby-toddler':'qA3myj3wioIqOqUk24Z7hW'}
FIRST_KEY = {'disney-world-packing-list-kids':'a6aabbf93c5a'}  # disclosure inserted BEFORE this
DISC = [("Heads up: some ticket and gear links in this guide are affiliate links. If you book or buy through them, we may earn a commission at no extra cost to you. ",None),("See our affiliate disclosure","/affiliate-disclosure/"),(".",None)]
# links paragraph: (insert-after key, [segments])
LINKS = {
 'universal-orlando-height-requirements':('35825d7827c1',[("Want the list filtered to your kid's height? Use the ",None),("Universal Orlando rides for kids under 40 inches","/rides/for/universal-orlando-under-40/"),(", or jump to the ",None),("44-inch","/rides/for/universal-orlando-44/"),(" and ",None),("48-inch","/rides/for/universal-orlando-48/"),(" views in our ride finder. Still deciding between parks? The ",None),("park chooser","/parks/"),(" compares every Orlando park by height and thrill level.",None)]),
 'epic-universe-rides-ranked-guide':('p5qaB',[("To see only the rides your kids can do today, open the ride finder for ",None),("Epic Universe rides under 40 inches","/rides/for/epic-universe-under-40/"),(" or the ",None),("48-inch view","/rides/for/epic-universe-48/"),(". If Epic is one of several parks on your list, the ",None),("park chooser","/parks/"),(" helps you decide where it fits.",None)]),
 'epic-universe-1-day-plan':('bullet1qqaB',[("Check heights against our ride finder before you pick priorities: ",None),("Epic Universe under 40 inches","/rides/for/epic-universe-under-40/"),(", ",None),("44 inches","/rides/for/epic-universe-44/"),(", and ",None),("48 inches","/rides/for/epic-universe-48/"),(". Not sure Epic is the right park for your kids? Start with the ",None),("park chooser","/parks/"),(".",None)]),
 'epic-universe-tickets-guide':('p3bqaB',[("Before you pay for an Epic day, check what your kids can actually ride with the ",None),("Epic Universe ride finder by height","/rides/for/epic-universe-all/"),(", and compare Epic against the other Orlando parks in the ",None),("park chooser","/parks/"),(".",None)]),
 'universal-orlando-summer-2026':('a5a54d8355a9',[("Whatever the season, height decides the day for younger kids. Filter ",None),("Universal Orlando rides by height","/rides/for/universal-orlando-all/"),(" or compare parks in the ",None),("park chooser","/parks/"),(".",None)]),
 'best-time-visit-disney-world-2026':('how2',[("Once you have dates, pick the park that fits your kids with the ",None),("park chooser","/parks/"),(", then check ",None),("Disney World rides under 40 inches","/rides/for/disney-world-under-40/"),(" in the ride finder.",None)]),
 'disney-world-guide':('blk7200f3e2c289',[("If your kids are on the shorter side, start with ",None),("Disney World rides under 40 inches","/rides/for/disney-world-under-40/"),(" in our ride finder, and use the ",None),("park chooser","/parks/"),(" to decide which of the four parks to prioritize.",None)]),
 'free-things-disney-world':('3573139aa814',[("Pair the free extras with rides your kids can actually do: the ",None),("ride finder for Disney World by height","/rides/for/disney-world-all/"),(" and the ",None),("park chooser","/parks/"),(" make it easier to plan a lower-cost park day.",None)]),
 'beat-disney-world-crowds':('blkee8d2baf5e0b',[("Crowd plans work best when you only line up for rides your kids can ride. Filter ",None),("Disney World rides under 40 inches","/rides/for/disney-world-under-40/"),(" or ",None),("48 inches","/rides/for/disney-world-48/"),(", and use the ",None),("park chooser","/parks/"),(" to pick the right park for your crowd-day.",None)]),
 'disney-world-packing-list':('block-0d5050c7f825',[("Packing depends on the park and the rides. Use the ",None),("park chooser","/parks/"),(" to settle your park days, and the ",None),("Disney World ride finder by height","/rides/for/disney-world-all/"),(" to see which rides need a rain poncho or a height check.",None)]),
}

# --- The ONE non-insert edit: targeted span replace (brand-voice family-lore fix) ---
REPLACE = {
 'slug':'disney-world-guide','block':'blk720c5dce00c0','span':'s164cb485a680',
 'old_phrase':"I've been to Disney World more times than I can count with young kids, and here's what I know for certain:",
 'new_phrase':"For families with young kids, one thing about Disney World holds true:",
}
def k(*a): return hashlib.md5('|'.join(a).encode()).hexdigest()[:12]
def block(slug, tag, segs):
    md, ch = [], []
    for i,(t,h) in enumerate(segs):
        c={"_type":"span","_key":k(slug,tag,str(i)),"text":t,"marks":[]}
        if h:
            mk=k(slug,tag,'m',str(i)); md.append({"_type":"link","_key":mk,"href":h}); c["marks"]=[mk]
        ch.append(c)
    return {"_type":"block","_key":k(slug,tag),"style":"normal","markDefs":md,"children":ch}
def mdtext(segs): return ''.join(f"[{t}]({h})" if h else t for t,h in segs)
muts, preview = [], {}
for slug, did in IDS.items():
    ins = []
    if slug in DISC_AFTER:
        if DISC_AFTER[slug]: ins.append(("after", DISC_AFTER[slug], block(slug,'disc',DISC)))
        else: ins.append(("before", FIRST_KEY[slug], block(slug,'disc',DISC)))
        preview.setdefault(slug,[]).append(("disclosure", mdtext(DISC)))
    if slug in LINKS:
        a, segs = LINKS[slug]; ins.append(("after", a, block(slug,'links',segs)))
        preview.setdefault(slug,[]).append((f"links (after block {a})", mdtext(segs)))
    for pos, key, b in ins:
        muts.append({"patch":{"id":f"drafts.{did}","insert":{pos:f'body[_key=="{key}"]',"items":[b]}}})
src = json.load(open('/tmp/pp/posts.json')) if os.path.exists('/tmp/pp/posts.json') else None
OLD_TEXT = "I've been to Disney World more times than I can count with young kids, and here's what I know for certain: it is absolutely worth the logistical headache \u2014 but only if you go in with a real plan. Not the \"we'll figure it out\" kind of plan. The kind where you know which park you're walking into, what you're eating, and approximately how long you'll wait for Rise of the Resistance (because it will be long, every single time)."
assert OLD_TEXT.startswith(REPLACE['old_phrase'])
NEW_TEXT = OLD_TEXT.replace(REPLACE['old_phrase'], REPLACE['new_phrase'], 1)
R = REPLACE
muts.append({"patch":{"id":f"drafts.{IDS[R['slug']]}","set":{f'body[_key=="{R['block']}"].children[_key=="{R['span']}"].text': NEW_TEXT}}})
json.dump({"_note":"NOT APPLIED. Sanity draft mutations (all inserts except ONE targeted span set on disney-world-guide); create drafts.<id> from published first. Seuss Trolley untouched (see README).","mutations":muts}, open(os.path.join(H,'mutations.json'),'w'), indent=1, ensure_ascii=False)
with open(os.path.join(H,'preview.md'),'w') as f:
    f.write("# Preview of inserted paragraphs (2026-10-16)\n\n")
    for s, items in preview.items():
        f.write(f"## {s}\n")
        for lab, t in items: f.write(f"- **{lab}:** {t}\n")
        f.write("\n")
with open(os.path.join(H,'preview.md'),'a') as f:
    f.write("## disney-world-guide — REPLACE (the one non-insert edit)\n")
    f.write(f"Block `{R['block']}`, span `{R['span']}` only.\n\n- **Before:** {OLD_TEXT}\n- **After:** {NEW_TEXT}\n")
# --- Packing-post neutral-wording span replaces (2026-10-16 #2); old text pinned from current drafts ---
PR = json.load(open(os.path.join(H,'packing_replaces.json')))
for e in PR['edits']:
    assert "I've been" not in e['new'] and 'locals' not in e['new'] and 'actual families' not in e['new']
    muts.append({"patch":{"id":e['draft'],"set":{f'body[_key=="{e['block']}"].children[_key=="{e['span']}"].text': e['new']}}})
with open(os.path.join(H,'preview.md'),'a') as f:
    f.write("\n## Packing posts — REPLACES (neutral wording + dated NOAA source)\n")
    for e in PR['edits']:
        f.write(f"\n### {e['post']} · block `{e['block']}` span `{e['span']}`\n- **Before:** {e['old']}\n- **After:** {e['new']}\n")
print(len(muts),"mutations,",len(preview),"posts")

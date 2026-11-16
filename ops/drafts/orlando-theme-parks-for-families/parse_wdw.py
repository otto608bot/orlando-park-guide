import re,sys,html
for f in sys.argv[1:]:
    t=open(f).read()
    cards=t.split('<finder-list-card')[1:]
    print('==',f,len(cards))
    for c in cards:
        n=re.search(r'class="name[^"]*">([^<]+)<',c); fa=re.search(r'class="facets[^"]*">([^<]+)<',c)
        st=re.search(r'<finder-operating-status.*?</finder-operating-status>',c,re.S)
        s=re.sub(r'<[^>]+>',' ',st.group(0)) if st else ''
        s=' '.join(html.unescape(s).split())
        if n: print(html.unescape(n.group(1)).strip(),'|',html.unescape(fa.group(1)).split(',')[0] if fa else '','|',s[:120])

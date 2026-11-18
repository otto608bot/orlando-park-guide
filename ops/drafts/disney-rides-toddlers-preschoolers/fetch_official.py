"""Fetch official Disney World attraction pages (public HTML) and extract height + status text. Read-only. 2026-11-16."""
import re,sys,json,concurrent.futures as cf,subprocess
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36'
PARKS={'magic-kingdom':'Magic Kingdom','epcot':'EPCOT','hollywood-studios':'Hollywood Studios','animal-kingdom':'Animal Kingdom'}
def get(u):
    try: return subprocess.run(['curl','-sL','-m','60','-A',UA,'-w','\n__HTTP__%{http_code}__%{url_effective}',u],capture_output=True,text=True).stdout
    except Exception as e: return ''
def text(h):
    t=re.sub(r'<script.*?</script>|<style.*?</style>','',h,flags=re.S); t=re.sub(r'<[^>]+>','\n',t); t=t.replace('&nbsp;',' ').replace('&amp;','&').replace('&#39;',"'").replace('&rsquo;','’')
    return re.sub(r'\n\s*\n+','\n',t)
if __name__=='__main__':
    out={}
    slugs={}
    for p in PARKS:
        h=get(f'https://disneyworld.disney.go.com/attractions/{p}/')
        slugs[p]=sorted(set(re.findall(rf'/attractions/{p}/([a-z0-9\-]+)/',h)))
        open(f'official/_list_{p}.html','w').write(h)
        print(p,len(slugs[p]))
    json.dump(slugs,open('official/_slugs.json','w'),indent=1)

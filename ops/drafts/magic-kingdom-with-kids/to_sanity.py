"""Convert post.md -> Sanity blogPost draft doc (sanity-doc.json). Does not write to Sanity."""
import re,json,hashlib
t=open('post.md').read(); fm,body=t.split('---',2)[1:]
meta={}
for l in fm.strip().splitlines():
    k,v=l.split(':',1); v=v.strip()
    meta[k]=json.loads(v) if v.startswith('"') else ([x.strip() for x in v.strip('[]').split(',')] if v.startswith('[') else v)
n=0
def key():
    global n; n+=1; return hashlib.md5(f'mk{n}'.encode()).hexdigest()[:12]
def spans(txt):
    md=[];ch=[]
    for part in re.split(r'(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)',txt):
        if not part: continue
        m=re.match(r'\[([^\]]+)\]\(([^)]+)\)',part)
        if m:
            k=key(); md.append({"_type":"link","_key":k,"href":m.group(2)}); ch.append({"_type":"span","_key":key(),"text":m.group(1),"marks":[k]})
        elif part.startswith('**'): ch.append({"_type":"span","_key":key(),"text":part[2:-2],"marks":["strong"]})
        else: ch.append({"_type":"span","_key":key(),"text":part,"marks":[]})
    return md,ch
blocks=[]
for line in body.strip().split('\n'):
    if not line.strip(): continue
    style,lst='normal',None; s=line
    if s.startswith('### '): style,s='h3',s[4:]
    elif s.startswith('## '): style,s='h2',s[3:]
    elif s.startswith('> '): s=s[2:]
    elif s.startswith('- '): lst,s='bullet',s[2:]
    elif re.match(r'\d+\. ',s): lst,s='number',re.sub(r'^\d+\. ','',s)
    md,ch=spans(s); b={"_type":"block","_key":key(),"style":style,"markDefs":md,"children":ch}
    if lst: b["listItem"]=lst; b["level"]=1
    blocks.append(b)
words=len(re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',body).split())
doc={"_id":"drafts.blogPost-"+meta['slug'],"_type":"blogPost","title":meta['title'],"slug":{"_type":"slug","current":meta['slug']},
 "excerpt":meta['excerpt'],"tags":meta['tags'],"author":{"_type":"author","name":"Plan Your Park"},
 "categories":[{"_key":key(),"_ref":"q5bQv6QFqWcAZeLNacathw","_type":"reference"}],"readTime":max(1,round(words/230)),"body":blocks}
json.dump(doc,open('sanity-doc.json','w'),indent=1,ensure_ascii=False)
print(doc['_id'],len(blocks),'blocks',words,'words')

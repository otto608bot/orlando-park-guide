import json,subprocess,time,urllib.request,sys,websocket
url,out=sys.argv[1],sys.argv[2]; wait=int(sys.argv[3]) if len(sys.argv)>3 else 15
p=subprocess.Popen(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-port=9333','--user-data-dir=/tmp/chrome-cdp-1116','--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    for _ in range(30):
        try: tabs=json.load(urllib.request.urlopen('http://127.0.0.1:9333/json')); break
        except Exception: time.sleep(0.5)
    ws=websocket.create_connection([t for t in tabs if t['type']=='page'][0]['webSocketDebuggerUrl'],timeout=60)
    i=0
    def call(m,**pa):
        global i; i+=1; ws.send(json.dumps({'id':i,'method':m,'params':pa}))
        while True:
            r=json.loads(ws.recv())
            if r.get('id')==i: return r
    call('Page.navigate',url=url); time.sleep(wait)
    r=call('Runtime.evaluate',expression=(sys.argv[4] if len(sys.argv)>4 else 'document.body ? document.body.innerText : ""'),returnByValue=True)
    txt=r['result']['result'].get('value','')
    open(out,'w').write(txt); print(out,len(txt))
finally: p.kill()

import json,subprocess,time,urllib.request,sys,websocket
url,out=sys.argv[1],sys.argv[2]
p=subprocess.Popen(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-port=9335','--user-data-dir=/tmp/chrome-cdp-1116c','--window-size=1400,1000','--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    for _ in range(30):
        try: tabs=json.load(urllib.request.urlopen('http://127.0.0.1:9335/json')); break
        except Exception: time.sleep(0.5)
    ws=websocket.create_connection([t for t in tabs if t['type']=='page'][0]['webSocketDebuggerUrl'],timeout=60)
    i=0
    def call(m,**pa):
        global i; i+=1; ws.send(json.dumps({'id':i,'method':m,'params':pa}))
        while True:
            r=json.loads(ws.recv())
            if r.get('id')==i: return r
    def ev(e): return call('Runtime.evaluate',expression=e,returnByValue=True)['result']['result'].get('value','')
    call('Page.navigate',url=url); time.sleep(20)
    for _ in range(25):
        ev('window.scrollBy(0,900)'); time.sleep(1.2)
    txt=ev('document.body.innerText'); open(out,'w').write(txt); print(out,len(txt))
finally: p.kill()

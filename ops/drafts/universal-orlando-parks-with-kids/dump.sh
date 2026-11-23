#!/bin/bash
# usage: dump.sh URL OUT  -> rendered text via headless Chrome --dump-dom (2026-11-23)
google-chrome --headless=new --no-sandbox --disable-gpu --virtual-time-budget=20000 --user-agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' --dump-dom "$1" 2>/dev/null | python3 -c "
import sys,re,html
t=sys.stdin.read(); t=re.sub(r'<(script|style|noscript)[^>]*>.*?</\1>','',t,flags=re.S|re.I)
t=re.sub(r'<br\s*/?>|</(p|div|li|h[1-6]|tr|section)>','\n',t,flags=re.I); t=html.unescape(re.sub(r'<[^>]+>',' ',t))
t='\n'.join(re.sub(r'[ \t]+',' ',l).strip() for l in t.splitlines()); t=re.sub(r'\n{2,}','\n',t)
open('$2','w').write('SOURCE: $1\nACCESSED: '+__import__('datetime').date.today().isoformat()+'\n'+t); print('$2',len(t))"

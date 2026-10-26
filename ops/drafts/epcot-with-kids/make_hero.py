"""Text-only branded hero (no people, no Disney marks) matching the social card style."""
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; R='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
GREEN=(22,101,52); CREAM=(255,248,231); ORANGE=(234,88,12); INK=(40,40,40)
W,H=1376,768
im=Image.new('RGB',(W,H),GREEN); d=ImageDraw.Draw(im)
d.rounded_rectangle([40,40,W-40,H-40],radius=40,fill=CREAM)
d.text((100,100),"EPCOT with Kids",font=ImageFont.truetype(F,78),fill=GREEN)
d.text((100,205),"Rides by height · heights checked Oct 2026",font=ImageFont.truetype(F,40),fill=ORANGE)
rows=[("Any height","Frozen · Remy · Nemo · Journey of Water"),("40\"","Test Track · Soarin' · Mission: SPACE Green"),("42\"","Guardians of the Galaxy: Cosmic Rewind"),("44\"","Mission: SPACE Orange")]
y=290
for a,b in rows:
    d.rounded_rectangle([100,y,330,y+80],radius=20,fill=GREEN)
    fa=ImageFont.truetype(F,34); tw=d.textlength(a,font=fa); d.text((215-tw/2,y+20),a,font=fa,fill=CREAM)
    d.text((360,y+18),b,font=ImageFont.truetype(R,38),fill=INK); y+=98
d.text((100,H-100),'planyourpark.com',font=ImageFont.truetype(F,34),fill=ORANGE)
im.save('hero-1376x768.png')

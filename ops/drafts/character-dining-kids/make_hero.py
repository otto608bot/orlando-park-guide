"""Text-only branded hero (no people, no Disney marks) matching the social card style."""
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; R='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
GREEN=(22,101,52); CREAM=(255,248,231); ORANGE=(234,88,12); INK=(40,40,40)
W,H=1376,768
im=Image.new('RGB',(W,H),GREEN); d=ImageDraw.Draw(im)
d.rounded_rectangle([40,40,W-40,H-40],radius=40,fill=CREAM)
d.text((100,110),"Disney World Character Dining",font=ImageFont.truetype(F,64),fill=GREEN)
d.text((100,215),"for kids: prices, picks & booking (checked Oct 2026)",font=ImageFont.truetype(F,40),fill=ORANGE)
rows=[("Breakfast","Mostly $35–$59.99 per adult (Disney tier)"),("Dinner","Lunch & dinner mostly over $60 per adult"),("Book","60 days out, 6 AM Eastern")]
y=320
for a,b in rows:
    d.rounded_rectangle([100,y,330,y+90],radius=20,fill=GREEN)
    fa=ImageFont.truetype(F,36); tw=d.textlength(a,font=fa); d.text((215-tw/2,y+24),a,font=fa,fill=CREAM)
    d.text((360,y+22),b,font=ImageFont.truetype(R,40),fill=INK); y+=115
d.text((100,H-110),'planyourpark.com',font=ImageFont.truetype(F,34),fill=ORANGE)
im.save('hero-1376x768.png')

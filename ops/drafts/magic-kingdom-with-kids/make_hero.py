"""Text-only branded hero (no people, no Disney marks)."""
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; R='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
GREEN=(22,101,52); CREAM=(255,248,231); ORANGE=(234,88,12); INK=(40,40,40)
W,H=1376,768
im=Image.new('RGB',(W,H),GREEN); d=ImageDraw.Draw(im)
d.rounded_rectangle([40,40,W-40,H-40],radius=40,fill=CREAM)
d.text((100,100),"Magic Kingdom with Kids",font=ImageFont.truetype(F,72),fill=GREEN)
d.text((100,195),"Rides by height · heights checked Oct 19, 2026",font=ImageFont.truetype(F,34),fill=ORANGE)
rows=[("Any height","Dumbo · small world · Pooh · Peter Pan · more"),
      ("32–40\"","Speedway · Barnstormer · Mine Train · Big Thunder · Tiana's"),
      ("44–48\"","Space Mountain · TRON Lightcycle / Run")]
y=300
for a,b in rows:
    d.rounded_rectangle([100,y,360,y+85],radius=20,fill=GREEN)
    fa=ImageFont.truetype(F,32); tw=d.textlength(a,font=fa); d.text((230-tw/2,y+24),a,font=fa,fill=CREAM)
    s=32
    while d.textlength(b,font=ImageFont.truetype(R,s))>W-100-390 and s>20: s-=1  # keep text inside the card
    d.text((390,y+42-s*0.6),b,font=ImageFont.truetype(R,s),fill=INK); y+=105
d.text((100,H-110),'planyourpark.com',font=ImageFont.truetype(F,34),fill=ORANGE)
im.save('hero-1376x768.png')
print('hero ok')

"""Text-only branded graphics (no people/logos) for the AK social pack."""
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; R='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
GREEN=(22,101,52); CREAM=(255,248,231); ORANGE=(234,88,12)
def card(w,h,lines,out):
    im=Image.new('RGB',(w,h),GREEN); d=ImageDraw.Draw(im)
    d.rounded_rectangle([40,40,w-40,h-40],radius=36,fill=CREAM)
    y=110
    for txt,size,col,bold in lines:
        f=ImageFont.truetype(F if bold else R,size)
        words=txt.split(); line=''
        for wd in words+['\0']:
            test=(line+' '+wd).strip() if wd!='\0' else None
            if wd=='\0' or d.textlength(test,font=f)>w-180:
                d.text((90,y),line,font=f,fill=col); y+=int(size*1.3); line=wd if wd!='\0' else ''
            else: line=test
        y+=int(size*0.5)
    f=ImageFont.truetype(F,34); d.text((90,h-120),'planyourpark.com',font=f,fill=ORANGE)
    im.save(out)
L=[("Disney World Character Dining for Kids",64,GREEN,True),("Disney price tiers per adult (checked Oct 2026)",36,ORANGE,True),
   ("Breakfast: mostly $35-$59.99",44,(40,40,40),True),("Lunch & dinner: mostly over $60",44,(40,40,40),True),
   ("At resorts, no park ticket listed: Chef Mickey's, 'Ohana breakfast, Cape May breakfast",36,(40,40,40),False),
   ("Book 60 days out at 6 AM Eastern",40,(40,40,40),True)]
card(1080,1080,L,'ig-1080x1080.png')
card(1000,1500,L+[("Plus a calm half-day plan for kids under 40\"",40,GREEN,False)],'pin-1000x1500.png')

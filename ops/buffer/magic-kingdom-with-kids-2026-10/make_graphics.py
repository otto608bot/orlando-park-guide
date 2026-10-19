"""Text-only branded graphics (no people/logos) for the MK social pack."""
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
L=[("Magic Kingdom with Kids",68,GREEN,True),("Rides by height (checked Oct 19, 2026)",36,ORANGE,True),
   ("Any height: Dumbo, small world, Pooh, Peter Pan, Jungle Cruise, and more",36,(40,40,40),False),
   ("32–40\": Speedway, Barnstormer, Mine Train, Big Thunder, Tiana's",38,(40,40,40),True),
   ("44–48\": Space Mountain, TRON Lightcycle / Run",38,(40,40,40),True)]
card(1080,1080,L,'ig-1080x1080.png')
P=[("Magic Kingdom with Kids",80,GREEN,True),("Rides by height (checked Oct 19, 2026)",40,ORANGE,True),
   ("Any height: Dumbo, small world, Pooh, Peter Pan, Jungle Cruise, and more",44,(40,40,40),False),
   ("32–40\": Speedway, Barnstormer, Mine Train, Big Thunder, Tiana's",46,(40,40,40),True),
   ("44–48\": Space Mountain, TRON Lightcycle / Run",46,(40,40,40),True),
   ("Plus closures to check and a simple park-day plan by height",42,GREEN,False)]
card(1000,1500,P,'pin-1000x1500.png')
print('graphics ok')

"""Original avatar illustration (drawn from scratch for this video, no third-party assets).

Generates SVG variants: mouth 0/1/2 (closed/half/open) x eyes open/closed.
"""

SKIN = "#F5DCCB"
SKIN_SH = "#E9C3AC"
HAIR = "#3E2C26"
HAIR_HI = "#5A4239"
CARDIGAN = "#8EA597"
CARDIGAN_SH = "#7A9383"
BLOUSE = "#FBF8F4"
LIP = "#C97A72"


def eyes(closed: bool) -> str:
    out = []
    for cx, flip in ((215, -1), (325, 1)):
        if closed:
            out.append(
                f'<path d="M{cx-26},{402} Q{cx},{414} {cx+26},{402}" stroke="{HAIR}" '
                f'stroke-width="4" fill="none" stroke-linecap="round"/>'
            )
            # lashes hint
            out.append(
                f'<path d="M{cx+26*flip},{402} l{8*flip},-4" stroke="{HAIR}" stroke-width="3" stroke-linecap="round"/>'
            )
        else:
            out.append(f"""
  <g>
    <path d="M{cx-27},{402} Q{cx},{378} {cx+27},{402} Q{cx},{416} {cx-27},{402} Z" fill="#FFFFFF"/>
    <clipPath id="eye{cx}"><path d="M{cx-27},{402} Q{cx},{378} {cx+27},{402} Q{cx},{416} {cx-27},{402} Z"/></clipPath>
    <g clip-path="url(#eye{cx})">
      <circle cx="{cx}" cy="{399}" r="15" fill="#5B3E33"/>
      <circle cx="{cx}" cy="{400}" r="8" fill="#2A1C17"/>
      <circle cx="{cx+5}" cy="{393}" r="4.5" fill="#FFFFFF"/>
      <circle cx="{cx-5}" cy="{405}" r="2" fill="#FFFFFF" opacity="0.7"/>
    </g>
    <path d="M{cx-29},{403} Q{cx},{374} {cx+29},{401}" stroke="{HAIR}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M{cx+27*flip},{401} l{9*flip},-6" stroke="{HAIR}" stroke-width="3" stroke-linecap="round"/>
  </g>""")
    return "\n".join(out)


def mouth(level: int) -> str:
    cx, cy = 270, 488
    if level == 0:
        return (
            f'<path d="M{cx-20},{cy} Q{cx},{cy+10} {cx+20},{cy}" stroke="{LIP}" stroke-width="4" '
            f'fill="none" stroke-linecap="round"/>'
        )
    if level == 1:
        return (
            f'<path d="M{cx-18},{cy-1} Q{cx},{cy+3} {cx+18},{cy-1} Q{cx},{cy+16} {cx-18},{cy-1} Z" fill="#9E4F4B"/>'
            f'<path d="M{cx-18},{cy-1} Q{cx},{cy+3} {cx+18},{cy-1}" stroke="{LIP}" stroke-width="3" fill="none" stroke-linecap="round"/>'
        )
    return (
        f'<path d="M{cx-19},{cy-3} Q{cx},{cy+1} {cx+19},{cy-3} Q{cx+2},{cy+26} {cx-19},{cy-3} Z" fill="#8E4343"/>'
        f'<ellipse cx="{cx}" cy="{cy+12}" rx="9" ry="5" fill="#D98A86"/>'
        f'<path d="M{cx-14},{cy-1} Q{cx},{cy+2} {cx+14},{cy-1} L{cx+12},{cy+3} Q{cx},{cy+5} {cx-12},{cy+3} Z" fill="#FFFFFF" opacity="0.9"/>'
        f'<path d="M{cx-19},{cy-3} Q{cx},{cy+1} {cx+19},{cy-3}" stroke="{LIP}" stroke-width="3" fill="none" stroke-linecap="round"/>'
    )


def svg(level: int, closed: bool) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 800" width="540" height="800">
  <!-- back hair -->
  <path d="M120,360 C105,230 175,165 270,165 C365,165 435,230 420,360 C428,470 440,560 405,615
           C370,640 330,600 330,600 L210,600 C210,600 170,640 135,615 C100,560 112,470 120,360 Z" fill="{HAIR}"/>
  <!-- body -->
  <path d="M60,800 C62,700 120,650 200,628 L340,628 C420,650 478,700 480,800 Z" fill="{CARDIGAN}"/>
  <path d="M200,628 L270,760 L340,628 Z" fill="{BLOUSE}"/>
  <path d="M200,628 L232,700 L270,760 L218,800 L178,800 C190,740 192,680 200,628 Z" fill="{CARDIGAN_SH}"/>
  <path d="M340,628 L308,700 L270,760 L322,800 L362,800 C350,740 348,680 340,628 Z" fill="{CARDIGAN_SH}"/>
  <path d="M232,640 L270,700 L308,640" stroke="#E7E0D8" stroke-width="5" fill="none" stroke-linejoin="round"/>
  <circle cx="270" cy="725" r="4" fill="#D9CFC4"/>
  <!-- neck -->
  <path d="M235,520 L235,610 Q270,650 305,610 L305,520 Z" fill="{SKIN}"/>
  <path d="M235,560 Q270,600 305,560 L305,590 Q270,625 235,590 Z" fill="{SKIN_SH}" opacity="0.8"/>
  <!-- ears -->
  <ellipse cx="160" cy="420" rx="16" ry="26" fill="{SKIN_SH}"/>
  <ellipse cx="380" cy="420" rx="16" ry="26" fill="{SKIN_SH}"/>
  <circle cx="160" cy="452" r="5" fill="#E8D9B5"/>
  <circle cx="380" cy="452" r="5" fill="#E8D9B5"/>
  <!-- face -->
  <path d="M162,380 C160,300 205,255 270,255 C335,255 380,300 378,380 C377,455 340,530 270,545
           C200,530 163,455 162,380 Z" fill="{SKIN}"/>
  <!-- blush -->
  <ellipse cx="200" cy="452" rx="24" ry="12" fill="#F0A9A0" opacity="0.35"/>
  <ellipse cx="340" cy="452" rx="24" ry="12" fill="#F0A9A0" opacity="0.35"/>
  <!-- brows -->
  <path d="M188,360 Q214,348 240,356" stroke="{HAIR_HI}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M300,356 Q326,348 352,360" stroke="{HAIR_HI}" stroke-width="5" fill="none" stroke-linecap="round"/>
  {eyes(closed)}
  <!-- nose -->
  <path d="M272,430 Q276,447 266,452" stroke="{SKIN_SH}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  {mouth(level)}
  <!-- front hair / bangs -->
  <path d="M150,390 C140,260 200,195 275,195 C350,195 405,250 392,390
           C385,330 365,300 345,285 C320,310 270,330 205,330 C190,345 170,365 150,390 Z" fill="{HAIR}"/>
  <path d="M205,330 C250,315 300,290 330,250" stroke="{HAIR_HI}" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/>
  <path d="M230,215 C270,200 320,205 350,225" stroke="{HAIR_HI}" stroke-width="5" fill="none" opacity="0.5" stroke-linecap="round"/>
  <!-- side locks -->
  <path d="M150,390 C145,470 150,540 175,590 C160,600 140,590 132,570 C120,500 125,430 150,390 Z" fill="{HAIR}"/>
  <path d="M392,390 C397,470 392,540 367,590 C382,600 402,590 410,570 C422,500 417,430 392,390 Z" fill="{HAIR}"/>
</svg>"""


if __name__ == "__main__":
    import sys, os
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    for lv in range(3):
        for c in (False, True):
            with open(os.path.join(out, f"avatar_m{lv}_{'c' if c else 'o'}.svg"), "w") as f:
                f.write(svg(lv, c))

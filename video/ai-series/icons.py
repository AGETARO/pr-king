"""Chibi icon of the navigator dog 「たぬき」 (original drawing, SVG).

dog_icon(face="open"|"happy"|"wink", extra=None|"heart"|"sparkle"|"paw", tongue=False)
"""

INK = "#24365A"
FUR = "#FFF4E2"
EAR = "#F0C78C"
EAR_IN = "#E3B074"
BLUSH = "#FFA9A0"


def _eyes(face):
    if face == "happy":
        return (f'<path d="M62,104 q12,-14 24,0" stroke="{INK}" stroke-width="7" fill="none" stroke-linecap="round"/>'
                f'<path d="M114,104 q12,-14 24,0" stroke="{INK}" stroke-width="7" fill="none" stroke-linecap="round"/>')
    left = (f'<ellipse cx="74" cy="102" rx="11" ry="13" fill="{INK}"/>'
            f'<circle cx="78" cy="97" r="4.5" fill="#fff"/><circle cx="70" cy="107" r="2" fill="#fff"/>')
    if face == "wink":
        right = f'<path d="M114,104 q12,-12 24,0" stroke="{INK}" stroke-width="7" fill="none" stroke-linecap="round"/>'
    else:
        right = (f'<ellipse cx="126" cy="102" rx="11" ry="13" fill="{INK}"/>'
                 f'<circle cx="130" cy="97" r="4.5" fill="#fff"/><circle cx="122" cy="107" r="2" fill="#fff"/>')
    return left + right


def _extra(extra):
    if extra == "heart":
        return (f'<path d="M168,40 c-10,-16 -34,-6 -24,12 l24,22 l24,-22 c10,-18 -14,-28 -24,-12 z" '
                f'fill="#FF6F8E" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>')
    if extra == "sparkle":
        star = lambda x, y, s: (f'<path d="M{x},{y - s} Q{x + s * .18},{y - s * .18} {x + s},{y} Q{x + s * .18},{y + s * .18} {x},{y + s} '
                                f'Q{x - s * .18},{y + s * .18} {x - s},{y} Q{x - s * .18},{y - s * .18} {x},{y - s} z" '
                                f'fill="#FFD54A" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>')
        return star(172, 38, 20) + star(30, 48, 12)
    if extra == "paw":
        return (f'<g transform="translate(150,150) rotate(-15)"><ellipse cx="0" cy="0" rx="24" ry="20" fill="{FUR}" stroke="{INK}" stroke-width="5"/>'
                f'<ellipse cx="0" cy="4" rx="9" ry="7" fill="{BLUSH}"/><circle cx="-11" cy="-8" r="4" fill="{BLUSH}"/>'
                f'<circle cx="0" cy="-11" r="4" fill="{BLUSH}"/><circle cx="11" cy="-8" r="4" fill="{BLUSH}"/></g>')
    return ""


def dog_icon(face="open", extra=None, tongue=False, size=200):
    mouth = (f'<path d="M88,130 q6,8 12,0 q6,8 12,0" stroke="{INK}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
    if tongue:
        mouth = (f'<path d="M92,132 q8,18 16,0 z" fill="#FF7F8E" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>' + mouth)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="{size}" height="{size}">
  <!-- ears (floppy) -->
  <path d="M40,62 C14,58 6,104 22,128 C34,144 52,130 54,110 Z" fill="{EAR}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M160,62 C186,58 194,104 178,128 C166,144 148,130 146,110 Z" fill="{EAR}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>
  <!-- head -->
  <path d="M100,34 C150,34 172,70 170,110 C168,150 138,172 100,172 C62,172 32,150 30,110 C28,70 50,34 100,34 Z"
        fill="{FUR}" stroke="{INK}" stroke-width="6"/>
  <!-- fluffy tuft -->
  <path d="M88,38 q6,-14 14,-2 q8,-12 12,4" fill="{FUR}" stroke="{INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
  <!-- warm patches under the ears -->
  <path d="M46,74 q8,-10 18,-4" stroke="{EAR_IN}" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M154,74 q-8,-10 -18,-4" stroke="{EAR_IN}" stroke-width="6" fill="none" stroke-linecap="round"/>
  <!-- muzzle -->
  <ellipse cx="100" cy="128" rx="30" ry="22" fill="#FFFAF2"/>
  {_eyes(face)}
  <ellipse cx="56" cy="128" rx="12" ry="7" fill="{BLUSH}" opacity="0.8"/>
  <ellipse cx="144" cy="128" rx="12" ry="7" fill="{BLUSH}" opacity="0.8"/>
  <!-- nose -->
  <path d="M88,114 q12,-6 24,0 q-2,12 -12,14 q-10,-2 -12,-14 z" fill="{INK}"/>
  <ellipse cx="96" cy="115" rx="4" ry="2.5" fill="#fff" opacity="0.8"/>
  {mouth}
  {_extra(extra)}
</svg>"""


if __name__ == "__main__":
    import sys
    vs = [("open", None, False), ("happy", "heart", True), ("wink", "sparkle", False), ("open", "paw", True)]
    html = "<html><body style='margin:0;background:#FFC738'>" + "".join(
        f"<span style='display:inline-block'>{dog_icon(*v)}</span>" for v in vs) + "</body></html>"
    open(sys.argv[1], "w").write(html)

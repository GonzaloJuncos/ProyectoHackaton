import zlib
import re
import os

with open('Logis-oscuro.pdf', 'rb') as f:
    data = f.read()

# Decompress first flate stream
stream_match = re.search(b'stream[\r\n]+(.*?)[\r\n]+endstream', data, re.DOTALL)
if not stream_match:
    print("Stream not found")
    exit(1)

decomp = zlib.decompress(stream_match.group(1)).decode('latin1')

def pdf_to_svg_d(body):
    tokens = body.split()
    d = []
    i = 0
    while i < len(tokens):
        t = tokens[i]
        if t == 'm':
            d.append(f"M {tokens[i-2]} {tokens[i-1]}")
        elif t == 'l':
            d.append(f"L {tokens[i-2]} {tokens[i-1]}")
        elif t == 'c':
            d.append(f"C {tokens[i-6]} {tokens[i-5]}, {tokens[i-4]} {tokens[i-3]}, {tokens[i-2]} {tokens[i-1]}")
        elif t == 'h':
            d.append("Z")
        elif t == 're':
            x, y, w, h = float(tokens[i-4]), float(tokens[i-3]), float(tokens[i-2]), float(tokens[i-1])
            d.append(f"M {x} {y} L {x+w} {y} L {x+w} {y+h} L {x} {y+h} Z")
        i += 1
    return ' '.join(d)

sections = re.split(r'(\.[0-9]+\s+\.[0-9]+\s+\.[0-9]+\s+rg)', decomp)

# Sections:
# 1: background color .0314 .149 .1725 rg
# 3: isotype top color .6235 .7451 .7569 rg
# 4: isotype top body
# 5: isotype bottom color .2471 .8157 .6588 rg
# 6: isotype bottom body
# 7: wordmark color .9333 .9647 .9569 rg
# 8: wordmark body

d_top = pdf_to_svg_d(sections[4])
d_bottom = pdf_to_svg_d(sections[6])
d_wordmark = pdf_to_svg_d(sections[8])

min_x = 120.0
min_y = 145.0
width = 1760.0
height = 500.0

# 1. Full logo on dark
svg_full = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{min_x} {min_y} {width} {height}" fill="none">
  <path d="{d_top}" fill="#9FBEC1" />
  <path d="{d_bottom}" fill="#3FD0A8" />
  <path d="{d_wordmark}" fill="#FFFFFF" />
</svg>
'''

# 2. Isotype alone
iso_width = 595.0
svg_iso = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{min_x} {min_y} {iso_width} {height}" fill="none">
  <path d="{d_top}" fill="#9FBEC1" />
  <path d="{d_bottom}" fill="#3FD0A8" />
</svg>
'''

# 3. Full logo on dark background
svg_full_bg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 710" fill="none">
  <rect width="2000" height="710" fill="#08262C" />
  <path d="{d_top}" fill="#9FBEC1" />
  <path d="{d_bottom}" fill="#3FD0A8" />
  <path d="{d_wordmark}" fill="#FFFFFF" />
</svg>
'''

for dir_path in ['apps/web-ui/public', 'apps/web/public']:
    os.makedirs(dir_path, exist_ok=True)
    with open(f'{dir_path}/logo-logis.svg', 'w', encoding='utf-8') as f:
        f.write(svg_full)
    with open(f'{dir_path}/isotipo-logis.svg', 'w', encoding='utf-8') as f:
        f.write(svg_iso)
    with open(f'{dir_path}/logo-logis-oscuro.svg', 'w', encoding='utf-8') as f:
        f.write(svg_full_bg)

# Also generate React components with inline SVG
react_component = f'''"use client";

import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {{
  className?: string;
  variant?: "completo" | "isotipo";
}}

export const PATH_ISOTIPO_TOP = "{d_top}";
export const PATH_ISOTIPO_BOTTOM = "{d_bottom}";
export const PATH_WORDMARK = "{d_wordmark}";

export function LogisIsotipo({{ className = "h-8 w-8", ...props }}: React.SVGProps<SVGSVGElement>) {{
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="{min_x} {min_y} {iso_width} {height}"
      fill="none"
      className={{className}}
      {{...props}}
    >
      <path d={{PATH_ISOTIPO_TOP}} fill="#9FBEC1" />
      <path d={{PATH_ISOTIPO_BOTTOM}} fill="#3FD0A8" />
    </svg>
  );
}}

export default function LogisLogo({{ className = "h-8 w-auto", variant = "completo", ...props }}: LogoProps) {{
  if (variant === "isotipo") {{
    return <LogisIsotipo className={{className}} {{...props}} />;
  }}

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="{min_x} {min_y} {width} {height}"
      fill="none"
      className={{className}}
      {{...props}}
    >
      <path d={{PATH_ISOTIPO_TOP}} fill="#9FBEC1" />
      <path d={{PATH_ISOTIPO_BOTTOM}} fill="#3FD0A8" />
      <path d={{PATH_WORDMARK}} fill="#FFFFFF" />
    </svg>
  );
}}
'''

with open('apps/web-ui/src/components/LogisLogo.tsx', 'w', encoding='utf-8') as f:
    f.write(react_component)

print("Vectors and components successfully generated!")

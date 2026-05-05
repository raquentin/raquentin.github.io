---
title: Apple m1 gpu
date: 2026-05-04
tags:
  - asahi
---

## Notable gpu components

### Shader cores

Shader cores process triangles (vertex data) and pixels (fragment data)[^1]:
- vertex data is information about pixels in 3D space. It defines the shape of objs
- fragment data is information for each pixel on the screen. It's what fills in the shapes defined by vertices


### Triangles into pixels

Rasterization units figure out which pixels a triangle covers. They:
- take triangle vertices from screen space
- compute a bounding box
- walk over the pixels in the box
- decide if pixels are in the triangle
- generate fragments (potential pixels)
- outputting fragment coords (x,y) and intepolated vals (colors, UVs, normals, etc)

Texture samplers fetch textures from memory. They:
- handle filtering (bi/tri linear)
- mipmaps
- addressing modes (wrap, clamp)
- have their own hardware as texture access is irregular, memory-heavy, and needs special filtering logic.

Render output units (ROPs) are the final step before the frame buffer. They:
- depth test (is this pixel visible)?
- stencil test
- blend transparency, alpha composition
- write final pixel data

...continuing

[^1]: https://asahilinux.org/2022/11/tales-of-the-m1-gpu/

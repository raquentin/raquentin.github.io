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

### Command processor

Command processor is a dispatcher and state machine that translates calls from vulkan/opengl/metal to gpu work.
- reads command buffers from the drivers.
- sets up gpu state (which shaders, textures, vertex buffers, render targets, blend/depth/stencil modes)
- breaks work into stages (vertex -> fragment -> set rast rules -> prep mem bindings)
- dispatches work to hardware

In the tile-based context, it helps organize work into tiles.

For asahi, this is one of the hardest parts, as apple's cmd fmt is undocumented, but the driver must still build correct command buffers and match hardware expectations precisely. Errors cause no renders or large glitches.

### Memory management unit

Enforces process isolation.
- its like virtual mem for gpu
- gives each app a virtual addr space


## Kernel vs user space drivers

Kernel space owns:
- mmu (manage gpu vmem, set page tables, allocating buffers, enforce iso)
- cmd submission (accept cmd bufs from userspace, validate, send to gpu)
- scheduling (which processes run on gpu?)
- interrupts
- power mgmt, clocking, initialization

User space (asahi/mesa):
- implements graphic apis (vulkan, opengl)
- compiles shaders into apple gpu machine code
- builds command buffer
- resource mgmt

[^1]: https://asahilinux.org/2022/11/tales-of-the-m1-gpu/

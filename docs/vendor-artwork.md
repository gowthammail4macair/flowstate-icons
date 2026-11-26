# Vendor artwork rendering

The five bundled Microsoft/Cisco symbols below keep fixed reference paints,
an upright orientation, and their intrinsic proportions. Their labels, node
positions, and sizes remain editable. The inspector identifies the color
controls as **Label color** for these symbols.

| Symbol | Reference inherited fill | Reference inherited stroke |
| --- | --- | --- |
| `mxgraph.office.users.user` | `#505050` | none |
| `mxgraph.azure.scheduler` | `#00BEF2` | none |
| `drawio.mscae.shared_dashboard` | intrinsic multicolor paths | none |
| `drawio.mscae.schedulerjobcollection` | intrinsic multicolor paths | none |
| `mxgraph.cisco.computers_and_peripherals.web_browser` | `#036897` | `#ffffff` |

The inherited paints come from draw.io v24.7.17's
[Office sidebar](https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/js/diagramly/sidebar/Sidebar-Office.js),
[Azure sidebar](https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/js/diagramly/sidebar/Sidebar-Azure.js), and
[Cisco sidebar](https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/js/diagramly/sidebar/Sidebar-Cisco.js).
Explicit colors in the two MSC Azure image assets remain intact.

## Safeguards

- The renderer uses proportional `xMidYMid meet` fitting, without cropping or
  stretching to fill a node's rectangle. Stroke extents are included in the
  SVG view box so complete outlines fit inside it.
- Corner and edge resizing preserves the node's current proportions without
  requiring Shift. Pinch resizing is proportional too. A legacy node can keep
  its rectangular bounds while the artwork fits inside them proportionally.
- Import and saved-canvas restoration normalize rotation and mirroring to an
  upright, unmirrored appearance. The renderer also guards against older
  appearance metadata before it is saved again.
- Artwork paints are resolved independently of label colors, node palettes,
  dark-mode adaptation, or imported fill/stroke overrides. Labels retain
  editable typography, color, multiline content, and placement.
- Editable JSON import/export and unchanged AI refinements retain the policy.
  PNG/SVG export clones the same protected renderer used by the canvas.
- The asset-generation script applies the same paints and proportional view
  box to the five standalone SVG files. The original descriptor path geometry
  is retained; changes to default paints and view boxes are adaptations of
  the attributed draw.io sources.

The policy is defined in `src/vendor-artwork.mjs`. Its scope is the five
identified vector symbols, not arbitrary raster images supplied by a user.
Adding a new vendor pack requires its own source and usage assessment.

## Licensing scope

These are technical rendering safeguards, not a declaration that the
converted artwork is approved by the vendors or that its redistribution
rights have been resolved. The assets retain their third-party terms and
the attribution in [drawio-import.md](drawio-import.md).

[Azure guidelines](https://learn.microsoft.com/en-us/azure/architecture/icons/)
prohibit cropping, flipping, rotation, and distortion for that collection;
[Cisco's topology-icon guidance](https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html)
prohibits alterations. Whether historical converted artwork is covered by
those particular permissions remains a separate assessment.

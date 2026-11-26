# draw.io stencil source and adaptation notice

Attribution: **JGraph / draw.io**. The original stencil assets below are pinned to **v24.7.17**.
JGraph-provided icons are published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/),
with additional terms potentially applying to original third-party artwork,
as stated in the [upstream README](https://github.com/jgraph/drawio/blob/v24.7.17/README.md).
The complete CC BY text accompanies the build at `/legal/CC-BY-4.0.txt`
and is retained in the source tree as `docs/LICENSE.drawio-stencils.txt`.

| Local assets | Exact upstream source |
| --- | --- |
| 1,013 `mxgraph.aws4.*` symbols | https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/stencils/aws4.xml |
| 293 `mxgraph.aws3.*` symbols | https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/stencils/aws3.xml |
| `mxgraph.office.users.user` | https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/stencils/office/users.xml |
| `mxgraph.azure.scheduler`, `mxgraph.azure.computer` | https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/stencils/azure.xml |
| `mxgraph.cisco.computers_and_peripherals.web_browser` | https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/stencils/cisco/computers_and_peripherals.xml |
| `drawio.mscae.shared_dashboard` | https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/img/lib/mscae/Shared_Dashboard.svg |
| `drawio.mscae.schedulerjobcollection` | https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/img/lib/mscae/SchedulerJobCollection.svg |

The direct importer also bundles PNG renditions of three draw.io image-library SVGs:
[Docker](https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/img/lib/mscae/Docker.svg),
[Files](https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/img/lib/azure2/general/Files.svg), and
[Browser](https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/img/lib/azure2/general/Browser.svg).
These are rasterized at build-tool time by the stencil converter with the three optional SVG inputs.

Each stencil symbol has an inert JSON descriptor and SVG rendition. Flowstate's
converter translates stencil primitives into paths, carries paint/opacity /
line settings, and assigns default colors. It does not include or execute
draw.io's editor. For the five Microsoft/Cisco symbols, inherited reference
paints and stroke-safe proportional view boxes are applied; intrinsic
multicolor paints and descriptor path geometry remain intact. Runtime
rendering also keeps these five symbols upright and unmirrored. These are
adaptations, not vendor-approved original SVGs.

Reproduce the conversion using `scripts/import-drawio-stencils.mjs` with the
stencil and image sources in its documented argument order. The full catalog also
contains two **original Flowstate** symbols, `flowstate.python-document`
and `flowstate.curly-bracket`; those use the project's MIT OR Apache-2.0
license and are not attributed to JGraph.

AWS, Microsoft, and Cisco retain rights in their respective names and
artwork. No endorsement is implied. These files are excluded from
Flowstate's code-license grant, except the two original `flowstate.*`
symbols. The root NOTICE and `/legal/licensing.md` record vendor guidance
and unresolved redistribution scope. This attribution does not supply
additional original-vendor permission.

## Azure and Google Cloud icon libraries

FlowState Studio includes 1,651 Azure and 616 Google Cloud icons under
`public/drawio-cloud-icons/`. These include newer and legacy draw.io
entries. Attribution goes to draw.io Ltd (formerly JGraph) and draw.io AG,
with original vendor rights retained by Microsoft and Google, respectively.
The icon terms are in the [draw.io v32.7.4 README](https://github.com/jgraph/drawio/blob/v32.7.4/README.md#license)
and [stencil license](https://github.com/jgraph/drawio/blob/v32.7.4/src/main/webapp/stencils/LICENSE).
The legacy Google Cloud source from v24.7.17 retains the terms identified above.

| Artwork | Exact upstream source |
| --- | --- |
| Modern Azure image library | [v32.7.4 img/lib/azure2](https://github.com/jgraph/drawio/tree/v32.7.4/src/main/webapp/img/lib/azure2) |
| Microsoft Cloud and Enterprise image library | [v32.7.4 img/lib/mscae](https://github.com/jgraph/drawio/tree/v32.7.4/src/main/webapp/img/lib/mscae) |
| Azure, MSCAE, and Google Cloud stencil shapes | [v32.7.4 binary stencil bundle](https://github.com/jgraph/drawio/blob/v32.7.4/src/main/webapp/js/stencils.min.js) |
| Google Cloud embedded image artwork | [v32.7.4 GCP Icons](https://github.com/jgraph/drawio/blob/v32.7.4/src/main/webapp/js/diagramly/sidebar/Sidebar-GCPIcons.js), [v32.7.4 GCP2](https://github.com/jgraph/drawio/blob/v32.7.4/src/main/webapp/js/diagramly/sidebar/Sidebar-GCP2.js), and [v24.7.17 GCP2](https://github.com/jgraph/drawio/blob/v24.7.17/src/main/webapp/js/diagramly/sidebar/Sidebar-GCP2.js) |

FlowState Studio uses the sidebar names and reference paints where available,
converts stencil geometry to standalone SVGs, and extracts SVG images for local
placement and export. It normalizes intrinsic dimensions while preserving the
SVG view box. The catalog is generated by `scripts/import-drawio-cloud-icons.mjs`
from the pinned draw.io checkout and the legacy GCP2 sidebar. These vendor
assets retain their own terms and are outside FlowState Studio’s code-license grant.

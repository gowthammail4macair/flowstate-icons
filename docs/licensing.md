# Licensing scope and distribution record

Reviewed: 24 October 2026. This document records the project's current
licenses, sources, and unresolved questions. It does not certify third-party
permission, ownership, trademark clearance, or compliance in every jurisdiction.

## Original project contributions

Original Flowstate code, project-authored documentation, and original artwork
are available under **MIT OR Apache-2.0**, at the recipient's option. The full
texts are `LICENSE-MIT` and `LICENSE-APACHE`; `LICENSE` and `NOTICE` define
the scope and third-party exceptions. Copyright notices identify the
Flowstate contributors collectively; each contributor retains rights in
their own contribution. AI assistance does not add rights to third-party
material included in a contribution.

The application can have an open-source code license while bundled vendor
artwork retains more restrictive terms. Do not describe every repository
file as MIT/Apache, or every icon as unrestricted open-source artwork.

## Product inspiration and visual review

Flowstate is an independent project inspired by diagramming tools such as
[Eraser](https://www.eraser.io/) and [draw.io](https://www.drawio.com/). It is
not affiliated with or endorsed by Eraser Labs or JGraph.

Flowstate also implements its own combination of capabilities: its local
server invokes the signed-in Codex CLI for AI generation and refinement,
canvases are saved in browser storage, and AI edits can be applied to
manually drawn or imported diagrams. Manual editing and export do not
require AI connectivity; AI requests use Codex's cloud service.

Feature comparisons must identify the product and workflow being compared.
As of 24 October 2026, [draw.io's Desktop documentation](https://www.drawio.com/docs/security/diagrams-offline/)
lists AI generation as unavailable in the Desktop application, whereas
Flowstate integrates it into its local editor. This is not a claim that
draw.io lacks AI generally: its [online editor documents AI generation and editing](https://www.drawio.com/docs/manual/generate/ai-models/).
[Eraser also documents Codex integration through its hosted MCP server](https://docs.eraser.io/mcp).
Flowstate's local CLI bridge is a specific implementation choice, not a
claim that Codex integration or the individual editing features are absent
from every other product or extension. These workflow differences do not
change the rights or license terms for reused material.

Similar functionality alone does not establish copying of protected
expression. The [U.S. Copyright Office](https://www.copyright.gov/help/faq/faq-protect.html)
distinguishes ideas, systems, and methods from protectable original
expression. Inspiration does not grant permission to reuse another
product's code, artwork, text, branding, or protected visual design;
applicable licenses and law still govern any reused material. This note
does not change the terms for the attributed draw.io-derived assets below.

On 24 October 2026, a limited visual comparison of Flowstate's light/dark
interface against Eraser's public trial editor and official screenshots
identified no specific visual element requiring replacement in the
screens reviewed. The comparison was not an exhaustive assessment of all
screens or underlying code. A dedicated visual comparison against draw.io
has not been completed. Neither this record nor the independence statement
constitutes comprehensive legal or trademark clearance.

## Vendor artwork retained in this repository

All existing icon packs are retained, including the 303 official AWS icons,
1,306 AWS-derived draw.io symbols, the Azure and Google Cloud libraries,
and the earlier Office and Cisco symbols. They are excluded from the
original-code license grant.

| Material | Published guidance and current assessment |
| --- | --- |
| Official AWS icons | [AWS guidance](https://aws.amazon.com/architecture/icons/) describes architecture-diagram use and third-party drawing tools. Our review has not established a general grant covering redistribution of the entire collection as an independently reusable public icon library. That uncertainty is not a finding that AWS forbids this application's distribution. |
| draw.io adaptations | [JGraph's pinned README](https://github.com/jgraph/drawio/blob/v24.7.17/README.md) licenses its provided icons/templates under CC BY 4.0 and notes that original-vendor terms can also apply. Preserve attribution, the license, source links, and the conversion/change notice. The editor source's separate modified Apache license is not the license claimed for these assets. |
| Azure and Google Cloud draw.io icon libraries | These vendor assets retain their own terms. See the [pinned sources and terms](/drawio-stencils/ASSET-SOURCES.md#azure-and-google-cloud-icon-libraries). |
| Google Cloud legacy console icons | These four SVGs use [Google's published artwork and guidance](/google-cloud-icons/ASSET-SOURCES.md) and are excluded from the original-code license grant. |
| Azure V25 architecture icons | Microsoft's [published icon terms](/microsoft-azure-icons/ASSET-SOURCES.md) apply to these five SVGs. |
| Microsoft-derived symbols | [Azure's current collection terms](https://learn.microsoft.com/en-us/azure/architecture/icons/) permit specified architecture/training/documentation uses and restrict transforms. Applicability to these exact historical Office/Azure/MSCAE conversions, and their bundling scope, remains unverified. |
| Cisco-derived browser symbol | [Cisco's topology guidance](https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html) permits use while prohibiting alteration. Whether the precise historical converted symbol is covered remains unverified; technical conversion alone is not treated here as proof of infringement. |

The five Microsoft/Cisco symbols have fixed reference paints, upright
orientation, and proportional fitting, as documented in
[vendor-artwork.md](vendor-artwork.md). Those safeguards address rendering;
they do not establish permission or vendor approval. Exact source files
and adaptation descriptions are in the
[stencil asset notice](../public/drawio-stencils/ASSET-SOURCES.md).

Existing published terms may already supply the required permission;
separate email approval is not universally required. Where those terms do
not cover the intended distribution, a rights-holder clarification or
permission, or changing the distribution, is still needed. Notices cannot
create rights. No vendor permission has been requested or represented as
obtained as part of this documentation change.

## Original regression content

Project-authored fixtures include the software-engineering, **Community
garden monitoring**, and **Book lending platform** diagrams. Their original
content uses **MIT OR Apache-2.0**; referenced vendor symbols retain their
separate terms. See the [fixture list](../tests/fixtures/README.md).

## Packaging and reproducibility

- `npm ci` installs the lockfile. `npm run licenses` collects available
  installed-package license texts, copies the project/asset notices, and
  generates an inventory covering every locked dependency. It performs no
  network requests and does not infer permission from package metadata.
- `npm run build` refreshes those notices and includes them under
  `dist/legal/`. It also keeps the OFL texts beside fonts and source notices
  beside vendor icon packs. This includes the Lucide/Feather attribution,
  the EPL text, and ELK source-access statement.
- Dependencies and assets retain their existing licenses. Notices are
  informational and do not impose new restrictions on the original code's
  MIT/Apache grants or change third-party terms.
- The Git repository omits local outputs, browser snapshots, `.env` files,
  authentication/runtime data, `node_modules/`, and generated `dist/`.
- Native-binary installers/containers are not provided here. A future
  package containing Sharp/libvips binaries needs an inventory and license /
  corresponding-source plan for the actual selected platform. See
  [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).

The repository is private for now. This licensing work makes ownership and
scope explicit; it does not resolve the vendor-artwork permission questions
above or change repository visibility. Public release and packaging are
separate decisions.

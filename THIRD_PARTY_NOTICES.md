# Third-party notices

Flowstate's original contributions use **MIT OR Apache-2.0**. The software,
fonts, templates, and vendor artwork below retain their separate terms.
The root [NOTICE](NOTICE) defines the exceptions to the project license.

## Locked software dependencies

The exact package inventory is [dependencies.json](public/legal/dependencies.json).
It includes every non-root entry in `package-lock.json`, including optional
platform packages that are not present in a particular installation.
[DEPENDENCY-LICENSES.txt](public/legal/DEPENDENCY-LICENSES.txt) preserves the
available installed packages' license/copyright texts, including the
third-party notices contained in those texts. It is not a full audit of
every optional platform binary or all nested vendored source.

| Direct package | Locked version | Declared license |
| --- | --- | --- |
| @dagrejs/dagre | 1.1.8 | MIT |
| @vitejs/plugin-react | 4.7.0 | MIT |
| @xmldom/xmldom | 0.9.12 | MIT |
| @xyflow/react | 12.12.0 | MIT |
| ajv | 8.20.0 | MIT |
| elkjs | 0.12.0 | EPL-2.0 OR GPL-3.0-or-later; used here under EPL-2.0 |
| express | 5.3.0 | MIT |
| html-to-image | 1.11.11 | MIT |
| lucide-react | 0.468.0 | ISC; upstream notice includes Feather MIT attribution |
| react | 19.3.1 | MIT |
| react-dom | 19.3.1 | MIT |
| sharp | 0.35.5 | Apache-2.0; native components have separate terms |
| vite | 6.4.5 | MIT |

Run `npm ci` followed by `npm run licenses` after changing the lockfile.
`npm run build` also refreshes the generated notice copies and inventory
before Vite copies them into `dist/legal/`. Source distributions should
retain this file, `NOTICE`, the project licenses, and the existing asset
and fixture notices. Static distributions should retain the entire
`dist/legal/`, `dist/fonts/`, and asset source notices.

### ELK source availability

Flowstate uses the unmodified npm `elkjs` package under **EPL-2.0**.
The corresponding elkjs source and build instructions are available from
[elkjs 0.12.0](https://github.com/kieler/elkjs/tree/0.12.0), including its
[source archive](https://github.com/kieler/elkjs/archive/refs/tags/0.12.0.tar.gz).
The underlying Java algorithm sources are in
[Eclipse ELK v0.12.0](https://github.com/eclipse-elk/elk/tree/v0.12.0).
The EPL text and Kiel University attribution are preserved in the collected
license texts; [ELK-SOURCE.md](public/legal/ELK-SOURCE.md) accompanies the
browser build. Flowstate does not relicense ELK under MIT/Apache.

### Sharp and optional native packages

The source repository does not vendor `node_modules/` or native binaries.
`npm ci` downloads packages according to the lockfile and the current OS.
Sharp is Apache-2.0; libvips and associated native libraries have additional
LGPL, MPL, BSD, and other terms. For the current sharp-libvips 1.3.4 release,
see the preserved [upstream notices](public/legal/SHARP-LIBVIPS-1.3.4-NOTICES.md)
and [matching build/source repository](https://github.com/lovell/sharp-libvips/tree/v1.3.4).
Shipping an installer, container, or archive with those binaries requires
the actual selected components' license texts and corresponding-source /
relinking obligations as applicable. The metadata inventory is not that
binary distribution package.

## Fonts and artwork

| Material | Location and terms |
| --- | --- |
| DM Sans and Instrument Serif | `public/fonts/`; SIL OFL 1.1; original notices included alongside the fonts |
| Software logos from Devicon | [Asset sources and license](public/software-icons/ASSET-SOURCES.md) |
| 303 official AWS service icons | `public/aws-icons/`; AWS source and usage guidance; excluded from Flowstate's code license |
| 1,306 AWS-derived draw.io symbols | `public/drawio-stencils/mxgraph.aws*`; JGraph CC BY 4.0 attribution plus applicable original-vendor terms |
| Four Microsoft symbols and one Cisco symbol | Exact identifiers and source paths in the [asset notice](public/drawio-stencils/ASSET-SOURCES.md); original-vendor rights retained |
| Azure and Google Cloud draw.io icons | `public/drawio-cloud-icons/`. See [sources and terms](public/drawio-stencils/ASSET-SOURCES.md#azure-and-google-cloud-icon-libraries). |
| Four Google Cloud legacy console icons and Firebase Cloud Messaging | [Google Cloud asset sources](public/google-cloud-icons/ASSET-SOURCES.md). Google retains rights in the artwork. |
| Five Azure architecture icons | [Microsoft Azure asset sources and icon terms](public/microsoft-azure-icons/ASSET-SOURCES.md). Microsoft retains rights in the artwork. |
| draw.io flowchart template | `tests/fixtures/drawio/official-flowchart.xml`; CC BY 4.0 with pinned source attribution |
| Vendor symbols referenced by regression diagrams | Separate vendor terms above; original fixture layouts/text and generated PNG tiles use MIT OR Apache-2.0; see the [fixture notice](tests/fixtures/README.md) |

Source links and change descriptions are in the asset directories and
[drawio-import.md](docs/drawio-import.md). Known vendor restrictions and
remaining questions are recorded in [licensing.md](docs/licensing.md).
Attribution and license separation do not grant additional rights in
third-party content or trademarks.

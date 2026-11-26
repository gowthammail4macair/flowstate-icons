# FlowState icon packs

Private, versioned diagram artwork for flowstate-canvas. Both application branches pin the same release ZIP. The default branch is main.

Regenerate catalog.json with `node scripts/catalog.mjs`. Build the archive with `python3 scripts/build-pack.py 1.0.0 --output releases/v1.0.0/flowstate-icons-1.0.0.zip`. The release manifest records per-file SHA-256 digests. The app additionally verifies the digest of the full ZIP.

The initial release preserves the source catalog and conversion outputs of Studio main 48bd780 and Studio cloud e7344d4. The public directory contains vendor artwork and 12 general Lucide picker symbols. The three historical draw.io importer bitmaps are preserved in src/drawio-library-images.json. Review RIGHTS.md before redistribution.


// Reference paints from the pinned draw.io v24.7.17 Office/Azure/Cisco
// sidebar styles. These rendering safeguards do not grant redistribution rights.
const policies = {
  'mxgraph.office.users.user': {fill:'#505050',stroke:'none'},
  'mxgraph.azure.scheduler': {fill:'#00BEF2',stroke:'none'},
  'drawio.mscae.shared_dashboard': {fill:'#3999c6',stroke:'none'},
  'drawio.mscae.schedulerjobcollection': {fill:'#3999c6',stroke:'none'},
  'mxgraph.cisco.computers_and_peripherals.web_browser': {fill:'#036897',stroke:'#ffffff'}
};

export function vendorArtworkPolicy(id) {
  return Object.hasOwn(policies,id)?policies[id]:null;
}

export function protectVendorAppearance(appearance) {
  const policy=vendorArtworkPolicy(appearance?.glyph);
  return policy?{...appearance,rotation:0,flipH:false,flipV:false,glyphFill:policy.fill,glyphBackground:'none'}:appearance;
}

export function stencilPaint(id,path) {
  const policy=vendorArtworkPolicy(id);
  return {
    fill:policy&&path.fill==='currentColor'?policy.fill:path.fill,
    stroke:policy&&path.stroke==='currentColor'?policy.stroke:path.stroke
  };
}

export function stencilViewBox(id,shape) {
  // Include stroke extents so the SVG viewport cannot cut off the outline.
  const padding=vendorArtworkPolicy(id)?Math.max(0,...(shape.paths||[]).map(path=>stencilPaint(id,path).stroke==='none'?0:(path.strokeWidth??1)/2)):0;
  return `${-padding} ${-padding} ${shape.width+padding*2} ${shape.height+padding*2}`;
}

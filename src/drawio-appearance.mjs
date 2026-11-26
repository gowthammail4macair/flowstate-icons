import originalStencils from './drawio-stencils.json' with {type:'json'};
import {cloudIconAsset,cloudStencils} from './drawio-cloud-icons.mjs';
import {protectVendorAppearance} from './vendor-artwork.mjs';
export const stencils={...cloudStencils,...originalStencils};
export function stencilAssetPath(id,extension='json'){
  if(!Object.hasOwn(stencils,id)||!['json','svg'].includes(extension))throw new Error('Unknown diagram symbol.');
  if(!Object.hasOwn(originalStencils,id))return extension==='svg'?cloudIconAsset(id):null;
  return `/drawio-stencils/${id}.${extension}`;
}
const paints=/^(?:none|#[\da-f]{6})$/i;
const fonts=['Arial','Helvetica','Verdana','Georgia','Times New Roman','Courier New','DM Sans'];
const enumValues={verticalAlign:['top','middle','bottom'],fontFamily:fonts,fontStyle:['normal','italic'],labelPosition:['center','left','right'],verticalLabelPosition:['top','middle','bottom'],borderStyle:['solid','dashed','dotted']};
export const validRaster=value=>typeof value==='string'&&value.length<=1_500_000&&/^data:image\/(?:png|jpeg|gif|webp);base64,[A-Za-z0-9+/=\r\n]+$/.test(value);
export function validAppearance(value){
  if(!value||typeof value!=='object'||Array.isArray(value))return false;
  for(const [key,v] of Object.entries(value)){
    if(['fill','stroke','fontColor','glyphFill','glyphBackground','labelBackground'].includes(key)){if(typeof v!=='string'||!paints.test(v))return false;}
    else if(enumValues[key]){if(!enumValues[key].includes(v))return false;}
    else if(key==='sequenceShape'){if(!['lifeline','actorLifeline','actor','frame'].includes(v))return false;}
    else if(key==='sequenceSolid'){if(typeof v!=='boolean')return false;}
    else if(['sequenceWidth','sequenceHeight'].includes(key)){if(!Number.isFinite(v)||v<0||v>10000)return false;}
    else if(key==='outline'){if(typeof v!=='string'||v.length>512||!/^M[MLHVZ0-9., \-]+Z$/.test(v))return false;}
    else if(key==='glyph'){if(!Object.hasOwn(stencils,v))return false;}
    else if(key==='image'){if(!validRaster(v))return false;}
    else if(['wrap','imageAspect','underline','anchor','container','flipH','flipV'].includes(key)){if(typeof v!=='boolean')return false;}
    else if(key==='fontWeight'){if(![400,700].includes(v))return false;}
    else if(key==='fontSize'){if(!Number.isInteger(v)||v<10||v>48)return false;}
    else if(key==='rotation'){if(!Number.isFinite(v)||Math.abs(v)>360)return false;}
    else if(['strokeWidth','padding','paddingLeft','paddingRight','paddingTop','paddingBottom','radius'].includes(key)){if(!Number.isFinite(v)||v<0||v>100)return false;}
    else return false;
  }
  return true;
}
export function appearanceData(data){return data?.drawio&&validAppearance(data.drawio)?{drawio:{...protectVendorAppearance(data.drawio)}}:{};}
export function editAppearance(data,patch,{removeArtwork=false}={}){
  const result=appearanceData(data),value=result.drawio;if(!value)return result;
  if(value.sequenceShape&&((patch.shape!==undefined&&patch.shape!==data.shape)||(patch.icon!==undefined&&patch.icon!==data.icon))){
    for(const key of ['sequenceShape','sequenceWidth','sequenceHeight','sequenceSolid','container'])delete value[key];
  }
  if(patch.shape!==undefined&&patch.shape!==data.shape)delete value.outline;
  if(patch.color!==undefined&&patch.color!==data.color)for(const key of ['fill','stroke','fontColor'])delete value[key];
  if(removeArtwork||patch.icon!==undefined&&patch.icon!==data.icon){
    for(const key of ['glyph','image','glyphFill','glyphBackground'])delete value[key];
    if(!removeArtwork)delete value.outline;
    if(patch.icon==='none'&&!removeArtwork)for(const key of ['fill','stroke'])delete value[key];
  }
  return result;
}
export function themePaint(value,theme,kind='ink'){
  if(theme!=='dark'||!/^#[\da-f]{6}$/i.test(value||''))return value;
  const rgb=[1,3,5].map(i=>parseInt(value.slice(i,i+2),16));
  if(Math.max(...rgb)-Math.min(...rgb)<32){
    if(kind==='fill'&&Math.min(...rgb)>230)return '#191b22';
    if(kind!=='fill'&&Math.max(...rgb)<100)return '#dce1e7';
  }
  return value;
}

// Convert draw.io v24.7.17 CC BY 4.0 stencil geometry into local, inert assets.
// Usage: node scripts/import-drawio-stencils.mjs aws4.xml aws3.xml office-users.xml azure.xml cisco-computers.xml Shared_Dashboard.svg SchedulerJobCollection.svg [Docker.svg Files.svg Browser.svg]
import fs from 'node:fs';
import sharp from 'sharp';
import {DOMParser} from '@xmldom/xmldom';
import {convertStencil,value} from './drawio-stencil-paths.mjs';
import {stencilPaint,stencilViewBox,vendorArtworkPolicy} from '../src/vendor-artwork.mjs';
const sets=[['mxgraph.aws4',null],['mxgraph.aws3',null],['mxgraph.office.users',['user']],['mxgraph.azure',['scheduler','computer']],['mxgraph.cisco.computers_and_peripherals',['web browser']]];
const directory=new URL('../public/drawio-stencils/',import.meta.url);fs.mkdirSync(directory,{recursive:true});
const catalog={};
function defaultColor(id){
  if(id==='mxgraph.azure.computer')return '#00188D';
  if(/queue|event|step_functions|sns|sqs|cloudwatch/.test(id))return '#E7157B';
  if(/rds|postgres|redshift|timestream|database|dynamo/.test(id))return '#C925D1';
  if(/bucket|storage|s3|efs|iot|fleetwise|car/.test(id))return '#7AA116';
  if(/lambda|ec2|ecs|ecr|compute|container/.test(id))return '#ED7100';
  if(/iam|role|security/.test(id))return '#DD344C';
  return '#8C4FFF';
}
const escape=text=>String(text).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
function save(id,label,descriptor){
  const policy=vendorArtworkPolicy(id),color=policy?.fill||defaultColor(id),base=`/drawio-stencils/${id}`;
  catalog[id]={width:descriptor.width,height:descriptor.height,label,color};
  fs.writeFileSync(new URL(`${id}.json`,directory),JSON.stringify(descriptor)+'\n');
  const paths=descriptor.paths.map(p=>{const paint=stencilPaint(id,p);return `<path d="${escape(p.d)}" fill="${escape(paint.fill)}" stroke="${escape(paint.stroke)}" stroke-width="${p.strokeWidth??1}" opacity="${p.opacity??1}" fill-opacity="${p.fillOpacity??1}" stroke-opacity="${p.strokeOpacity??1}" stroke-linejoin="${p.lineJoin||'miter'}" stroke-linecap="${p.lineCap||'butt'}"/>`;}).join('');
  const text=descriptor.text?`<text x="35" y="60" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="#111111">${escape(descriptor.text)}</text>`:'';
  fs.writeFileSync(new URL(`${id}.svg`,directory),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${stencilViewBox(id,descriptor)}"${policy?' preserveAspectRatio="xMidYMid meet"':''} color="${color}">${paths}${text}</svg>`);
}
for(const [index,[namespace,names]] of sets.entries()){
  const input=process.argv[index+2];if(!input)throw new Error(`Missing XML for ${namespace}`);
  const doc=new DOMParser().parseFromString(fs.readFileSync(input,'utf8'),'text/xml');
  for(const shape of Array.from(doc.getElementsByTagName('shape'))){
    const name=shape.getAttribute('name').toLowerCase();if(names&&!names.includes(name))continue;
    save(`${namespace}.${name.replaceAll(' ','_')}`,shape.getAttribute('name'),convertStencil(shape));
  }
}
// Two image-library symbols referenced by the regression diagram, converted to inert paths too.
for(const [offset,name] of ['Shared_Dashboard','SchedulerJobCollection'].entries()){
  const input=process.argv[offset+7];if(!input)throw new Error(`Missing SVG for ${name}`);
  const doc=new DOMParser().parseFromString(fs.readFileSync(input,'utf8'),'image/svg+xml'),root=doc.documentElement;
  const descriptor={width:value(root,'width'),height:value(root,'height'),paths:[]};
  function walk(element,inherited={fill:'#000000',stroke:'none',opacity:1}){
    const state={...inherited};for(const key of ['fill','stroke','opacity'])if(element.hasAttribute(key))state[key]=element.getAttribute(key);
    if(element.tagName==='path')descriptor.paths.push({d:element.getAttribute('d'),...state});
    else if(element.tagName==='circle'){const x=value(element,'cx'),y=value(element,'cy'),r=value(element,'r');descriptor.paths.push({d:`M${x-r},${y} a${r},${r} 0 1,0 ${r*2},0 a${r},${r} 0 1,0 ${-r*2},0`,...state});}
    else if(element.tagName==='use'){const id=(element.getAttribute('xlink:href')||element.getAttribute('href')).slice(1),target=Array.from(doc.getElementsByTagName('path')).find(p=>p.getAttribute('id')===id);if(!target)throw new Error('Missing SVG definition');walk(target,state);}
    else if(['svg','g'].includes(element.tagName))for(const child of Array.from(element.childNodes).filter(c=>c.nodeType===1&&c.tagName!=='defs'))walk(child,state);
    else throw new Error(`Unsupported SVG primitive ${element.tagName}`);
  }
  walk(root);save(`drawio.mscae.${name.toLowerCase()}`,name,descriptor);
}
// Original vector substitute for a recognized external Python artwork URL.
const python={width:70,height:70,paths:[{d:'M12,2 L46,2 L60,16 L60,67 L12,67 Z M46,2 L46,16 L60,16',fill:'#f4f4f4',stroke:'#9ca3af'},{d:'M20,27 L52,27 M20,33 L47,33 M20,39 L51,39 M20,45 L40,45',fill:'none',stroke:'#9ca3af'}],text:'Python'};
save('flowstate.python-document','Python document',python);
save('flowstate.curly-bracket','Curly bracket',{width:20,height:100,paths:[{d:'M20,0 Q10,0 10,4 L10,46 Q10,50 0,50 Q10,50 10,54 L10,96 Q10,100 20,100',fill:'none',stroke:'currentColor',strokeWidth:1,vectorEffect:true}]});
fs.writeFileSync(new URL('../src/drawio-stencils.json',import.meta.url),JSON.stringify(catalog)+'\n');
console.log(JSON.stringify({total:Object.keys(catalog).length,aws4:Object.keys(catalog).filter(id=>id.startsWith('mxgraph.aws4.')).length,aws3:Object.keys(catalog).filter(id=>id.startsWith('mxgraph.aws3.')).length}));

// Rasterize these known draw.io library assets offline. In particular, a
// browser window may sit behind separate editable controls and labels.
if (process.argv.length > 9) {
  const sources = ['mscae/Docker.svg','azure2/general/Files.svg','azure2/general/Browser.svg'];
  if (process.argv.length !== 12) throw new Error('Provide Docker.svg, Files.svg and Browser.svg together.');
  const bitmaps = {};
  for (const [i, source] of sources.entries()) {
    const png = await sharp(process.argv[i+9], {density:1200}).resize({width:512,height:512,fit:'inside'}).png().toBuffer();
    bitmaps['img/lib/'+source] = 'data:image/png;base64,'+png.toString('base64');
  }
  fs.writeFileSync(new URL('../src/drawio-library-images.json',import.meta.url), JSON.stringify(bitmaps,null,2)+'\n');
}

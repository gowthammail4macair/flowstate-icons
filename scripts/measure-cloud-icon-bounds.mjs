// Refresh after adding or replacing cloud SVGs. The original artwork stays intact.
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {cloudResourceIcons} from '../src/drawio-cloud-icons.mjs';

const asset=icon=>fileURLToPath(new URL(`../public${icon.src}`,import.meta.url));
const frame=256;
const bounds={};
const fraction=(pixels,dimension)=>Math.round(pixels/dimension*10000)/10000;
for(let start=0;start<cloudResourceIcons.length;start+=48){
  const measured=await Promise.all(cloudResourceIcons.slice(start,start+48).map(async icon=>{
    const {data,info}=await sharp(asset(icon),{density:144})
      .resize(frame,frame,{fit:'inside'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const {width,height,channels}=info;
    let left=width,top=height,right=-1,bottom=-1;
    for(let y=0;y<height;y++){
      for(let x=0;x<width;x++){
        if(data[(y*width+x)*channels+channels-1]<12)continue;
        left=Math.min(left,x);top=Math.min(top,y);
        right=Math.max(right,x);bottom=Math.max(bottom,y);
      }
    }
    if(right<left||bottom<top)return null;
    const box=[fraction(left,width),fraction(top,height),
      fraction(right+1-left,width),fraction(bottom+1-top,height)];
    return box[2]>=.98&&box[3]>=.98?null:[icon.id,box];
  }));
  for(const item of measured.filter(Boolean))bounds[item[0]]=item[1];
}
const entries=Object.entries(bounds).sort(([a],[b])=>a.localeCompare(b));
const lines=entries.map(([id,box])=>`  ${JSON.stringify(id)}: ${JSON.stringify(box)}`);
await writeFile(new URL('../src/cloud-icon-bounds.json',import.meta.url),`{\n${lines.join(',\n')}\n}\n`);
console.log(`Measured ${cloudResourceIcons.length} cloud icons and recorded ${entries.length} with visible padding.`);

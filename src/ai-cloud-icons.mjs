import serviceIcons from './ai-cloud-service-icons.json' with {type:'json'};

export const cloudIconProviders={aws:'AWS',azure:'Azure',gcp:'Google Cloud'};
export const allCloudIcons=Object.freeze(Object.keys(cloudIconProviders));
export const defaultCloudIcons=Object.freeze(['aws']);

export function readCloudIcons(value=allCloudIcons){
  if(!Array.isArray(value)||value.length>allCloudIcons.length||
    new Set(value).size!==value.length||value.some(provider=>!allCloudIcons.includes(provider))){
    throw new Error('Cloud icons must be a list of unique AWS, Azure, or Google Cloud selections.');
  }
  return value;
}

const cloudLogos={'software-azure':'azure','software-azuredevops':'azure','software-googlecloud':'gcp'};
const iconIdsByGlyph=new Map(Object.entries(serviceIcons).map(([id,glyph])=>[glyph,id]));
export const cloudServiceIconGlyph=id=>Object.hasOwn(serviceIcons,id)?serviceIcons[id]:undefined;
export const cloudServiceIconId=glyph=>iconIdsByGlyph.get(glyph);

export function allowsCloudIcon(id,cloudIcons){
  if(typeof id!=='string')return true;
  const provider=id.startsWith('aws-')?'aws':cloudServiceIconGlyph(id)?id.split('-',1)[0]:Object.hasOwn(cloudLogos,id)?cloudLogos[id]:null;
  return !provider||cloudIcons.includes(provider);
}

export function cloudIconInstructions(cloudIcons, {editing=false}={}){
  const instructions=['Follow the requested architecture. Use generic icons for cloud services whose branded icons are unavailable.'];
  if(cloudIcons.includes('aws'))instructions.push('For AWS services, use matching aws-* icons from the schema.');
  for(const provider of cloudIcons.filter(provider=>provider!=='aws')){
    instructions.push(`For ${cloudIconProviders[provider]} services, select the matching ${provider}-* service icon ID from the schema.`);
  }
  if(cloudIcons.some(provider=>provider!=='aws')){
    instructions.push('When the schema has no exact service icon, use a generic icon and put the provider and exact product name together on one line of the label or detail. Use a provider logo only for a card that represents the provider itself.');
    if(editing)instructions.push('To replace or add service artwork on an existing node, set its icon explicitly in update-node. Leave icon=null for edits that preserve the artwork.');
  }
  return instructions;
}

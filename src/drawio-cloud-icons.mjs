import catalog from './drawio-cloud-icons.json' with {type:'json'};
import googleCloudIcons from './google-cloud-icons.json' with {type:'json'};
import microsoftAzureIcons from './microsoft-azure-icons.json' with {type:'json'};
import {allCloudIcons} from './ai-cloud-icons.mjs';

export const cloudStencils={...catalog.icons,...googleCloudIcons,...microsoftAzureIcons};
export const cloudIconAsset=id=>{
  if(Object.hasOwn(googleCloudIcons,id))return `/google-cloud-icons/${id}.svg`;
  if(Object.hasOwn(microsoftAzureIcons,id))return `/microsoft-azure-icons/${id}.svg`;
  return Object.hasOwn(catalog.icons,id)?`/drawio-cloud-icons/${id}.svg`:null;
};
export const cloudCategories=['Azure','Azure Legacy','Google Cloud','Google Cloud Legacy'];


export async function cloudImageStencil(source) {
  if(!source)return null;
  const path=source.replace(/^https?:\/\/(?:app\.diagrams\.net|(?:app\.)?draw\.io)(?=\/)/i,'').replace(/^\/?(?:\.\/)?(?=img\/lib\/)/,'');
  if(path.startsWith('img/lib/')){
    try{return catalog.images[decodeURIComponent(path.split(/[?#]/,1)[0])]||null;}
    catch{return null;}
  }
  const encoded=/^data:image\/svg\+xml(?:;base64)?,([A-Za-z0-9+/=]+)$/i.exec(source)?.[1];
  if(!encoded)return null;
  try{
    const bytes=Uint8Array.from(atob(encoded),character=>character.charCodeAt(0));
    const hash=await crypto.subtle.digest('SHA-256',bytes);
    return catalog.embedded[Array.from(new Uint8Array(hash),byte=>byte.toString(16).padStart(2,'0')).join('')]||null;
  }catch{return null;}
}

const nameKey=name=>name.toLowerCase().replace(/[^a-z0-9]/g,'');
const names={azure:new Map(),gcp:new Map()};
const categoriesByPriority=['Azure','Google Cloud','Azure Legacy','Google Cloud Legacy'];
for(const category of categoriesByPriority){
  const provider=category.startsWith('Azure')?'azure':'gcp',byName=names[provider];
  for(const [id,icon] of Object.entries(cloudStencils).filter(([,icon])=>icon.category===category).sort(([a],[b])=>
    Number(b.startsWith('mxgraph.gcp3.'))-Number(a.startsWith('mxgraph.gcp3.')))){
    const label=nameKey(icon.label.replace(/^(?:azure|google cloud|gcp)\s+/i,''));
    if(!byName.has(label))byName.set(label,id);
    // Also preserve values visibly containing the provider, such as Cloud SQL.
    const full=nameKey(icon.label);
    if(!byName.has(full))byName.set(full,id);
  }
}

// Use the same service names for automatic matching and picker searches.
const azureServiceAliases={
  'drawio.azure2.compute.disks':['Managed Disk','Azure Managed Disks','Managed Disks','Disk Storage'],
  'drawio.azure2.compute.virtual_machine':['Azure Virtual Machines','Virtual Machines','VM','VMs'],
  'drawio.azure2.compute.vm_scale_sets':['Virtual Machine Scale Sets','VMSS'],
  'drawio.azure2.compute.function_apps':['Azure Functions','Functions','Function'],
  'drawio.azure2.containers.kubernetes_services':['AKS','Azure Kubernetes Service','Kubernetes Service','Kubernetes Service (AKS)'],
  'drawio.azure2.app_services.app_services':['App Service'],
  'drawio.azure2.app_services.search_services':['AI Search'],
  'drawio.azure2.ai_machine_learning.ai_foundry':['Microsoft Foundry'],
  'drawio.azure2.ai_machine_learning.foundry_project':['Foundry Projects'],
  'drawio.azure2.ai_machine_learning.azure_openai':['OpenAI Service'],
  'drawio.azure2.ai_machine_learning.cognitive_services':['AI Services'],
  'drawio.azure2.ai_machine_learning.form_recognizers':['AI Document Intelligence','Document Intelligence','Form Recognizer'],
  'drawio.azure2.ai_machine_learning.bot_services':['Bot Service'],
  'drawio.azure2.databases.sql_database':['SQL'],
  'drawio.azure2.databases.azure_database_postgresql_server':['Database for PostgreSQL','Database for PostgreSQL Flexible Server'],
  'drawio.azure2.databases.azure_database_mysql_server':['Database for MySQL','Database for MySQL Flexible Server'],
  'drawio.azure2.databases.azure_cosmos_db':['Cosmos DB for MongoDB'],
  'drawio.azure2.hybrid_multicloud.azure_local':['Azure Stack HCI','Stack HCI'],
  'drawio.azure2.identity.entra_domain_services':['Microsoft Entra Domain Services'],
  'drawio.azure2.identity.external_id':['Microsoft Entra External ID','Entra External ID'],
  'drawio.azure2.identity.entra_private_access':['Microsoft Entra Private Access'],
  'drawio.azure2.identity.entra_internet_access':['Microsoft Entra Internet Access'],
  'drawio.azure2.identity.entra_managed_identities':['Managed Identity','Managed Identities'],
  'drawio.azure2.integration.azure_pubsub':['Web PubSub'],
  'drawio.azure2.analytics.log_analytics_workspaces':['Log Analytics Workspace'],
  'drawio.azure2.management_governance.automation_accounts':['Automation Account'],
  'drawio.azure2.management_governance.monitor':['Monitor Workspace'],
  'drawio.azure2.management_governance.recovery_services_vaults':['Recovery Services Vault'],
  'drawio.azure2.management_governance.resource_graph_explorer':['Resource Graph'],
  'drawio.azure2.networking.application_gateway_containers':['Application Gateway for Containers'],
  'drawio.azure2.networking.application_gateways':['Application Gateway'],
  'drawio.azure2.networking.bastions':['Bastion'],
  'drawio.azure2.networking.ddos_custom_policy':['DDoS custom policies'],
  'drawio.azure2.networking.ddos_protection_plans':['DDoS Protection'],
  'drawio.azure2.networking.dns_private_resolver':['Private DNS Resolver'],
  'drawio.azure2.networking.dns_zones':['Private DNS','Private DNS Zone'],
  'drawio.azure2.networking.front_doors':['Front Door'],
  'drawio.azure2.networking.nat':['NAT Gateway'],
  'drawio.azure2.networking.network_security_groups':['Network Security Group'],
  'drawio.azure2.networking.virtual_networks':['VNet'],
  'drawio.azure2.networking.virtual_network_gateways':['Virtual Network Gateway','ExpressRoute Gateway'],
  'drawio.azure2.networking.virtual_wans':['Virtual WAN'],
  'drawio.azure2.networking.vpn_client_windows':['VPN Client'],
  'drawio.azure2.other.container_app_environments':['Container Apps'],
  'drawio.azure2.other.entra_identity':['Microsoft Entra ID','Entra ID','Azure AD','Azure Active Directory','Active Directory','AD'],
  'drawio.azure2.other.grafana':['Managed Grafana'],
  'drawio.azure2.other.peerings':['Virtual Network Peering'],
  'drawio.azure2.other.prometheus':['Managed Prometheus'],
  'drawio.azure2.security.application_security_groups':['Application Security Group'],
  'drawio.azure2.security.azure_sentinel':['Microsoft Sentinel'],
  'drawio.azure2.security.key_vaults':['Key Vault','Managed HSM','Key Vault Managed HSM'],
  'drawio.azure2.storage.storage_accounts':['Azure Blob Storage','Blob Storage','Storage Account','Data Lake Storage Gen2'],
  'drawio.azure2.general.storage_queue':['Queue Storage'],
  'drawio.azure2.web.signalr':['SignalR Service'],
  'microsoft.azure.container-apps-sandboxes':['ACA Sandboxes'],
  'microsoft.azure.defender-for-cloud':['Defender for Cloud']
};
const gcpServiceAliases={
  'drawio.gcp2.migrate-for-compute-engine.4796bbfa6256':['Migrate to Virtual Machines','Migrate to VMs'],
  'mxgraph.gcp3.gke':['GKE','Google Kubernetes Engine','Kubernetes Engine'],
  'drawio.gcpicons.pub-sub.7d245cebf843':['Pub/Sub','PubSub','Pub Sub','Cloud Pub/Sub'],
  'drawio.gcpicons.firestore.dddbcf76ced1':['Firestore','Cloud Firestore','Firebase Cloud Firestore'],
  'google.firebase.cloud-messaging':['Firebase Cloud Messaging','Cloud Messaging','FCM'],
  'mxgraph.gcp3.cloud_storage':['Cloud Storage'],
  'drawio.gcpicons.cloud-functions.7b5071404536':['Cloud Run functions'],
  'mxgraph.gcp3.alloydb':['AlloyDB for PostgreSQL'],
  'drawio.gcpicons.key-management-service.15f212b6ae2e':['Cloud KMS','Cloud Key Management Service'],
  'drawio.gcpicons.cloud-vpn.23edbb78a230':['HA VPN','HA VPN Gateway','Classic VPN'],
  'drawio.gcpicons.cloud-load-balancing.1f01d8e77fd4':[
    'Cloud Load Balancer','Application Load Balancer','Internal Application Load Balancer',
    'External Application Load Balancer','Regional Internal Application Load Balancer',
    'Cross-Region Internal Application Load Balancer','Regional External Application Load Balancer',
    'Global External Application Load Balancer','Classic Application Load Balancer'
  ],
  'drawio.gcpicons.virtual-private-cloud.a323667c832e':['VPC'],
  'mxgraph.gcp3.operations':['Cloud Operations'],
  'drawio.gcpicons.cloud-iam.f98258d9fa68':['Identity and Access Management'],
  'drawio.gcp2.identity-aware-proxy.5322799a4bb5':['IAP'],
  'mxgraph.gcp3.apigee':['Apigee API Management'],
  'drawio.gcpicons.trace.180a73ffc4d3':['Cloud Trace'],
  'drawio.gcp2.workflows.cea1f00aae5c':['Cloud Workflows'],
  'drawio.gcpicons.data-loss-prevention-api.58793c9ca968':['Cloud Data Loss Prevention','Cloud DLP','Sensitive Data Protection'],
  'drawio.gcp2.healthcare-api.9e671a758e5e':['Cloud Healthcare API'],
  'google.cloud.network-connectivity-center':['NCC'],
  'google.cloud.private-service-connect':['PSC'],
  // These products use shared category icons in Google's current icon system.
  'mxgraph.gcp3.aimachinelearning':['Agent Search','Vertex AI Search'],
  'mxgraph.gcp3.migration':['Migration Center'],
  'mxgraph.gcp3.securityidentity':['Workload Identity Federation','WIF']
};
const indexAliases=services=>Object.fromEntries(Object.entries(services).flatMap(([id,aliases])=>
  aliases.map(alias=>[nameKey(alias),id])));
const azureAliases=indexAliases(azureServiceAliases),gcpAliases=indexAliases(gcpServiceAliases);
export const cloudResourceIcons=Object.entries(cloudStencils).map(([id,entry])=>({
  ...entry,id,stencil:id,src:cloudIconAsset(id),
  keywords:[entry.category.startsWith('Azure')?'azure microsoft':'gcp google cloud platform',
    ...(azureServiceAliases[id]||gcpServiceAliases[id]||[])].join(' ')
}));

const unqualifiedGcp=new Set([
  'bigquery','cloudrun','cloudrunfunctions','computeengine','cloudsql','vertexai','pubsub','gke',
  'googlekubernetesengine','alloydb','alloydbforpostgresql','apigee','apigeeapimanagement',
  'migratetovirtualmachines','migratetovms','vertexaisearch','cloudids',
  'networkconnectivitycenter','privateserviceconnect','firestore','cloudfirestore','firebasecloudfirestore',
  'firebasecloudmessaging','fcm'
]);
const unqualifiedAzure=new Set([
  'Cosmos DB','Key Vault','AKS','Entra ID','Microsoft Entra ID','Microsoft Entra Domain Services',
  'Microsoft Entra External ID','Microsoft Entra Private Access','Microsoft Entra Internet Access',
  'Microsoft Foundry','Microsoft Defender for Cloud','Microsoft Sentinel'
].map(nameKey));
const findName=(provider,name)=>{
  const key=nameKey(name),aliases=provider==='azure'?azureAliases:gcpAliases;
  const alias=aliases[key];
  return Object.hasOwn(cloudStencils,alias)?alias:names[provider].get(key)||null;
};

function serviceNameLine(text){
  // Accept a leading standalone product name, even when followed by a description.
  return text.trim().split(/\s+(?:[—–]|-)\s+|\s*:\s+|\.(?=\s|$)/,1)[0];
}

const providerHeadings=new Map([
  ['google','gcp'],['googlecloud','gcp'],['googlecloudplatform','gcp'],['gcp','gcp'],
  ['azure','azure'],['microsoftazure','azure']
]);
export const cloudProviderHeading=label=>providerHeadings.get(nameKey(label||''));

export function isCloudProviderBadge(id){
  if(id==='software-azure'||id==='software-googlecloud')return true;
  const label=Object.hasOwn(cloudStencils,id)?nameKey(cloudStencils[id].label):'';
  return label==='cloud'||providerHeadings.has(label);
}

function cloudServiceName(text){
  if(providerHeadings.has(nameKey(text)))return null;
  // Read the GCP prefix before splitting off descriptions, e.g. "GCP: BigQuery".
  const gcp=/^(gcp|google(?:\s+cloud(?:\s+platform)?)?)(?:\s*[:·/—–]\s*|\s+-\s+|\s+)(.+)$/i.exec(text.trim());
  if(gcp){
    const [,provider,service]=gcp;
    const name=serviceNameLine(service);
    const withCloud=`Cloud ${name}`;
    // "Google Cloud Storage" and "Google Cloud · Bigtable" can both share the Cloud prefix.
    const candidates=/^google\s+cloud$/i.test(provider)?[withCloud,name]:[name,withCloud];
    for(const candidate of candidates){
      const id=findName('gcp',candidate);
      if(id)return id;
    }
    return /^cloud\s+/i.test(name)?findName('gcp',name.replace(/^cloud\s+/i,'')):null;
  }
  const azure=/^(?:microsoft\s+)?azure(?:\s*[:·/—–]\s*|\s+-\s+|\s+)(.+)$/i.exec(text.trim());
  if(azure){
    const name=serviceNameLine(azure[1]);
    return findName('azure',name)||findName('azure',name.replace(/^(?:microsoft\s+)?azure\s+/i,''));
  }
  const name=serviceNameLine(text);
  const key=nameKey(name);
  if(unqualifiedAzure.has(key))return findName('azure',name);
  if(unqualifiedGcp.has(key))return findName('gcp',name);
  return null;
}

export function cloudServiceStencil({label='',detail='',shape,icon,providerHint},cloudIcons=allCloudIcons){
  if(!['rectangle','rounded'].includes(shape)||/^(?:aws|software)-/.test(icon)&&!isCloudProviderBadge(icon))return null;
  const lines=[...label.split('\n'),...detail.split('\n')];
  const accepted=id=>id&&!isCloudProviderBadge(id)&&cloudIcons.includes(cloudStencils[id].category.startsWith('Azure')?'azure':'gcp');
  const direct=lines.map(cloudServiceName).find(accepted);
  if(direct)return direct;
  const headings=new Set(lines.map(cloudProviderHeading).filter(Boolean));
  if(headings.size>1)return null;
  const provider=[...headings][0]||providerHint;
  if(!cloudIcons.includes(provider))return null;
  return lines.filter(line=>!providerHeadings.has(nameKey(line))).map(line=>findName(provider,serviceNameLine(line))).find(accepted)||null;
}

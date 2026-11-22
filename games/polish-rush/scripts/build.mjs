import {mkdir,cp,rm} from 'node:fs/promises';
await rm(new URL('../dist',import.meta.url),{recursive:true,force:true});
await mkdir(new URL('../dist',import.meta.url),{recursive:true});
for(const item of ['index.html','src'])await cp(new URL('../'+item,import.meta.url),new URL('../dist/'+item,import.meta.url),{recursive:true});
await cp(new URL('../public/',import.meta.url),new URL('../dist/',import.meta.url),{recursive:true});
console.log('Built dist/');

import * as T from 'three';
const UP=new T.Vector3(0,1,0);
export function createWorld(canvas){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(55,1,.1,1800);let cityGroup=new T.Group(),carGroup,curve,length,city;
 const hemi=new T.HemisphereLight(0xcbeaff,0x5a5141,2.5);scene.add(hemi);
 const sun=new T.DirectionalLight(0xffdec1,3.5);sun.position.set(100,170,-130);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-85;sun.shadow.camera.right=85;sun.shadow.camera.top=85;sun.shadow.camera.bottom=-85;sun.shadow.camera.far=400;sun.shadow.normalBias=.05;scene.add(sun,sun.target);
 const mat=(color,metalness=0,roughness=.8)=>new T.MeshStandardMaterial({color,metalness,roughness});
 function box(parent,w,h,d,x,y,z,material){const m=new T.Mesh(new T.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function cylinder(parent,r1,r2,h,x,y,z,material,segments=16){const m=new T.Mesh(new T.CylinderGeometry(r1,r2,h,segments),material);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
 function label(text,w=12,h=2,color='#d0ff70'){const c=document.createElement('canvas');c.width=1024;c.height=128;const x=c.getContext('2d');x.fillStyle='#14262c';x.fillRect(0,0,1024,128);x.fillStyle=color;x.textAlign='center';x.font='bold 60px sans-serif';x.fillText(text,512,88);return new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),side:T.DoubleSide}));}
 function roadTexture(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');let seed=123;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};const im=x.createImageData(256,256);for(let i=0;i<im.data.length;i+=4){const v=47+random()*20;im.data[i]=v;im.data[i+1]=v+3;im.data[i+2]=v+5;im.data[i+3]=255;}x.putImageData(im,0,0);const tex=new T.CanvasTexture(c);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(3,90);return tex;}
 const asphalt=new T.MeshStandardMaterial({map:roadTexture(),roughness:.62,metalness:.08});
 function ribbon(width,height,material){const p=[],uv=[],indices=[],count=700;for(let i=0;i<=count;i++){const t=i/count,center=curve.getPointAt(t),tan=curve.getTangentAt(t),side=new T.Vector3(tan.z,0,-tan.x).normalize();for(const sign of [-1,1]){const v=center.clone().addScaledVector(side,width/2*sign);p.push(v.x,v.y+height,v.z);uv.push(sign===-1?0:1,t); }if(i<count){const k=i*2;indices.push(k,k+2,k+1,k+1,k+2,k+3);}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const mesh=new T.Mesh(g,material);mesh.receiveShadow=true;cityGroup.add(mesh);}
 function gate(t,text,color){const p=curve.getPointAt(t),tan=curve.getTangentAt(t),g=new T.Group();g.position.copy(p);g.rotation.y=Math.atan2(tan.x,tan.z);const m=mat(color,.3,.35);box(g,.45,6,.5,-9,3,0,m);box(g,.45,6,.5,9,3,0,m);box(g,18.5,.65,.5,0,6,0,m);const sign=label(text,15,1.15);sign.position.set(0,5.9,-.3);sign.rotation.y=Math.PI;g.add(sign);cityGroup.add(g);}
 function landmark(){const g=new T.Group();g.position.set(-155,0,140);const stone=mat(0xc5b494),brick=mat(0x925c48),roof=mat(0x42645b,.35,.6),glass=mat(0x789cae,.65,.23);
 if(city.id==='warszawa'){for(let i=0;i<5;i++)box(g,35-i*5,15,30-i*4,0,7.5+i*15,0,stone);box(g,9,22,9,0,83,0,stone);cylinder(g,.15,1.4,25,0,105,0,roof);for(let n=0;n<5;n++)box(g,14,50+n*13,17,55+n*21,(50+n*13)/2,n%2*30,glass);}
 else if(city.id==='lodz'){box(g,85,18,26,0,9,0,brick);for(let i=-3;i<=3;i++){box(g,8,4,.2,i*11,8,-13.1,glass);box(g,8,4,.2,i*11,14,-13.1,glass);}for(let i=0;i<3;i++){cylinder(g,2,3.5,52+i*7,-35+i*30,26+i*3.5,28,brick);cylinder(g,2.7,2.7,2,-35+i*30,52+i*7,28,stone);}}
 else {box(g,65,17,25,0,8.5,0,city.id==='krakow'?stone:brick);box(g,60,12,18,0,21,0,roof);for(const x of [-34,34]){box(g,12,35,12,x,17.5,0,brick);cylinder(g,0,10,15,x,42,0,roof,4);}if(city.id==='krakow'){box(g,13,50,13,12,25,15,stone);cylinder(g,0,9,18,12,59,15,roof,6);}else{cylinder(g,7,8,28,55,14,50,brick);cylinder(g,0,10,12,55,34,50,roof,8);cylinder(g,.8,1,17,-55,8.5,45,stone);cylinder(g,2,2,3,-55,18.5,45,stone);}}
 const plaque=label(city.id==='krakow'?'WAWEL':city.id==='lodz'?'MANUFAKTURA':city.id==='raciborz'?'RACIBÓRZ · ZAMEK':'WARSZAWA',50,5);plaque.position.set(0,3,-20);plaque.rotation.y=Math.PI;g.add(plaque);cityGroup.add(g);}
 function loadCity(config){city=config;scene.remove(cityGroup);cityGroup.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])if(m!==asphalt){m.map?.dispose();m.dispose();}}});cityGroup=new T.Group();scene.add(cityGroup);scene.background=new T.Color(city.sky);scene.fog=new T.Fog(city.sky,210,800);sun.color.setHex(city.sun);
 curve=new T.CatmullRomCurve3(city.points.map(p=>new T.Vector3(...p)),true,'catmullrom',.35);length=curve.getLength();
 box(cityGroup,2200,1,2200,-150,-1,50,mat(city.ground));
 if(city.id==='krakow'||city.id==='raciborz'){const rp=curve.getPointAt(city.ramp),rt=curve.getTangentAt(city.ramp);const river=box(cityGroup,1100,.15,55,rp.x,-.25,rp.z,mat(0x52848c,.5,.26));river.rotation.y=Math.atan2(rt.x,rt.z);}
 ribbon(21,.02,mat(0xbcb9a8));ribbon(18,.08,asphalt);
 const white=mat(0xefeee0),red=mat(0xb74d39),rail=mat(0xc5cdcd,.65,.3),green=new T.MeshStandardMaterial({color:0xc8ff60,emissive:0x6b941d,emissiveIntensity:.5});
 for(let i=0;i<350;i++){const t=i/350,p=curve.getPointAt(t),tan=curve.getTangentAt(t),right=new T.Vector3(tan.z,0,-tan.x),angle=Math.atan2(tan.x,tan.z);for(const side of [-1,1]){const v=p.clone().addScaledVector(right,side*9.5),b=box(cityGroup,.55,.25,length/350+.1,v.x,v.y+.2,v.z,i%2?red:white);b.rotation.y=angle;if(i%3===0){const r=box(cityGroup,.18,.7,length/350*3,v.x+right.x*side*.6,v.y+.8,v.z+right.z*side*.6,rail);r.rotation.y=angle;}}if(i%3===0){const mark=box(cityGroup,.16,.015,2,p.x,p.y+.105,p.z,white);mark.rotation.y=angle;}}
 for(const t of city.boost){for(let i=0;i<7;i++){const p=curve.getPointAt(t+i*.0035),tan=curve.getTangentAt(t+i*.0035),b=box(cityGroup,12,.03,1,p.x,p.y+.14,p.z,green);b.rotation.y=Math.atan2(tan.x,tan.z);}}
 const rampT=city.ramp,p=curve.getPointAt(rampT),tan=curve.getTangentAt(rampT);const ramp=new T.Group();ramp.position.copy(p);ramp.rotation.y=Math.atan2(tan.x,tan.z);const r=box(ramp,17,.15,14,0,.6,-5,mat(0x7e938d,.2,.55));r.rotation.x=-.09;cityGroup.add(ramp);
 gate(.005,'POLISH RUSH / START',0xd0ff70);for(let i=1;i<=4;i++)gate(i*.2,'BRAMKA 0'+i,0x60dfd0);
 let seed=42;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 const windows=mat(city.id==='warszawa'?0xb4d6dd:0x4c6974,.3,.35),trunk=mat(0x66533d),leaves=mat(0x3e664a);
 for(let i=0;i<160;i++){const t=rand(),p=curve.getPointAt(t),tan=curve.getTangentAt(t),side=i%2?1:-1,offset=24+rand()*46,x=p.x+tan.z*side*offset,z=p.z-tan.x*side*offset;if(i%3===0){cylinder(cityGroup,.4,.6,5,x,2.5,z,trunk,6);const tree=new T.Mesh(new T.IcosahedronGeometry(4+rand()*2,1),leaves);tree.position.set(x,7,z);tree.castShadow=true;cityGroup.add(tree);continue;}const h=city.id==='warszawa'?15+rand()*65:8+rand()*14,w=8+rand()*10,d=8+rand()*10,g=new T.Group();g.position.set(x,0,z);g.rotation.y=Math.atan2(tan.x,tan.z);const wall=mat(city.buildings[i%3]);box(g,w,h,d,0,h/2,0,wall);box(g,w+.4,.5,d+.4,0,h+.25,0,mat(0x4e5859));for(let floor=3;floor<h-1;floor+=4)for(let col=-w/2+2;col<w/2-1;col+=3){box(g,1.25,1.8,.08,col,floor,-d/2-.05,windows);box(g,1.25,1.8,.08,col,floor,d/2+.05,windows);}cityGroup.add(g);}
 landmark();batchCity();return {curve,length};}
 function batchCity(){
 cityGroup.updateMatrixWorld(true);const batches=new Map();
 cityGroup.traverse(o=>{if(!o.isMesh)return;const m=o.material,key=[m.type,m.color?.getHex(),m.metalness,m.roughness,m.emissive?.getHex(),m.emissiveIntensity,m.map?.uuid,m.side].join(':');let b=batches.get(key);if(!b){b={material:m,p:[],n:[],uv:[],idx:[],count:0};batches.set(key,b);}const g=o.geometry.clone().applyMatrix4(o.matrixWorld),p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv;for(let i=0;i<p.count;i++){b.p.push(p.getX(i),p.getY(i),p.getZ(i));b.n.push(n.getX(i),n.getY(i),n.getZ(i));b.uv.push(uv?uv.getX(i):0,uv?uv.getY(i):0);}if(g.index)for(let i=0;i<g.index.count;i++)b.idx.push(g.index.getX(i)+b.count);else for(let i=0;i<p.count;i++)b.idx.push(i+b.count);b.count+=p.count;g.dispose();o.geometry.dispose();});
 cityGroup.clear();for(const b of batches.values()){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));g.setAttribute('uv',new T.Float32BufferAttribute(b.uv,2));g.setIndex(b.idx);g.computeBoundingSphere();const mesh=new T.Mesh(g,b.material);mesh.castShadow=true;mesh.receiveShadow=true;cityGroup.add(mesh);}
 }
 // The chase view uses a photographic cutout. Its footprint stays in world space
 // so the track, jumps and camera distance determine its apparent size.
 const textures = new Map();
 const loader = new T.TextureLoader();
 const shadowCanvas = document.createElement('canvas');
 shadowCanvas.width = shadowCanvas.height = 64;
 const shadowContext = shadowCanvas.getContext('2d');
 const gradient = shadowContext.createRadialGradient(32,32,5,32,32,32);
 gradient.addColorStop(0,'rgba(0,0,0,.8)');
 gradient.addColorStop(.65,'rgba(0,0,0,.55)');
 gradient.addColorStop(1,'rgba(0,0,0,0)');
 shadowContext.fillStyle=gradient;
 shadowContext.fillRect(0,0,64,64);
 const shadow = new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({
   map:new T.CanvasTexture(shadowCanvas), transparent:true, depthWrite:false
 }));
 shadow.rotation.x=-Math.PI/2;
 scene.add(shadow);
 function loadCar(config, imageUrl) {
   if (carGroup) {
     scene.remove(carGroup);
     carGroup.material.dispose();
   }
   if (!textures.has(config.id)) {
     const texture = loader.load(imageUrl);
     texture.colorSpace = T.SRGBColorSpace;
     textures.set(config.id,texture);
   }
   const texture = textures.get(config.id);
   carGroup = new T.Sprite(new T.SpriteMaterial({
     map:texture, transparent:true, depthWrite:false, toneMapped:false, fog:false
   }));
   carGroup.center.set(.5,0);
   carGroup.userData.width=config.width*1.23;
   carGroup.scale.set(config.width*1.23,config.height,1);
   shadow.scale.set(config.width*1.6,config.length*1.18,1);
   scene.add(carGroup);
 }
 function positionAt(distance,lateral=0,height=0){const t=((distance/length)%1+1)%1,p=curve.getPointAt(t),tan=curve.getTangentAt(t);p.add(new T.Vector3(tan.z,0,-tan.x).multiplyScalar(-lateral));p.y+=height+.15;return {p,tan};}
 function draw(state,mode,elapsed){if(!carGroup||!curve)return;const {p,tan}=positionAt(mode==='menu'?length*.035:state.distance,state.lateral,state.height);carGroup.position.copy(p);
 const inGarage = mode === 'menu';
 carGroup.visible = shadow.visible = !inGarage;
 const image = carGroup.material.map.image;
 if (image?.width) carGroup.scale.y = carGroup.userData.width * image.height / image.width;
 carGroup.material.rotation = T.MathUtils.clamp(-state.lateralSpeed*.014,-.11,.11);
 shadow.position.set(p.x,p.y-state.height+.02,p.z);
 shadow.rotation.z=-Math.atan2(tan.x,tan.z);
 shadow.material.opacity=Math.max(.18,1-state.height*.13);
 let desired,look;
 if(inGarage){
   desired=p.clone().add(new T.Vector3(12,5,-13));
   look=p.clone().addScaledVector(tan,25);
 }else{
   desired=p.clone().addScaledVector(tan,-6.5-state.speed*.018).add(new T.Vector3(0,3.15,0));
   desired.y-=state.height*.55;
   look=p.clone().addScaledVector(tan,12).add(new T.Vector3(0,1.25,0));
 }
 if(camera.position.distanceTo(desired)>22)camera.position.copy(desired);
 camera.position.lerp(desired,mode==='menu'?.04:.12);camera.lookAt(look);camera.fov=T.MathUtils.lerp(camera.fov,state.boosting?67:55,.04);camera.updateProjectionMatrix();sun.position.copy(p).add(new T.Vector3(65,100,-55));sun.target.position.copy(p);renderer.render(scene,camera);}
 function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}addEventListener('resize',resize);resize();
 return {loadCity,loadCar,draw,positionAt,get renderer(){return renderer;}};
}

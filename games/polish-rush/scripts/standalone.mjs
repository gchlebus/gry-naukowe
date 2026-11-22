import { readFile, writeFile } from 'node:fs/promises';
import { CARS } from '../src/game.mjs';

const root = new URL('../', import.meta.url);
const read = (path, encoding) => readFile(new URL(path, root), encoding);
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');

let html = await read('index.html', 'utf8');
const assets = {};
for (const car of CARS) {
  for (const view of ['garage', 'chase']) {
    const name = car.id + '-' + view + '.webp';
    assets[name] = 'data:image/webp;base64,' + (await read('src/cars/' + name)).toString('base64');
  }
}

const corePath = './three.core.min.js';
const three = await read('src/vendor/three/three.module.min.js', 'utf8');
const modules = {
  'rush-three-core': moduleUrl(await read('src/vendor/three/three.core.min.js', 'utf8')),
  three: moduleUrl(three.replaceAll(corePath, 'rush-three-core')),
  'rush-game': moduleUrl(await read('src/game.mjs', 'utf8')),
  'rush-scene': moduleUrl(await read('src/scene.js', 'utf8'))
};
const script = (await read('src/main.js', 'utf8'))
  .replace("'./game.mjs'", "'rush-game'")
  .replace("'./scene.js'", "'rush-scene'");
html = html.replace(/(<script type="importmap">)(.*?)(<\/script>)/, (_, open, json, close) => {
  const map = JSON.parse(json);
  Object.assign(map.imports, modules);
  return open + JSON.stringify(map) + close;
});
const css = await read('src/style.css', 'utf8');
const license = await read('src/vendor/three/LICENSE', 'utf8');
const music = await read('public/audio/four-cities.mp3');
html = html
  .replace('<link rel="stylesheet" href="./src/style.css">', () => '<style>' + css + '</style>')
  .replace('src="./audio/four-cities.mp3"', () => 'src="data:audio/mpeg;base64,' + music.toString('base64') + '"')
  .replace('<script type="module" src="./src/main.js"></script>', () =>
    '<script type="text/plain" id="three-license">' + license + '</script>\n' +
    '<script type="application/json" id="car-assets">' + JSON.stringify(assets) + '</script>\n' +
    '<script type="module">' + script + '</script>');
await writeFile(new URL('play.html', root), html);
console.log('Standalone play.html ready');

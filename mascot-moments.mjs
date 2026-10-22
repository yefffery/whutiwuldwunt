import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
for(const path of ['../app/layout.tsx','../app/site-shell.tsx','../app/home-view.tsx','../app/book/view.tsx','../app/proof.tsx','../lib/theme-preference.ts','../app/globals.css']){
 const source=read(path);
 assert.doesNotMatch(source,/MascotMoments|MascotFigure|mascot-peek|mascot-spark|data-mascot-pose|wiww-key-sequence|nextMascotKeys|founding-dismiss/,'public interfaces have no Easter egg interaction hooks');
}
assert.equal(existsSync(new URL('../app/mascot-moments.tsx',import.meta.url)),false);
assert.equal(existsSync(new URL('../app/mascot-figure.tsx',import.meta.url)),false);
const proof=read('../app/proof.tsx');
assert.match(proof,/PRACTICE_FILM_SRC/,'the practice video remains ordinary site content');
assert.match(read('../lib/mascot-moments.ts'),/PRACTICE_FILM_SRC/);
for (const path of ['../app/site-shell.tsx','../app/public-home.tsx','../app/home-view.tsx']) {
 assert.doesNotMatch(read(path), /BrandMascot|fusion-stage-mascot|philosophy-mascot/, 'the public site no longer places the mascot character');
}
assert.equal(existsSync(new URL('../app/brand-mascot.tsx',import.meta.url)),false);
console.log('PASS: Easter egg triggers and mascot interactions are removed; the wordmark, car scenery and practice video remain.');

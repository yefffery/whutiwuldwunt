import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { careInterests, formatCareInterestNote } from '../lib/care-interests.ts';

assert.equal(careInterests.length, 10, 'all approved discussion-only interests are present');
assert.deepEqual(
  careInterests.map(({ id }) => id),
  [
    'engine-bay',
    'trim-tire-dressing',
    'cured_ceramic_coating',
    'clay-preparation',
    'wax',
    'stain-removal',
    'excess-pet-hair',
    'odor-treatment',
    'headlight-restoration',
    'glass-ceramic',
  ],
);

const empty = formatCareInterestNote([]);
assert.equal(empty, '');

const note = formatCareInterestNote(['cured_ceramic_coating', 'clay-preparation', 'cured_ceramic_coating']);
assert.match(note, /Optional work to discuss only/);
assert.match(note, /not added or approved/);
assert.match(note, /Cured Ceramic Coating/);
assert.match(note, /Confirm scope and price in the Care Plan before any work/);
assert.equal(note.includes('$'), false, 'interests carry no price');
assert.equal(formatCareInterestNote(['__proto__', 'not-an-interest']).includes('undefined'), false);

assert.match(careInterests.find(({ id }) => id === 'engine-bay').description, /cool/);
assert.match(careInterests.find(({ id }) => id === 'cured_ceramic_coating').description, /36–48 months/);
assert.match(careInterests.find(({ id }) => id === 'glass-ceramic').description, /Glass only/);
assert.equal(careInterests.find(({ id }) => id === 'clay-preparation').description, 'For a wash that does not already include it. Included with exterior ceramic and wax.');
assert.match(careInterests.find(({ id }) => id === 'excess-pet-hair').description, /light amount included/);
assert.equal(careInterests.find(({ id }) => id === 'odor-treatment').description, 'We discuss the source and what may be reduced before agreeing on a method.');
assert.doesNotMatch(careInterests.find(({ id }) => id === 'odor-treatment').description, /complete sanitization|guaranteed/i);

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const offer = read('../app/founding-member-access.tsx');
const request = read('../app/request-form.tsx');
const booking = read('../app/book/view.tsx');
assert.match(offer, /wiww-prefill-care-request[\s\S]*name,phone,city,vehicle,intent/);
assert.match(offer, /onContinue\(interest\)/);
assert.match(offer, /Your details are added only when you submit the full care request/);
assert.doesNotMatch(offer, /It is used to respond to this request/);
assert.match(request, /key==='intent'\?'careIntent':key/);
assert.match(request, /name="phone"[^>]*required/);
assert.match(booking, /selectionFromFoundingInterest\(interest\)/);
assert.match(booking, /goStep\(3\)/);
assert.match(request, /Your first-visit offer is attached to this request/);
assert.match(request, /Offers do not stack\./);

console.log('PASS: approved care interests are discussion-only, price-free, deduplicated, and limited to the approved catalog.');

import assert from 'node:assert/strict';
import { defaultContent, contentSchema } from '../lib/site-content.ts';
import { CMS_VARIABLE_ALLOWLIST, MAX_CENTS_LIMIT } from '../lib/site-content-vars.ts';
import { isAllowlistedVariableId, validateVariableMutation, applyVariableMutation,
  parseUiStringToCents, extractValueByPath } from '../lib/cms-variable-bridge.ts';

let groups = 0;
function check(name, test) { test(); groups++; console.log(`PASS ${name}`); }
const priceId = 'business.services.exterior.prices.sedan';

check('Unknown and inherited IDs fail reads, validation, and direct mutation', () => {
  for (const id of ['toString', 'constructor', '__proto__', 'prototype', '', null, {},
    'business.services.secretDatabaseKey', 'business.services.exterior.prices.unknown']) {
    assert.equal(isAllowlistedVariableId(id), false);
    assert.throws(() => validateVariableMutation(id, 500), /Unauthorized/);
    assert.throws(() => extractValueByPath(defaultContent, id), /Unauthorized/);
    assert.throws(() => applyVariableMutation(defaultContent, id, 500), /Unauthorized/);
  }
});

check('Protection pricing and quote-only mode are excluded', () => {
  for (const field of ['prices.sedan', 'prices.compact-suv', 'prices.full-size', 'quote']) {
    assert.throws(() => applyVariableMutation(defaultContent, `business.services.protection.${field}`, 0), /Unauthorized/);
  }
});

check('Currency accepts exact cents, whole dollars, optional dollar sign, and boundaries', () => {
  for (const [input, expected] of [['110.00', 11000], ['$82.50', 8250], ['150', 15000],
    ['  $0.01  ', 1], ['0', 0], ['0.29', 29], ['9999.99', 999999], ['10000.00', 1000000]]) {
    assert.equal(parseUiStringToCents(input), expected);
  }
});

check('Currency rejects malformed and over-limit inputs', () => {
  for (const input of ['', '$', '-12.00', '$12.345', '1.2.3', 'abc', '12.', '12.5', '12$',
    '12.00$junk', '1e2', 'NaN', 'Infinity', '$$12', '1,250.75', '12\n.00', '10000.01',
    '99999999999999999999999999999', null, 110]) {
    assert.throws(() => parseUiStringToCents(input), /Malformed|exceeds/);
  }
});

check('Raw cents enforce integer type, finite values, and shared schema limits', () => {
  for (const value of [true, '8250', null, undefined, NaN, Infinity, -Infinity, -1, 1.5, MAX_CENTS_LIMIT + 1]) {
    assert.throws(() => validateVariableMutation(priceId, value), /boundaries/);
    assert.throws(() => applyVariableMutation(defaultContent, priceId, value), /boundaries/);
  }
  for (const value of [0, MAX_CENTS_LIMIT]) {
    const result = applyVariableMutation(defaultContent, priceId, value);
    assert.equal(extractValueByPath(result, priceId), value);
    assert.equal(contentSchema.safeParse(result).success, true);
  }
  const overLimit = structuredClone(defaultContent);
  overLimit.business.package.prices.sedan = MAX_CENTS_LIMIT + 1;
  assert.equal(contentSchema.safeParse(overLimit).success, false);
});

check('All bindings target stable IDs and preserve the full source document', () => {
  for (const [id, rule] of Object.entries(CMS_VARIABLE_ALLOWLIST)) {
    const source = structuredClone(defaultContent);
    source.business.services.reverse();
    const before = structuredClone(source);
    const nextValue = rule.type === 'cents' ? 12345 : !extractValueByPath(source, id);
    const expected = structuredClone(source);
    const parts = id.split('.');
    if (parts[1] === 'package') expected.business.package.prices[parts[3]] = nextValue;
    else {
      const service = expected.business.services.find(s => s.id === parts[2]);
      if (parts[3] === 'prices') service.prices[parts[4]] = nextValue;
      else service[parts[3]] = nextValue;
    }
    const result = applyVariableMutation(source, id, nextValue);
    assert.equal(extractValueByPath(result, id), nextValue);
    assert.deepEqual(result, contentSchema.parse(expected));
    assert.deepEqual(source, before);
    result.business.package.name = 'Changed only in returned draft';
    assert.deepEqual(source, before);
  }
});

check('Boolean fields reject coercion and accept both toggle states', () => {
  const id = 'business.services.exterior.visible';
  for (const value of [0, 1, 'false', null, undefined]) {
    assert.throws(() => applyVariableMutation(defaultContent, id, value), /Type mismatch/);
  }
  for (const value of [true, false]) {
    assert.equal(extractValueByPath(applyVariableMutation(defaultContent, id, value), id), value);
  }
});

check('Missing or ambiguous services and invalid final schema fail without mutations', () => {
  for (const scenario of ['missing', 'duplicate', 'schema']) {
    const source = structuredClone(defaultContent);
    if (scenario === 'missing') source.business.services = source.business.services.filter(s => s.id !== 'exterior');
    if (scenario === 'duplicate') source.business.services.push(structuredClone(source.business.services[0]));
    if (scenario === 'schema') source.sections = [];
    const before = structuredClone(source);
    assert.throws(() => applyVariableMutation(source, priceId, 11000), /exactly one|schema integrity/);
    assert.deepEqual(source, before);
  }
});

console.log(`CMS variable helper: ${groups} groups passed. Browser messaging and D1 saves are outside this suite.`);

const {readVariableEditRequest}=await import('../lib/cms-variable-message.ts');
check('Message requests require edit mode, exact frame and origin, and an allowlisted own ID',()=>{
 const frame={},origin='https://wiww.test';
 const event={origin,source:frame,data:{type:'VARIABLE_EDIT_REQUEST',id:priceId}};
 assert.equal(readVariableEditRequest(event,origin,frame,true),priceId);
 for(const candidate of [{...event,origin:'https://other.test'},{...event,source:{}},
  ...[null,[],{},'bad',{type:'VARIABLE_EDIT_REQUEST',id:'__proto__'},Object.create(event.data)].map(data=>({...event,data}))]){
  assert.equal(readVariableEditRequest(candidate,origin,frame,true),null);
 }
 assert.equal(readVariableEditRequest(event,origin,frame,false),null);
 assert.equal(readVariableEditRequest({...event,source:null},origin,null,true),null);
});
const React=await import('react');
const {renderToStaticMarkup}=await import('react-dom/server');
const {SiteTextProvider}=await import('../app/site-text.tsx');
const {VariableWrapper}=await import('../app/manage/preview/variable-wrapper.tsx');
check('Public and customer-preview markup have no variable editing affordances',()=>{
 for(const [preview,editing] of [[false,false],[true,false],[false,true],[true,true]]){
  const markup=renderToStaticMarkup(React.createElement(SiteTextProvider,{content:defaultContent,preview,onEdit:editing?()=>{}:undefined},React.createElement(VariableWrapper,{id:priceId,displayValue:'$82.50'})));
  {
   assert.match(markup,/\$82\.50/);
   assert.doesNotMatch(markup,/data-variable-id|class="cms-variable-marker"|tabindex="0"/);
  }
 }
});
console.log(`CMS helpers and bridge: ${groups} groups passed; DOM interaction remains a browser gate.`);

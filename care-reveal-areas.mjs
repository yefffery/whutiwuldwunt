import assert from 'node:assert/strict';
import { careRevealAreas } from '../lib/care-reveal-areas.ts';

assert.deepEqual(careRevealAreas('exterior'), { exterior: true, interior: false });
assert.deepEqual(careRevealAreas('interior'), { exterior: false, interior: true });
assert.deepEqual(careRevealAreas('full'), { exterior: true, interior: true });

console.log('PASS: Care Reveal highlights only the service areas selected by the customer.');

/**
 * Usage examples and validation for greeting helper utilities
 * This file demonstrates the expected behavior of helper functions
 */

import { normalizeViews, formatTimeAgo, getEventGradient } from './greetingHelpers';

// ============= normalizeViews() Examples =============

// ✅ Number input
console.assert(normalizeViews(42) === 42, 'normalizeViews(42) should return 42');
console.assert(normalizeViews(0) === 0, 'normalizeViews(0) should return 0');

// ✅ String numeric input
console.assert(normalizeViews("12") === 12, 'normalizeViews("12") should return 12');
console.assert(normalizeViews("999") === 999, 'normalizeViews("999") should return 999');

// ✅ Object with count property
console.assert(normalizeViews({ count: 3 }) === 3, 'normalizeViews({ count: 3 }) should return 3');
console.assert(normalizeViews({ count: 150 }) === 150, 'normalizeViews({ count: 150 }) should return 150');

// ✅ Invalid inputs fallback to 0
console.assert(normalizeViews(null) === 0, 'normalizeViews(null) should return 0');
console.assert(normalizeViews(undefined) === 0, 'normalizeViews(undefined) should return 0');
console.assert(normalizeViews("abc") === 0, 'normalizeViews("abc") should return 0');
console.assert(normalizeViews({}) === 0, 'normalizeViews({}) should return 0');

// ✅ Nested count objects
console.assert(normalizeViews({ count: "25" }) === 25, 'normalizeViews({ count: "25" }) should return 25');

console.log('✅ All normalizeViews() validations passed!');

// ============= formatTimeAgo() Examples =============

// Example outputs (actual values depend on current time)
const now = Date.now();
const fiveMinAgo = { seconds: Math.floor((now - 5 * 60 * 1000) / 1000) };
const twoHoursAgo = { seconds: Math.floor((now - 2 * 60 * 60 * 1000) / 1000) };
const threeDaysAgo = { seconds: Math.floor((now - 3 * 24 * 60 * 60 * 1000) / 1000) };

console.log('formatTimeAgo examples:');
console.log('  Just now:', formatTimeAgo({ seconds: Math.floor(now / 1000) }));
console.log('  5 minutes ago:', formatTimeAgo(fiveMinAgo));
console.log('  2 hours ago:', formatTimeAgo(twoHoursAgo));
console.log('  3 days ago:', formatTimeAgo(threeDaysAgo));
console.log('  Invalid:', formatTimeAgo(null));

// ============= getEventGradient() Examples =============

console.log('\ngetEventGradient examples:');
console.log('  Birthday:', getEventGradient('Birthday'));
console.log('  Anniversary:', getEventGradient('Anniversary'));
console.log('  Graduation:', getEventGradient('Graduation'));

// Consistency check
const gradient1 = getEventGradient('Birthday');
const gradient2 = getEventGradient('Birthday');
console.assert(gradient1 === gradient2, 'Same event should return same gradient');

console.log('\n✅ All greeting helper examples completed!');

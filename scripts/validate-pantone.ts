/**
 * Pantone Color Validation Script
 *
 * Usage: npx tsx scripts/validate-pantone.ts
 *        npx tsx scripts/validate-pantone.ts --check 485C 2377C 4109C
 *
 * Validates:
 * - No duplicate keys
 * - All hex values are valid (#XXXXXX format)
 * - All entries have name and family
 * - 100-699 range completeness
 * - Checks specific colors if --check flag is used
 */

import { PANTONE_MAP, getPantoneColor } from '../src/features/color/data/pantone-map'

const entries = Object.entries(PANTONE_MAP)
const keys = Object.keys(PANTONE_MAP)
let errors = 0
let warnings = 0

console.log('=== Pantone Color Validation ===\n')
console.log(`Total colors: ${entries.length}`)

// Check for --check flag
const checkIdx = process.argv.indexOf('--check')
if (checkIdx !== -1) {
  const codes = process.argv.slice(checkIdx + 1)
  console.log(`\n--- Checking ${codes.length} color(s) ---`)
  for (const code of codes) {
    const color = getPantoneColor(code)
    if (color) {
      console.log(`  ✓ ${code.padEnd(14)} → ${color.hex} ${color.name} [${color.family}]`)
    } else {
      console.log(`  ✗ ${code.padEnd(14)} → MISSING`)
      errors++
    }
  }
  if (errors > 0) {
    console.log(`\n❌ ${errors} color(s) missing`)
    process.exit(1)
  }
  console.log(`\n✅ All ${codes.length} color(s) found`)
  process.exit(0)
}

// 1. Duplicate check
console.log('\n--- Duplicate Check ---')
const seen = new Set<string>()
const dupes: string[] = []
for (const key of keys) {
  if (seen.has(key)) dupes.push(key)
  seen.add(key)
}
if (dupes.length) {
  console.log(`  ✗ ${dupes.length} duplicates: ${dupes.join(', ')}`)
  errors += dupes.length
} else {
  console.log('  ✓ No duplicates')
}

// 2. Hex validation
console.log('\n--- Hex Validation ---')
const hexRegex = /^#[0-9A-Fa-f]{6}$/
const badHex: string[] = []
for (const [key, entry] of entries) {
  if (!hexRegex.test(entry.hex)) badHex.push(`${key}: ${entry.hex}`)
}
if (badHex.length) {
  console.log(`  ✗ ${badHex.length} invalid hex:`)
  badHex.forEach(h => console.log(`    ${h}`))
  errors += badHex.length
} else {
  console.log('  ✓ All hex values valid')
}

// 3. Name + family validation
console.log('\n--- Name & Family Validation ---')
const badEntries: string[] = []
const validFamilies = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'neutral', 'brown', 'pink', 'teal']
for (const [key, entry] of entries) {
  if (!entry.name) badEntries.push(`${key}: missing name`)
  if (!validFamilies.includes(entry.family)) badEntries.push(`${key}: invalid family "${entry.family}"`)
}
if (badEntries.length) {
  console.log(`  ✗ ${badEntries.length} issues:`)
  badEntries.forEach(e => console.log(`    ${e}`))
  errors += badEntries.length
} else {
  console.log('  ✓ All names and families valid')
}

// 4. Range completeness (100-699)
console.log('\n--- Range Completeness (100-699) ---')
const numericKeys = new Set(
  keys.filter(k => /^\d+C$/.test(k)).map(k => parseInt(k))
)
const missingStandard: number[] = []
for (let i = 100; i <= 699; i++) {
  if (!numericKeys.has(i)) missingStandard.push(i)
}
if (missingStandard.length) {
  console.log(`  ✗ ${missingStandard.length} missing: ${missingStandard.join(', ')}`)
  warnings += missingStandard.length
} else {
  console.log('  ✓ 100-699 COMPLETE (600/600)')
}

// 5. Series breakdown
console.log('\n--- Series Breakdown ---')
const series: Record<string, number> = {}
for (const key of keys) {
  const match = key.match(/^(\d+)C$/)
  if (match) {
    const n = parseInt(match[1])
    let s: string
    if (n < 100) s = '0xx'
    else if (n < 200) s = '1xx'
    else if (n < 300) s = '2xx'
    else if (n < 400) s = '3xx'
    else if (n < 500) s = '4xx'
    else if (n < 600) s = '5xx'
    else if (n < 700) s = '6xx'
    else if (n < 800) s = '7xx'
    else if (n < 900) s = '8xx'
    else if (n < 2000) s = '1xxx'
    else if (n < 3000) s = '2xxx'
    else if (n < 4000) s = '3xxx'
    else if (n < 5000) s = '4xxx'
    else s = '7xxx'
    series[s] = (series[s] || 0) + 1
  } else {
    series['Named'] = (series['Named'] || 0) + 1
  }
}
const order = ['0xx', '1xx', '2xx', '3xx', '4xx', '5xx', '6xx', '7xx', '8xx', '1xxx', '2xxx', '3xxx', '4xxx', '7xxx', 'Named']
for (const s of order) {
  if (series[s]) console.log(`  ${s.padEnd(8)} ${series[s]}`)
}

// Summary
console.log('\n=== Summary ===')
console.log(`Total: ${entries.length} colors`)
if (errors) console.log(`❌ ${errors} error(s)`)
if (warnings) console.log(`⚠️  ${warnings} warning(s)`)
if (!errors && !warnings) console.log('✅ All validations passed')
process.exit(errors > 0 ? 1 : 0)

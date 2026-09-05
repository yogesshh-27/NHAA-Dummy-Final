// One-shot helper: exports the TypeScript safety dataset as JSON so the
// Python trainer (backend/saathi_model/train_safety_model.py) can load it
// without needing a TS-aware Python runtime.
//
// Usage:
//   node backend/saathi_model/export_dataset_json.cjs

const path = require('path')
const fs = require('fs')

// Use tsx to load the TS file at runtime.
require('tsx/cjs/api').register()

const { SAFETY_TRAINING_DATA } = require(path.resolve(__dirname, 'dataset.ts'))

const out = path.resolve(__dirname, 'dataset.json')
fs.writeFileSync(out, JSON.stringify(SAFETY_TRAINING_DATA, null, 2), 'utf8')
console.log(`[saathi-safety] Wrote ${SAFETY_TRAINING_DATA.length} examples -> ${out}`)

/*
  Removes unused template view folders while preserving atoms-only runtime
  Keeps: src/views/pages/miscellaneous/{Error.vue, NotAuthorized.vue}
*/

const fs = require('fs')
const path = require('path')

function exists(p) {
  try { fs.accessSync(p); return true } catch { return false }
}

function rmrf(p) {
  try { fs.rmSync(p, { recursive: true, force: true }) } catch (e) { /* ignore */ }
}

function mkdirp(p) {
  fs.mkdirSync(p, { recursive: true })
}

function main() {
  const projectRoot = process.cwd()
  const keepFiles = [
    path.join(projectRoot, 'src/views/pages/miscellaneous/Error.vue'),
    path.join(projectRoot, 'src/views/pages/miscellaneous/NotAuthorized.vue'),
  ]

  const tmpDir = path.join(projectRoot, 'src/.tmp-keep-misc')
  mkdirp(tmpDir)
  // Preserve files if they exist
  for (const f of keepFiles) {
    if (exists(f)) {
      fs.copyFileSync(f, path.join(tmpDir, path.basename(f)))
    }
  }

  const toDeleteDirs = [
    'src/views/apps',
    'src/views/components',
    'src/views/charts-and-maps',
    'src/views/extensions',
    'src/views/forms',
    'src/views/table',
  ]

  for (const d of toDeleteDirs) {
    rmrf(path.join(projectRoot, d))
  }

  // Reset pages to only the misc pages we preserved
  const pagesDir = path.join(projectRoot, 'src/views/pages')
  rmrf(pagesDir)
  mkdirp(path.join(pagesDir, 'miscellaneous'))

  const restored = []
  for (const f of ['Error.vue', 'NotAuthorized.vue']) {
    const src = path.join(tmpDir, f)
    if (exists(src)) {
      const dest = path.join(pagesDir, 'miscellaneous', f)
      fs.copyFileSync(src, dest)
      restored.push(dest)
    }
  }

  rmrf(tmpDir)

  // Log summary
  console.log('Removed folders:')
  for (const d of toDeleteDirs) console.log(' -', d)
  console.log('Reset folder:  - src/views/pages (kept miscellaneous files)')
  if (restored.length) {
    console.log('Restored:')
    for (const f of restored) console.log(' -', path.relative(projectRoot, f))
  }
}

main()


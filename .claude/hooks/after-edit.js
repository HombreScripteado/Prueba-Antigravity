/**
 * Hook: after-edit
 * Se ejecuta después de que Claude Code edita un archivo
 *
 * Automáticamente sincroniza cambios al Brain
 */

const { execSync } = require('child_process');
const path = require('path');

async function afterEdit(context) {
  const { file, changes } = context;

  console.log(`📝 Archivo editado: ${file}`);
  console.log(`   Cambios: ${changes.length} líneas`);

  // Sincronizar al Brain
  try {
    const syncScript = path.join(process.cwd(), '.claude-flow/sync/sync-to-brain.js');
    execSync(`node "${syncScript}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`⚠️ Error en sincronización:`, e.message);
  }
}

module.exports = { afterEdit };

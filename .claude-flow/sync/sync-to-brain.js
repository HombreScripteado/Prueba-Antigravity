#!/usr/bin/env node
/**
 * Sincronizador automático: Git changes → Brain (Obsidian)
 *
 * Monitorea cambios en el repo y automáticamente:
 * 1. Crea notas en brain/cambios/
 * 2. Indexa en memoria de Ruflo
 * 3. Actualiza grafo de conexiones
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BRAIN_DIR = path.join(process.cwd(), 'brain');
const CHANGES_DIR = path.join(BRAIN_DIR, 'cambios');
const PROJECT_ROOT = process.cwd();

// Asegurar que existen los directorios
if (!fs.existsSync(CHANGES_DIR)) {
  fs.mkdirSync(CHANGES_DIR, { recursive: true });
}

/**
 * Obtener último cambio de git
 */
function getLastCommit() {
  try {
    const output = execSync('git log -1 --pretty=format:"%H|%an|%ae|%ai|%s"', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const [hash, author, email, date, message] = output.split('|');
    return { hash: hash.slice(0, 8), author, email, date, message };
  } catch (e) {
    return null;
  }
}

/**
 * Obtener archivos modificados en último commit
 */
function getChangedFiles() {
  try {
    const output = execSync('git diff --name-only HEAD~1 HEAD', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return output.trim().split('\n').filter(f => f);
  } catch (e) {
    return [];
  }
}

/**
 * Crear nota de cambio en Obsidian
 */
function createChangeNote(commit, files) {
  if (!commit) return false;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `${timestamp}-${commit.hash}.md`;
  const filepath = path.join(CHANGES_DIR, filename);

  const filesList = files.map(f => `- \`${f}\``).join('\n');

  const content = `# Cambio: ${commit.message}

**Hash**: \`${commit.hash}\`
**Autor**: ${commit.author} <${commit.email}>
**Fecha**: ${commit.date}

## 📝 Descripción

${commit.message}

## 📂 Archivos modificados

${filesList}

## 🔗 Contexto

- Relacionado con: [[contexto|Contexto del proyecto]]
- Impacta a: (Será actualizado por agentes)

## ⚙️ Próximas acciones

- [ ] Revisar impacto en agentes
- [ ] Actualizar documentación si aplica
- [ ] Notificar a agentes relevantes

---

*Sincronizado automáticamente por Ruflo*
`;

  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`✅ Nota creada: ${filename}`);
  return filepath;
}

/**
 * Registrar en memoria de Ruflo
 */
function updateRufloMemory(changeNote) {
  try {
    const memoryDir = path.join(process.cwd(), '.claude-flow', 'memory');
    if (!fs.existsSync(memoryDir)) {
      fs.mkdirSync(memoryDir, { recursive: true });
    }

    const memoryFile = path.join(memoryDir, 'changes-index.json');
    let index = [];

    if (fs.existsSync(memoryFile)) {
      index = JSON.parse(fs.readFileSync(memoryFile, 'utf-8'));
    }

    index.push({
      timestamp: new Date().toISOString(),
      note: path.relative(process.cwd(), changeNote),
      synced: true
    });

    fs.writeFileSync(memoryFile, JSON.stringify(index, null, 2), 'utf-8');
    console.log(`✅ Memoria de Ruflo actualizada`);
  } catch (e) {
    console.error(`⚠️ Error actualizando memoria:`, e.message);
  }
}

/**
 * Ejecutar sincronización
 */
function sync() {
  console.log(`🔄 Sincronizando cambios al Brain...`);

  const commit = getLastCommit();
  if (!commit) {
    console.log('⏭️  No hay commits nuevos');
    return;
  }

  const files = getChangedFiles();
  const noteFile = createChangeNote(commit, files);

  if (noteFile) {
    updateRufloMemory(noteFile);
    console.log(`✅ Sincronización completa!`);
  }
}

// Ejecutar
if (require.main === module) {
  sync();
}

module.exports = { sync, getLastCommit, getChangedFiles, createChangeNote };

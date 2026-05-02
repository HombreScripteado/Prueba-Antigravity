#!/usr/bin/env node
/**
 * Health Check: Verifica que Ruflo + Obsidian funcione correctamente
 *
 * Comprueba:
 * - Brain sincronizado
 * - Archivos clave presentes
 * - Memoria indexada
 * - Agentes conectados
 * - Métricas de tokens
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = process.cwd();
const BRAIN_DIR = path.join(PROJECT_ROOT, 'brain');
const CLAUDE_FLOW_DIR = path.join(PROJECT_ROOT, '.claude-flow');
const METRICS_FILE = path.join(CLAUDE_FLOW_DIR, 'metrics', 'metrics.json');

class HealthCheck {
  constructor() {
    this.checks = [];
    this.results = {
      timestamp: new Date().toISOString(),
      healthy: true,
      checks: [],
      summary: {}
    };
  }

  log(status, message, details = null) {
    const check = { status, message, details, timestamp: new Date().toISOString() };
    this.checks.push(check);

    const icon = status === 'OK' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
    console.log(`${icon} ${message}`);
    if (details) console.log(`   ${details}`);
  }

  // 1. Verificar Brain
  checkBrain() {
    console.log('\n📂 Verificando Brain...');

    const requiredFiles = [
      'INDEX.md',
      'README.md',
      'procedimientos/PROTOCOLO_AGENTES.md',
      'procedimientos/RESTRICCIONES_MODULARIDAD.md',
      'agentes/AGENTES_DISPONIBLES.md',
      'contexto/CONTEXTO_GENERAL.md'
    ];

    let missingFiles = [];
    requiredFiles.forEach(file => {
      const filePath = path.join(BRAIN_DIR, file);
      if (fs.existsSync(filePath)) {
        this.log('OK', `Brain: ${file}`);
      } else {
        missingFiles.push(file);
        this.log('ERROR', `Brain: ${file} FALTA`, filePath);
        this.results.healthy = false;
      }
    });

    // Verificar carpetas
    const folders = ['agentes', 'cambios', 'contexto', 'decisiones', 'procedimientos', 'memoria'];
    folders.forEach(folder => {
      const folderPath = path.join(BRAIN_DIR, folder);
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath).length;
        this.log('OK', `Carpeta brain/${folder}`, `${files} archivos`);
      } else {
        this.log('WARN', `Carpeta brain/${folder}`, 'No existe');
      }
    });

    return missingFiles.length === 0;
  }

  // 2. Verificar Sincronización
  checkSync() {
    console.log('\n🔄 Verificando Sincronización...');

    const syncScript = path.join(CLAUDE_FLOW_DIR, 'sync', 'sync-to-brain.js');
    const brainConfig = path.join(CLAUDE_FLOW_DIR, 'brain-config.yaml');
    const hookFile = path.join(PROJECT_ROOT, '.claude', 'hooks', 'after-edit.js');

    const syncOk = fs.existsSync(syncScript);
    const configOk = fs.existsSync(brainConfig);
    const hookOk = fs.existsSync(hookFile);

    this.log(syncOk ? 'OK' : 'ERROR', 'Script de sincronización', syncOk ? syncScript : 'NO ENCONTRADO');
    this.log(configOk ? 'OK' : 'ERROR', 'Configuración Ruflo', configOk ? brainConfig : 'NO ENCONTRADA');
    this.log(hookOk ? 'OK' : 'ERROR', 'Hook automático', hookOk ? hookFile : 'NO ENCONTRADO');

    if (!syncOk || !configOk || !hookOk) {
      this.results.healthy = false;
    }

    return syncOk && configOk && hookOk;
  }

  // 3. Verificar Memoria
  checkMemory() {
    console.log('\n💾 Verificando Memoria de Ruflo...');

    const memoryDir = path.join(CLAUDE_FLOW_DIR, 'data');
    const memoryIndex = path.join(CLAUDE_FLOW_DIR, 'memory', 'changes-index.json');

    if (fs.existsSync(memoryDir)) {
      const files = fs.readdirSync(memoryDir).length;
      this.log('OK', 'Directorio de datos', `${files} archivos`);
    } else {
      this.log('WARN', 'Directorio de datos', 'No existe (normal en primera ejecución)');
    }

    if (fs.existsSync(memoryIndex)) {
      try {
        const index = JSON.parse(fs.readFileSync(memoryIndex, 'utf-8'));
        this.log('OK', 'Índice de cambios', `${index.length} cambios indexados`);
        return true;
      } catch (e) {
        this.log('ERROR', 'Índice de cambios', 'Corrupto');
        return false;
      }
    } else {
      this.log('WARN', 'Índice de cambios', 'No existe (normal, se crea al hacer cambios)');
      return true;
    }
  }

  // 4. Verificar Git
  checkGit() {
    console.log('\n🔗 Verificando Git...');

    try {
      const status = execSync('git status --short', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
      const lines = status.trim().split('\n').filter(l => l);
      this.log('OK', 'Repositorio Git', `${lines.length} cambios detectados`);

      const lastCommit = execSync('git log -1 --pretty=format:"%h %s"', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
      this.log('OK', 'Último commit', lastCommit);

      return true;
    } catch (e) {
      this.log('WARN', 'Git', 'No disponible o no es repositorio');
      return false;
    }
  }

  // 5. Verificar Obsidian
  checkObsidian() {
    console.log('\n🧠 Verificando Obsidian...');

    const obsidianConfig = path.join(BRAIN_DIR, '.obsidian', 'app.json');

    if (fs.existsSync(obsidianConfig)) {
      this.log('OK', 'Configuración Obsidian', 'Presente');
      return true;
    } else {
      this.log('WARN', 'Configuración Obsidian', 'No encontrada (Obsidian creará la suya)');
      return true; // No es crítico
    }
  }

  // 6. Calcular Métricas de Tokens
  calculateTokenMetrics() {
    console.log('\n📊 Calculando Métricas de Tokens...');

    try {
      // Leer archivos del Brain
      const brainContent = this.calculateDirSize(BRAIN_DIR);
      const brainFiles = this.countFiles(BRAIN_DIR);

      // Estimación de tokens (aprox. 1 token = 4 caracteres)
      const estimatedTokens = Math.ceil(brainContent.totalSize / 4);

      // Ahorro teórico (sin contexto, los agentes consultarían todas las notas)
      const estimatedTokensWithoutContext = estimatedTokens * 3; // Sin indexación, 3x más

      const savings = {
        totalBytes: brainContent.totalSize,
        totalFiles: brainFiles,
        estimatedTokensWithContext: estimatedTokens,
        estimatedTokensWithoutContext: estimatedTokensWithoutContext,
        estimatedSavings: estimatedTokensWithoutContext - estimatedTokens,
        savingsPercentage: Math.round(((estimatedTokensWithoutContext - estimatedTokens) / estimatedTokensWithoutContext) * 100)
      };

      this.log('OK', `Brain: ${brainFiles} archivos`, `${(brainContent.totalSize / 1024).toFixed(2)} KB`);
      this.log('OK', 'Tokens estimados CON contexto', `~${savings.estimatedTokensWithContext} tokens`);
      this.log('OK', 'Tokens SIN contexto (sin Brain)', `~${savings.estimatedTokensWithoutContext} tokens`);
      this.log('OK', 'Ahorro estimado', `${savings.estimatedSavings} tokens (${savings.savingsPercentage}%)`);

      return savings;
    } catch (e) {
      this.log('ERROR', 'Métricas de tokens', e.message);
      return null;
    }
  }

  // 7. Generar Reporte
  generateReport() {
    console.log('\n\n═══════════════════════════════════════');
    console.log('📋 REPORTE DE HEALTH CHECK');
    console.log('═══════════════════════════════════════\n');

    const brainOk = this.checkBrain();
    const syncOk = this.checkSync();
    const memoryOk = this.checkMemory();
    const gitOk = this.checkGit();
    const obsidianOk = this.checkObsidian();
    const metrics = this.calculateTokenMetrics();

    console.log('\n═══════════════════════════════════════');
    console.log('📊 RESUMEN');
    console.log('═══════════════════════════════════════\n');

    const checks = [
      { name: 'Brain', ok: brainOk },
      { name: 'Sincronización', ok: syncOk },
      { name: 'Memoria', ok: memoryOk },
      { name: 'Git', ok: gitOk },
      { name: 'Obsidian', ok: obsidianOk }
    ];

    checks.forEach(check => {
      console.log(`${check.ok ? '✅' : '❌'} ${check.name}`);
    });

    if (metrics) {
      console.log(`\n📈 Métricas:`);
      console.log(`   Brain: ${metrics.totalFiles} archivos`);
      console.log(`   Tokens CON contexto: ~${metrics.estimatedTokensWithContext}`);
      console.log(`   Tokens SIN contexto: ~${metrics.estimatedTokensWithoutContext}`);
      console.log(`   💰 Ahorro: ${metrics.estimatedSavings} tokens (${metrics.savingsPercentage}%)`);
    }

    const allHealthy = checks.every(c => c.ok);
    console.log(`\n${allHealthy ? '✅ SISTEMA SALUDABLE' : '⚠️  REVISAR PROBLEMAS'}`);
    console.log('═══════════════════════════════════════\n');

    return { checks, metrics, healthy: allHealthy };
  }

  calculateDirSize(dir) {
    let totalSize = 0;
    let fileCount = 0;

    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(file => {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory() && file.name !== '.obsidian' && file.name !== 'node_modules') {
        const subdir = this.calculateDirSize(filePath);
        totalSize += subdir.totalSize;
        fileCount += subdir.fileCount;
      } else if (file.isFile()) {
        totalSize += fs.statSync(filePath).size;
        fileCount++;
      }
    });

    return { totalSize, fileCount };
  }

  countFiles(dir) {
    let count = 0;
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(file => {
      if (file.isDirectory() && file.name !== '.obsidian' && file.name !== 'node_modules') {
        count += this.countFiles(path.join(dir, file.name));
      } else if (file.isFile() && file.name.endsWith('.md')) {
        count++;
      }
    });
    return count;
  }
}

// Ejecutar
if (require.main === module) {
  const health = new HealthCheck();
  const result = health.generateReport();
  process.exit(result.healthy ? 0 : 1);
}

module.exports = { HealthCheck };

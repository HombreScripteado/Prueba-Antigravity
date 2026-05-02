#!/usr/bin/env node
/**
 * Monitor en Tiempo Real
 * Muestra consumo y ahorro de tokens en vivo
 *
 * Uso: node realtime-monitor.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = process.cwd();
const BRAIN_DIR = path.join(PROJECT_ROOT, 'brain');
const CLAUDE_FLOW_DIR = path.join(PROJECT_ROOT, '.claude-flow');

class RealtimeMonitor {
  constructor() {
    this.startTime = Date.now();
    this.sessionTokens = 0;
    this.sessionSavings = 0;
    this.callCount = 0;
  }

  clear() {
    console.clear();
  }

  header() {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║     🧠 MONITOR EN TIEMPO REAL - Ruflo + Obsidian Brain         ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
  }

  getMetrics() {
    try {
      // Tamaño del Brain
      const brainSize = this.getDirSize(BRAIN_DIR);
      const brainFiles = this.countFiles(BRAIN_DIR);

      // Tokens estimados
      const tokensWithContext = Math.ceil(brainSize / 4);
      const tokensWithoutContext = tokensWithContext * 3;
      const savingsPerCall = tokensWithoutContext - tokensWithContext;
      const savingsPercent = Math.round((savingsPerCall / tokensWithoutContext) * 100);

      return {
        brainSize,
        brainFiles,
        tokensWithContext,
        tokensWithoutContext,
        savingsPerCall,
        savingsPercent
      };
    } catch (e) {
      return null;
    }
  }

  displayMetrics(metrics) {
    if (!metrics) {
      console.log('❌ Error al obtener métricas\n');
      return;
    }

    console.log('📊 MÉTRICAS ACTUALES\n');

    // Brain Status
    console.log('  📂 Brain Status');
    console.log(`     Archivos: ${metrics.brainFiles}`);
    console.log(`     Tamaño:   ${(metrics.brainSize / 1024).toFixed(2)} KB\n`);

    // Tokens
    console.log('  ⚡ Consumo de Tokens');
    console.log(`     CON Brain (optimizado):    ${metrics.tokensWithContext.toLocaleString()} tokens`);
    console.log(`     SIN Brain (sin optimizar): ${metrics.tokensWithoutContext.toLocaleString()} tokens`);
    console.log(`     📉 Ahorro por llamada:     ${metrics.savingsPerCall.toLocaleString()} tokens\n`);

    // Eficiencia
    console.log('  💰 Eficiencia');
    console.log(`     Ahorro:                    ${metrics.savingsPercent}%`);
    this.drawProgressBar(metrics.savingsPercent);
    console.log();
  }

  drawProgressBar(percentage) {
    const filled = Math.round(percentage / 5);
    const empty = 20 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    console.log(`     ${bar} ${percentage}%`);
  }

  displaySimulation(metrics) {
    console.log('  🎯 Simulación de Consumo\n');

    const scenarios = [
      { calls: 10, label: '10 llamadas' },
      { calls: 100, label: '100 llamadas' },
      { calls: 1000, label: '1000 llamadas' },
      { calls: 10000, label: '10,000 llamadas' }
    ];

    scenarios.forEach(scenario => {
      const tokensWithout = metrics.tokensWithoutContext * scenario.calls;
      const tokensWith = metrics.tokensWithContext * scenario.calls;
      const savings = tokensWithout - tokensWith;

      const costWithout = (tokensWithout / 1000000) * 0.30; // $0.30 por 1M tokens
      const costWith = (tokensWith / 1000000) * 0.30;
      const moneySaved = costWithout - costWith;

      console.log(`     ${scenario.label}:`);
      console.log(`       - SIN Brain: ${tokensWithout.toLocaleString()} tokens ($${costWithout.toFixed(4)})`);
      console.log(`       - CON Brain: ${tokensWith.toLocaleString()} tokens ($${costWith.toFixed(4)})`);
      console.log(`       💰 Ahorro:   ${savings.toLocaleString()} tokens ($${moneySaved.toFixed(4)})\n`);
    });
  }

  displaySystemStatus() {
    console.log('  ✅ Estado del Sistema\n');

    const checks = [
      { name: 'Brain',           ok: fs.existsSync(BRAIN_DIR) },
      { name: 'Sincronización',  ok: fs.existsSync(path.join(CLAUDE_FLOW_DIR, 'sync', 'sync-to-brain.js')) },
      { name: 'Configuración',   ok: fs.existsSync(path.join(CLAUDE_FLOW_DIR, 'brain-config.yaml')) },
      { name: 'Hook automático', ok: fs.existsSync(path.join(PROJECT_ROOT, '.claude', 'hooks', 'after-edit.js')) }
    ];

    checks.forEach(check => {
      console.log(`     ${check.ok ? '✅' : '❌'} ${check.name}`);
    });

    console.log();
  }

  displayTips() {
    console.log('  💡 Tips\n');
    console.log('     • Presiona Ctrl+C para salir');
    console.log('     • Abre Obsidian y presiona Ctrl+G para ver grafo');
    console.log('     • Los ahorros se multiplican con más agentes\n');
  }

  displayFooter() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log(`║  ⏱️  Tiempo de monitoreo: ${uptime}s`);
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
  }

  update() {
    this.clear();
    this.header();

    const metrics = this.getMetrics();

    if (metrics) {
      this.displayMetrics(metrics);
      this.displaySimulation(metrics);
      this.displaySystemStatus();
      this.displayTips();
    } else {
      console.log('❌ No se pueden obtener métricas\n');
    }

    this.displayFooter();
  }

  start() {
    console.log('Iniciando monitor en tiempo real...');
    setTimeout(() => {
      this.update();

      // Actualizar cada 5 segundos
      setInterval(() => this.update(), 5000);
    }, 500);
  }

  getDirSize(dir) {
    let size = 0;
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      files.forEach(file => {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory() && file.name !== '.obsidian' && file.name !== 'node_modules') {
          size += this.getDirSize(filePath);
        } else if (file.isFile()) {
          size += fs.statSync(filePath).size;
        }
      });
    } catch (e) {
      return 0;
    }
    return size;
  }

  countFiles(dir) {
    let count = 0;
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      files.forEach(file => {
        if (file.isDirectory() && file.name !== '.obsidian' && file.name !== 'node_modules') {
          count += this.countFiles(path.join(dir, file.name));
        } else if (file.isFile() && file.name.endsWith('.md')) {
          count++;
        }
      });
    } catch (e) {
      return 0;
    }
    return count;
  }
}

// Ejecutar
if (require.main === module) {
  const monitor = new RealtimeMonitor();
  monitor.start();
}

module.exports = { RealtimeMonitor };

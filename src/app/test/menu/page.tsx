'use client';

import { useState } from 'react';

interface MenuResponse {
  clientId: string;
  generatedAt: string;
  categories: Array<{
    category: string;
    categoryPriority: number | null;
    items: Array<{
      id: string;
      name: string;
      price: number;
      item_priority: number | null;
      created_at: string;
    }>;
  }>;
  totalItems: number;
  totalCategories: number;
}

const TEST_CLIENTS = [
  {
    name: '🍕 Pizzería María',
    slug: 'pizzeria-maria',
    key: 'sk_live_maria_key',
    expectedDishes: 5,
    expectedCategories: 2,
    color: 'from-red-100 to-orange-100'
  },
  {
    name: '🍔 Burger King NY',
    slug: 'burger-king-ny',
    key: 'sk_live_burger_key',
    expectedDishes: 4,
    expectedCategories: 2,
    color: 'from-yellow-100 to-red-100'
  }
];

export default function MenuTestPage() {
  const [clientSlug, setClientSlug] = useState('pizzeria-maria');
  const [apiKey, setApiKey] = useState('sk_live_maria_key');
  const [menu, setMenu] = useState<MenuResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<string | null>(null);

  const selectedClient = TEST_CLIENTS.find(c => c.slug === clientSlug);

  const fetchMenu = async () => {
    setLoading(true);
    setError(null);
    setMenu(null);
    setCacheStatus(null);

    try {
      const response = await fetch(`/api/${clientSlug}/menu`, {
        headers: {
          'X-API-Key': apiKey
        }
      });

      // Mostrar estado de caché
      const cacheHeader = response.headers.get('X-Vercel-Cache');
      if (cacheHeader) {
        setCacheStatus(cacheHeader === 'HIT' ? '⚡ HIT (desde caché)' : '📝 MISS (generado)');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      setMenu(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (client: typeof TEST_CLIENTS[0]) => {
    setClientSlug(client.slug);
    setApiKey(client.key);
    setMenu(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">🧪 Test Multi-Cliente</h1>
          <p className="text-slate-600">
            Prueba cómo cada cliente ve solo sus platos y cómo funcionan las prioridades
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Selecciona Cliente</h2>

              <div className="space-y-3 mb-6">
                {TEST_CLIENTS.map((client) => (
                  <button
                    key={client.slug}
                    onClick={() => handleClientSelect(client)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      clientSlug === client.slug
                        ? `bg-gradient-to-r ${client.color} border-blue-500 shadow-md`
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{client.name}</div>
                    <div className="text-sm text-slate-600 mt-1">
                      Slug: <code className="bg-slate-100 px-2 py-1 rounded">{client.slug}</code>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      📊 {client.expectedDishes} platos | 📂 {client.expectedCategories} categorías
                    </div>
                  </button>
                ))}
              </div>

              {/* Manual Input */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-slate-900 mb-3">O ingresa manualmente:</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Client Slug
                    </label>
                    <input
                      type="text"
                      value={clientSlug}
                      onChange={(e) => setClientSlug(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Fetch Button */}
              <button
                onClick={fetchMenu}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? '⏳ Cargando...' : '🔍 Obtener Menú'}
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Cómo funciona:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Cada cliente ve solo sus platos</li>
                <li>✅ Los platos se ordenan por prioridad</li>
                <li>✅ SIN prioridad se ordena por fecha</li>
                <li>✅ Las categorías también se ordenan</li>
              </ul>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 mb-2">❌ Error</h3>
                <p className="text-red-800 font-mono text-sm">{error}</p>
                <div className="mt-3 p-3 bg-red-100 rounded text-sm text-red-700">
                  <strong>💡 Solución:</strong> Verifica que el client_slug y API key sean correctos
                </div>
              </div>
            )}

            {menu && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-green-900">✅ Menú Cargado</h3>
                  {cacheStatus && (
                    <span className="text-sm font-mono bg-green-100 text-green-700 px-3 py-1 rounded">
                      {cacheStatus}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-blue-50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{menu.totalItems}</div>
                    <div className="text-xs text-blue-600">Platos</div>
                  </div>
                  <div className="bg-green-50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{menu.totalCategories}</div>
                    <div className="text-xs text-green-600">Categorías</div>
                  </div>
                  <div className="bg-purple-50 rounded p-3 text-center">
                    <div className="text-xs text-purple-600 truncate">
                      {menu.generatedAt.split('T')[0]}
                    </div>
                    <div className="text-xs text-purple-600">Generado</div>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {menu.categories.map((cat, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        {cat.category}
                        {cat.categoryPriority !== null && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Priority {cat.categoryPriority}
                          </span>
                        )}
                      </h4>

                      <ul className="space-y-2">
                        {cat.items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="flex justify-between items-start p-2 bg-slate-50 rounded"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-slate-900">{item.name}</div>
                              <div className="text-sm text-slate-500 flex gap-2 flex-wrap mt-1">
                                <span>${item.price.toFixed(2)}</span>
                                {item.item_priority !== null && (
                                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                                    P{item.item_priority}
                                  </span>
                                )}
                                {item.item_priority === null && (
                                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">
                                    {new Date(item.created_at).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* JSON */}
                <details className="mt-6 border-t pt-4">
                  <summary className="cursor-pointer font-semibold text-slate-900 hover:text-slate-700">
                    📋 Ver JSON completo
                  </summary>
                  <pre className="mt-3 p-3 bg-slate-900 text-slate-100 rounded overflow-x-auto text-xs">
                    {JSON.stringify(menu, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {!menu && !error && !loading && (
              <div className="bg-slate-100 rounded-lg p-12 text-center">
                <p className="text-slate-600">👈 Selecciona un cliente y haz clic en "Obtener Menú"</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-semibold text-amber-900 mb-3">📋 Instrucciones de Prueba</h3>
          <ol className="text-sm text-amber-800 space-y-2">
            <li>1. <strong>Selecciona Pizzería María</strong> y obtén el menú → Deberías ver 5 platos</li>
            <li>2. <strong>Cambia a Burger King NY</strong> → Verás 4 platos completamente diferentes</li>
            <li>3. <strong>Prueba con API key inválida</strong> → Deberías obtener error 401</li>
            <li>4. <strong>Verifica el orden</strong> → Los platos con priority van primero</li>
            <li>5. <strong>Obtén el menú dos veces</strong> → La segunda vez deberías ver "HIT (desde caché)"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

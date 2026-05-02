'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { MenuData } from '@/lib/menu/fetchMenu';
import {
  ChefHat,
  Leaf,
  Egg,
  Wheat,
  X
} from 'lucide-react';

const ModelViewer = dynamic(
  () => import('@/components/ModelViewer'),
  { ssr: false, loading: () => <div className="w-full h-64 bg-slate-100 rounded-lg animate-pulse" /> }
);

interface MenuDisplayProps {
  menu: MenuData;
}

export default function MenuDisplay({ menu }: MenuDisplayProps) {
  const [selectedDish, setSelectedDish] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-6 pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-2">{menu.clientName}</h1>
          <p className="text-slate-600 text-lg">
            {menu.totalItems} platos en {menu.totalCategories} categorías
          </p>
        </div>

        {/* Categorías */}
        <div className="space-y-12">
          {menu.categories.map((category, idx) => (
            <div key={idx} className="space-y-6">
              {/* Título de categoría */}
              <div className="flex items-baseline gap-4">
                <h2 className="text-3xl font-bold text-slate-900">
                  {category.category}
                </h2>
                {category.categoryPriority !== null && (
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    Priority {category.categoryPriority}
                  </span>
                )}
              </div>

              {/* Grid de platos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map(dish => (
                  <button
                    key={dish.id}
                    onClick={() => setSelectedDish(dish)}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden text-left"
                  >
                    {/* Imagen/Placeholder */}
                    <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 text-sm">Plato: {dish.name}</span>
                    </div>

                    {/* Contenido */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900 flex-1">{dish.name}</h3>
                        <span className="text-lg font-bold text-blue-600 whitespace-nowrap">
                          ${dish.price.toFixed(2)}
                        </span>
                      </div>

                      {dish.description && (
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {dish.description}
                        </p>
                      )}

                      {/* Etiquetas */}
                      <div className="flex flex-wrap gap-2">
                        {dish.chefRecommendation && (
                          <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                            <ChefHat size={12} /> Chef
                          </span>
                        )}
                        {dish.isVegan && (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            <Leaf size={12} /> Vegan
                          </span>
                        )}
                        {dish.isVegetarian && (
                          <span className="inline-flex items-center gap-1 text-xs bg-lime-100 text-lime-700 px-2 py-1 rounded">
                            <Egg size={12} /> Veg
                          </span>
                        )}
                        {dish.isGlutenFree && (
                          <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            <Wheat size={12} /> GF
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de detalle */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Header modal */}
            <div className="flex items-start justify-between p-6 border-b">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {selectedDish.name}
                </h3>
                <p className="text-xl text-blue-600 font-semibold">
                  ${selectedDish.price.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => setSelectedDish(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body modal */}
            <div className="p-6 space-y-6">
              {/* Modelo 3D si existe */}
              {selectedDish.model_3d_path && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-700">Modelo 3D</p>
                  <ModelViewer modelPath={selectedDish.model_3d_path} />
                </div>
              )}

              {/* Descripción */}
              {selectedDish.description && (
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Descripción</p>
                  <p className="text-slate-600">{selectedDish.description}</p>
                </div>
              )}

              {/* Dietarias */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Información dietaria</p>
                <div className="flex flex-wrap gap-3">
                  {selectedDish.chefRecommendation && (
                    <span className="inline-flex items-center gap-2 text-sm bg-amber-50 text-amber-700 px-3 py-2 rounded-lg">
                      <ChefHat size={16} /> Chef Recomienda
                    </span>
                  )}
                  {selectedDish.isVegan && (
                    <span className="inline-flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                      <Leaf size={16} /> Vegano
                    </span>
                  )}
                  {selectedDish.isVegetarian && (
                    <span className="inline-flex items-center gap-2 text-sm bg-lime-50 text-lime-700 px-3 py-2 rounded-lg">
                      <Egg size={16} /> Vegetariano
                    </span>
                  )}
                  {selectedDish.isGlutenFree && (
                    <span className="inline-flex items-center gap-2 text-sm bg-red-50 text-red-700 px-3 py-2 rounded-lg">
                      <Wheat size={16} /> Sin gluten
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

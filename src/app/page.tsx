"use client";

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Coffee, DollarSign, TrendingDown, Package, Settings2, MapPin } from 'lucide-react';

export default function CoffeeDashboard() {
  // Estados para guardar os valores digitados pelo usuário
  const [cotacaoNY, setCotacaoNY] = useState<number>(286.95);
  const [dolar, setDolar] = useState<number>(5.21);
  const [precoFisico, setPrecoFisico] = useState<number>(1879.00); // Preço Guaxupé/Cooxupé
  
  const librasPorSaca = 132.277;

  // Função de cálculo
  const calcularValorSacaBRL = (nyCents: number, txDolar: number) => {
    return ((nyCents / 100) * librasPorSaca * txDolar).toFixed(2);
  };

  const sacaBaseBRL = parseFloat(calcularValorSacaBRL(cotacaoNY, dolar));
  const sacaDesagio20BRL = parseFloat(calcularValorSacaBRL(cotacaoNY - 20, dolar));

  // Diferença entre o Físico e NY Base
  const diferencaFisicoBase = precoFisico - sacaBaseBRL;

  // Dados para o Gráfico Comparativo (Agora incluindo o Mercado Físico)
  const dadosComparativos = [
    { nome: 'Bolsa NY (Base)', valorR$: sacaBaseBRL, tipo: 'bolsa' },
    { nome: 'Bolsa NY (-20¢)', valorR$: sacaDesagio20BRL, tipo: 'bolsa' },
    { nome: 'Físico (Guaxupé)', valorR$: precoFisico, tipo: 'fisico' },
  ];

  // Dados para o Gráfico de Sensibilidade Cambial
  const dadosCambio = [
    { dolarLabel: 'R$ 4.80', tx: 4.80 },
    { dolarLabel: 'R$ 5.00', tx: 5.00 },
    { dolarLabel: `R$ ${dolar} (Atual)`, tx: dolar },
    { dolarLabel: 'R$ 5.40', tx: 5.40 },
    { dolarLabel: 'R$ 5.60', tx: 5.60 },
  ].sort((a, b) => a.tx - b.tx).map(item => ({
    dolar: item.dolarLabel,
    sacaBase: parseFloat(calcularValorSacaBRL(cotacaoNY, item.tx)),
    sacaDesagio20: parseFloat(calcularValorSacaBRL(cotacaoNY - 20, item.tx))
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho e Inputs */}
        <header className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Coffee className="text-amber-700" size={32} />
              Dashboard de Precificação
            </h1>
            <p className="text-slate-500 mt-2">Simulação NY x Mercado Físico (Tipo 6 Duro)</p>
          </div>
          
          {/* Painel de Controles (Inputs) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
            <Settings2 className="text-slate-400 hidden md:block" size={24} />
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Cotação NY (¢/lb)</label>
              <input 
                type="number" 
                value={cotacaoNY} 
                onChange={(e) => setCotacaoNY(Number(e.target.value))}
                className="w-24 px-2 py-1 border border-slate-300 rounded-md font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Dólar (R$)</label>
              <input 
                type="number" 
                step="0.01"
                value={dolar} 
                onChange={(e) => setDolar(Number(e.target.value))}
                className="w-24 px-2 py-1 border border-slate-300 rounded-md font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="pl-4 border-l border-slate-200">
              <label className="block text-xs font-semibold text-emerald-600 mb-1">Mercado Físico (R$)</label>
              <input 
                type="number" 
                value={precoFisico} 
                onChange={(e) => setPrecoFisico(Number(e.target.value))}
                className="w-28 px-2 py-1 border border-emerald-300 bg-emerald-50 rounded-md font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </header>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card NY */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-500">Saca NY (Base)</h3>
              <Package className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">R$ {sacaBaseBRL.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-2">Conversão direta s/ deságio</p>
          </div>

          {/* Card NY com Deságio */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-500">Saca NY (-20¢)</h3>
              <Package className="text-amber-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">R$ {sacaDesagio20BRL.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-2">Com desconto de exportação</p>
          </div>

          {/* Card Físico */}
          <div className="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-100 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-sm font-semibold text-emerald-800">Físico Guaxupé/MG</h3>
              <MapPin className="text-emerald-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-emerald-900 relative z-10">R$ {precoFisico.toFixed(2)}</p>
            <p className="text-xs text-emerald-700 mt-2 relative z-10">Tipo 6 Duro Bica Corrida</p>
          </div>

          {/* Card Comparativo */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-300">Físico vs NY Base</h3>
              <TrendingDown className={diferencaFisicoBase < 0 ? "text-red-400" : "text-green-400"} size={20} />
            </div>
            <p className={`text-2xl font-bold ${diferencaFisicoBase < 0 ? "text-red-400" : "text-green-400"}`}>
              {diferencaFisicoBase > 0 ? '+' : ''}R$ {diferencaFisicoBase.toFixed(2)}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {diferencaFisicoBase < 0 ? "Deságio praticado na região" : "Prêmio praticado na região"}
            </p>
          </div>
        </div>

        {/* Área dos Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Gráfico 1: Comparativo Físico vs NY */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Físico vs Cotação Internacional (R$/Saca)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosComparativos} margin={{ top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="nome" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip 
                    formatter={(value) => `R$ ${value}`}
                    cursor={{fill: '#f1f5f9'}}
                  />
                  <Bar dataKey="valorR$" radius={[4, 4, 0, 0]}>
                    {dadosComparativos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.tipo === 'fisico' ? '#10b981' : '#0ea5e9'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Sensibilidade Cambial */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Sensibilidade Cambial (Simulação NY)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosCambio}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="dolar" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="sacaBase" stroke="#0ea5e9" strokeWidth={3} name="NY Base" />
                  <Line type="monotone" dataKey="sacaDesagio20" stroke="#f59e0b" strokeWidth={3} name="NY (-20¢)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

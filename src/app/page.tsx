"use client";

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Coffee, DollarSign, TrendingDown, Package, Settings2, MapPin, Scale } from 'lucide-react';

export default function CoffeeDashboard() {
  // Estados para os inputs
  const [cotacaoNY, setCotacaoNY] = useState<number>(286.95);
  const [dolar, setDolar] = useState<number>(5.21);
  const [precoFisico, setPrecoFisico] = useState<number>(1879.00);
  const [diferencial, setDiferencial] = useState<number>(20); // Novo campo de Diferencial
  
  const librasPorSaca = 132.277;

  // Cálculos base
  const calcularValorSacaBRL = (nyCents: number, txDolar: number) => {
    return ((nyCents / 100) * librasPorSaca * txDolar).toFixed(2);
  };

  const sacaBaseBRL = parseFloat(calcularValorSacaBRL(cotacaoNY, dolar));
  const sacaComDesagioBRL = parseFloat(calcularValorSacaBRL(cotacaoNY - diferencial, dolar));

  // Comparativos solicitados
  const diferencaFisicoBase = precoFisico - sacaBaseBRL;
  const diferencaFisicoDesagio = precoFisico - sacaComDesagioBRL;

  // Dados para o Gráfico de Barras
  const dadosComparativos = [
    { nome: 'NY Base (Tela)', valorR$: sacaBaseBRL, tipo: 'bolsa' },
    { nome: `NY (-${diferencial}¢)`, valorR$: sacaComDesagioBRL, tipo: 'desagio' },
    { nome: 'Mercado Físico', valorR$: precoFisico, tipo: 'fisico' },
  ];

  // Dados para Sensibilidade Cambial
  const dadosCambio = [
    { dolarLabel: 'R$ 4.80', tx: 4.80 },
    { dolarLabel: 'R$ 5.00', tx: 5.00 },
    { dolarLabel: `R$ ${dolar}`, tx: dolar },
    { dolarLabel: 'R$ 5.40', tx: 5.40 },
    { dolarLabel: 'R$ 5.60', tx: 5.60 },
  ].sort((a, b) => a.tx - b.tx).map(item => ({
    dolar: item.dolarLabel,
    sacaBase: parseFloat(calcularValorSacaBRL(cotacaoNY, item.tx)),
    sacaComDesagio: parseFloat(calcularValorSacaBRL(cotacaoNY - diferencial, item.tx))
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
            <p className="text-slate-500 mt-2">Análise de Base: Mercado Físico vs Exportação</p>
          </div>
          
          {/* Painel de Controles */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
            <Settings2 className="text-slate-400 hidden lg:block" size={24} />
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">NY (¢/lb)</label>
              <input type="number" value={cotacaoNY} onChange={(e) => setCotacaoNY(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-slate-300 rounded-md font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Deságio (¢)</label>
              <input type="number" value={diferencial} onChange={(e) => setDiferencial(Number(e.target.value))}
                className="w-16 px-2 py-1 border border-amber-300 bg-amber-50 rounded-md font-bold text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Dólar (R$)</label>
              <input type="number" step="0.01" value={dolar} onChange={(e) => setDolar(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-slate-300 rounded-md font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            
            <div className="pl-4 border-l border-slate-200">
              <label className="block text-xs font-semibold text-emerald-600 mb-1">Físico (R$)</label>
              <input type="number" value={precoFisico} onChange={(e) => setPrecoFisico(Number(e.target.value))}
                className="w-24 px-2 py-1 border border-emerald-300 bg-emerald-50 rounded-md font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </header>

        {/* Linha 1: Preços Absolutos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-2"><Package size={16}/> Saca NY (Base Teórica)</h3>
            <p className="text-2xl font-bold text-slate-800">R$ {sacaBaseBRL.toFixed(2)}</p>
          </div>
          <div className="bg-amber-50 p-5 rounded-xl shadow-sm border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2"><Package size={16}/> Saca NY c/ Deságio (-{diferencial}¢)</h3>
            <p className="text-2xl font-bold text-amber-900">R$ {sacaComDesagioBRL.toFixed(2)}</p>
          </div>
          <div className="bg-emerald-50 p-5 rounded-xl shadow-sm border border-emerald-200">
            <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-2"><MapPin size={16}/> Mercado Físico (Real)</h3>
            <p className="text-2xl font-bold text-emerald-900">R$ {precoFisico.toFixed(2)}</p>
          </div>
        </div>

        {/* Linha 2: Os Comparativos Solicitados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Comparativo 1: Físico vs Base */}
          <div className="bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1"><Scale size={16}/> Físico vs NY Base</h3>
              <p className={`text-2xl font-bold ${diferencaFisicoBase < 0 ? "text-red-400" : "text-green-400"}`}>
                {diferencaFisicoBase > 0 ? '+' : ''}R$ {diferencaFisicoBase.toFixed(2)} / sc
              </p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${diferencaFisicoBase < 0 ? "bg-red-400/20 text-red-400" : "bg-green-400/20 text-green-400"}`}>
                {diferencaFisicoBase < 0 ? 'DESÁGIO BRUTO' : 'PRÊMIO BRUTO'}
              </span>
            </div>
          </div>

          {/* Comparativo 2: Físico vs Deságio */}
          <div className="bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1"><Scale size={16}/> Físico vs NY (-{diferencial}¢)</h3>
              <p className={`text-2xl font-bold ${diferencaFisicoDesagio < 0 ? "text-red-400" : "text-green-400"}`}>
                {diferencaFisicoDesagio > 0 ? '+' : ''}R$ {diferencaFisicoDesagio.toFixed(2)} / sc
              </p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${diferencaFisicoDesagio < 0 ? "bg-red-400/20 text-red-400" : "bg-green-400/20 text-green-400"}`}>
                {diferencaFisicoDesagio < 0 ? 'FÍSICO DESCONTADO' : 'FÍSICO VALORIZADO'}
              </span>
            </div>
          </div>
        </div>

        {/* Área dos Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Gráfico 1: Comparativo Visual */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Comparativo de Preços (R$/sc)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosComparativos} margin={{ top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="nome" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip formatter={(value) => `R$ ${value}`} cursor={{fill: '#f1f5f9'}} />
                  <ReferenceLine y={precoFisico} stroke="#10b981" strokeDasharray="3 3" />
                  <Bar dataKey="valorR$" radius={[4, 4, 0, 0]}>
                    {dadosComparativos.map((entry, index) => {
                      let color = '#0ea5e9'; // Azul para NY Base
                      if (entry.tipo === 'desagio') color = '#f59e0b'; // Laranja para NY c/ deságio
                      if (entry.tipo === 'fisico') color = '#10b981'; // Verde para Físico
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Sensibilidade Cambial */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Sensibilidade Cambial</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosCambio}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="dolar" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="sacaBase" stroke="#0ea5e9" strokeWidth={3} name="NY Base" />
                  <Line type="monotone" dataKey="sacaComDesagio" stroke="#f59e0b" strokeWidth={3} name={`NY (-${diferencial}¢)`} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

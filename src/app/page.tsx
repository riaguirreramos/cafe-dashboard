"use client";

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Coffee, DollarSign, TrendingDown, Package, Settings2 } from 'lucide-react';

export default function CoffeeDashboard() {
  // Estados para guardar os valores digitados pelo usuário
  const [cotacaoNY, setCotacaoNY] = useState<number>(286.95);
  const [dolar, setDolar] = useState<number>(5.21);
  const librasPorSaca = 132.277;

  // Função de cálculo
  const calcularValorSacaBRL = (nyCents: number, txDolar: number) => {
    return ((nyCents / 100) * librasPorSaca * txDolar).toFixed(2);
  };

  // Dados para o Gráfico de Deságio (Calculados em tempo real)
  const dadosDesagio = [
    { nome: 'Base (Bolsa NY)', valorR$: parseFloat(calcularValorSacaBRL(cotacaoNY, dolar)) },
    { nome: '- 10 cents', valorR$: parseFloat(calcularValorSacaBRL(cotacaoNY - 10, dolar)) },
    { nome: '- 20 cents', valorR$: parseFloat(calcularValorSacaBRL(cotacaoNY - 20, dolar)) },
    { nome: '- 30 cents', valorR$: parseFloat(calcularValorSacaBRL(cotacaoNY - 30, dolar)) },
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
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Coffee className="text-amber-700" size={32} />
              Dashboard de Precificação
            </h1>
            <p className="text-slate-500 mt-2">Simulação interativa de conversão NY (¢/lb) para BRL (R$/saca)</p>
          </div>
          
          {/* Painel de Controles (Inputs) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4 items-center">
            <Settings2 className="text-slate-400" size={24} />
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
          </div>
        </header>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-500">Cotação NY Atual</h3>
              <TrendingDown className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{cotacaoNY} ¢</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-500">Dólar Comercial</h3>
              <DollarSign className="text-green-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">R$ {dolar.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-500">Saca Base (S/ Deságio)</h3>
              <Package className="text-amber-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">R$ {dadosDesagio[0].valorR$}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-500">Saca c/ Deságio (20¢)</h3>
              <Package className="text-red-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">R$ {dadosDesagio[2].valorR$}</p>
          </div>
        </div>

        {/* Área dos Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico 1: Comparativo de Deságios */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Impacto dos Deságios (R$/Saca)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosDesagio}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="nome" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Bar dataKey="valorR$" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Valor em Reais" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Sensibilidade Cambial */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Sensibilidade Cambial (R$/Saca)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosCambio}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="dolar" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="sacaBase" stroke="#0ea5e9" strokeWidth={3} name="Saca Base" />
                  <Line type="monotone" dataKey="sacaDesagio20" stroke="#f43f5e" strokeWidth={3} name="Saca (-20¢)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
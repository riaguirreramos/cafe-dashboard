"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Coffee, Settings2, MapPin, Scale, Landmark, RefreshCw, Target } from 'lucide-react';

export default function CoffeeDashboard() {
  // Estados para os inputs
  const [cotacaoNY, setCotacaoNY] = useState<number>(286.95);
  const [dolar, setDolar] = useState<number>(5.21);
  const [precoFisico, setPrecoFisico] = useState<number>(1879.00);
  const [diferencial, setDiferencial] = useState<number>(20); // Diferencial / Basis de exportação simulado
  const [carregandoDolar, setCarregandoDolar] = useState<boolean>(true);
  
  const librasPorSaca = 132.277;

  // Busca do Dólar Automático (AwesomeAPI)
  useEffect(() => {
    fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
      .then(response => response.json())
      .then(data => {
        if (data && data.USDBRL && data.USDBRL.ask) {
          setDolar(parseFloat(parseFloat(data.USDBRL.ask).toFixed(4)));
        }
        setCarregandoDolar(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dólar automático:", error);
        setCarregandoDolar(false);
      });
  }, []);

  // Cálculos base
  const calcularValorSacaBRL = (nyCents: number, txDolar: number) => {
    return ((nyCents / 100) * librasPorSaca * txDolar).toFixed(2);
  };

  const sacaBaseBRL = parseFloat(calcularValorSacaBRL(cotacaoNY, dolar));
  const paridadeExportacaoBRL = parseFloat(calcularValorSacaBRL(cotacaoNY - diferencial, dolar));

  // Comparativos Financeiros
  const baseBruta = precoFisico - sacaBaseBRL;
  const atratividade = precoFisico - paridadeExportacaoBRL;

  // Descobridor de Basis (Engenharia Reversa)
  // Fórmula: Basis = ((PreçoFisico * 100) / (Libras * Dolar)) - NY
  const basisImplicitoCalculado = ((precoFisico * 100) / (librasPorSaca * dolar)) - cotacaoNY;

  // Dados para o Gráfico de Barras
  const dadosComparativos = [
    { nome: 'NY (Base Teórica)', valorR$: sacaBaseBRL, tipo: 'bolsa' },
    { nome: 'Paridade Exportação', valorR$: paridadeExportacaoBRL, tipo: 'exportacao' },
    { nome: 'Mercado Físico', valorR$: precoFisico, tipo: 'fisico' },
  ];

  // Dados para Sensibilidade Cambial
  const dadosCambio = [
    { dolarLabel: `R$ ${(dolar - 0.30).toFixed(2)}`, tx: dolar - 0.30 },
    { dolarLabel: `R$ ${(dolar - 0.15).toFixed(2)}`, tx: dolar - 0.15 },
    { dolarLabel: `R$ ${dolar} (Atual)`, tx: dolar },
    { dolarLabel: `R$ ${(dolar + 0.15).toFixed(2)}`, tx: dolar + 0.15 },
    { dolarLabel: `R$ ${(dolar + 0.30).toFixed(2)}`, tx: dolar + 0.30 },
  ].sort((a, b) => a.tx - b.tx).map(item => ({
    dolar: item.dolarLabel,
    sacaBase: parseFloat(calcularValorSacaBRL(cotacaoNY, item.tx)),
    paridadeExportacao: parseFloat(calcularValorSacaBRL(cotacaoNY - diferencial, item.tx))
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho e Inputs */}
        <header className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Coffee className="text-amber-700" size={32} />
              Análise de Diferencial (Basis)
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Arábica Físico vs ICE NY</p>
          </div>
          
          {/* Painel de Controles */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
            <Settings2 className="text-slate-400 hidden lg:block" size={24} />
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">ICE NY (¢/lb)</label>
              <input type="number" value={cotacaoNY} onChange={(e) => setCotacaoNY(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-slate-300 rounded-md font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Basis Alvo (¢)</label>
              <input type="number" value={diferencial} onChange={(e) => setDiferencial(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-amber-300 bg-amber-50 rounded-md font-bold text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                USDBRL (R$)
                {carregandoDolar ? (
                  <RefreshCw size={12} className="animate-spin text-blue-500" />
                ) : (
                  <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded font-bold">AUTO</span>
                )}
              </label>
              <input type="number" step="0.0001" value={dolar} onChange={(e) => setDolar(Number(e.target.value))}
                className="w-24 px-2 py-1 border border-slate-300 rounded-md font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            
            <div className="pl-4 border-l border-slate-200">
              <label className="block text-xs font-semibold text-emerald-600 mb-1">Mercado Físico (R$)</label>
              <input type="number" value={precoFisico} onChange={(e) => setPrecoFisico(Number(e.target.value))}
                className="w-28 px-2 py-1 border border-emerald-300 bg-emerald-50 rounded-md font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </header>

        {/* Linha 1: Valores por Saca */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-2"><Landmark size={16}/> Saca NY (Base Teórica)</h3>
            <p className="text-2xl font-bold text-slate-800">R$ {sacaBaseBRL.toFixed(2)}</p>
          </div>
          <div className="bg-amber-50 p-5 rounded-xl shadow-sm border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2"><Landmark size={16}/> Paridade de Exportação</h3>
            <p className="text-2xl font-bold text-amber-900">R$ {paridadeExportacaoBRL.toFixed(2)}</p>
            <p className="text-xs text-amber-700 mt-1">NY descontado o Basis Alvo de -{diferencial}¢</p>
          </div>
          <div className="bg-emerald-50 p-5 rounded-xl shadow-sm border border-emerald-200">
            <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-2"><MapPin size={16}/> Mercado Físico</h3>
            <p className="text-2xl font-bold text-emerald-900">R$ {precoFisico.toFixed(2)}</p>
            <p className="text-xs text-emerald-700 mt-1">Preço de balcão reportado</p>
          </div>
        </div>

        {/* Linha 2: Termômetro de Vendas e Descobridor (Os 3 Comparativos) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Card 1: Base Bruta */}
          <div className="bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Scale size={16}/> Base Bruta (Físico vs NY)</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${baseBruta < 0 ? "bg-red-400/20 text-red-400" : "bg-green-400/20 text-green-400"}`}>
                {baseBruta < 0 ? 'DESÁGIO' : 'PRÊMIO'}
              </span>
            </div>
            <p className={`text-2xl font-bold ${baseBruta < 0 ? "text-red-400" : "text-green-400"}`}>
              {baseBruta > 0 ? '+' : ''}R$ {baseBruta.toFixed(2)} <span className="text-sm font-normal text-slate-500">/sc</span>
            </p>
          </div>

          {/* Card 2: Atratividade */}
          <div className="bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-700 ring-1 ring-white/10 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Scale size={16}/> Atratividade vs Exportação</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${atratividade < 0 ? "bg-amber-400/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                {atratividade < 0 ? 'EXPORTAÇÃO GANHA' : 'FÍSICO GANHA'}
              </span>
            </div>
            <p className={`text-2xl font-bold ${atratividade < 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {atratividade > 0 ? '+' : ''}R$ {atratividade.toFixed(2)} <span className="text-sm font-normal text-slate-500">/sc</span>
            </p>
          </div>

          {/* Card 3: DESCOBRIDOR DE BASIS */}
          <div className="bg-indigo-950 p-5 rounded-xl shadow-sm border border-indigo-800 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Target size={100} />
            </div>
            <div className="relative z-10 flex justify-between items-start mb-2">
              <h3 className="text-sm font-semibold text-indigo-300 flex items-center gap-2"><Target size={16}/> Basis Implícito (Balcão)</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                DESCOBRIDOR
              </span>
            </div>
            <p className={`text-3xl font-bold relative z-10 ${basisImplicitoCalculado < 0 ? "text-red-400" : "text-green-400"}`}>
              {basisImplicitoCalculado.toFixed(2)} ¢ <span className="text-sm font-normal text-indigo-400/70">/lb</span>
            </p>
          </div>

        </div>

        {/* Área dos Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Gráfico 1: Comparativo Visual */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Comparativo de Atratividade (R$/sc)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosComparativos} margin={{ top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="nome" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip formatter={(value) => `R$ ${value}`} cursor={{fill: '#f1f5f9'}} />
                  {/* Linha de referência do físico */}
                  <ReferenceLine y={precoFisico} stroke="#10b981" strokeDasharray="3 3" />
                  <Bar dataKey="valorR$" radius={[4, 4, 0, 0]}>
                    {dadosComparativos.map((entry, index) => {
                      let color = '#0ea5e9'; // Azul NY Base
                      if (entry.tipo === 'exportacao') color = '#f59e0b'; // Laranja Exportação
                      if (entry.tipo === 'fisico') color = '#10b981'; // Verde Físico
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Sensibilidade Cambial Dinâmica */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Sensibilidade Cambial (± R$ 0,30)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosCambio}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="dolar" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="sacaBase" stroke="#0ea5e9" strokeWidth={3} name="NY (Base Teórica)" />
                  <Line type="monotone" dataKey="paridadeExportacao" stroke="#f59e0b" strokeWidth={3} name="Paridade Exportação" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

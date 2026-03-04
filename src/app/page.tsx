"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Coffee, Settings2, MapPin, Scale, Landmark, RefreshCw, Target, AlertCircle } from 'lucide-react';

export default function CoffeeDashboard() {
  const [cotacaoNY, setCotacaoNY] = useState<number | ''>('');
  const [dolar, setDolar] = useState<number>(0);
  const [precoFisico, setPrecoFisico] = useState<number | ''>('');
  const [diferencial, setDiferencial] = useState<number>(20);
  const [carregandoDolar, setCarregandoDolar] = useState<boolean>(true);
  
  const librasPorSaca = 132.277;

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
        console.error("Erro ao buscar dólar:", error);
        setCarregandoDolar(false);
      });
  }, []);

  const dadosProntos = typeof cotacaoNY === 'number' && typeof precoFisico === 'number' && dolar > 0;
  const nyVal = Number(cotacaoNY) || 0;
  const fisicoVal = Number(precoFisico) || 0;

  const calcularValorSacaBRL = (nyCents: number, txDolar: number) => {
    return ((nyCents / 100) * librasPorSaca * txDolar).toFixed(2);
  };

  const sacaBaseBRL = parseFloat(calcularValorSacaBRL(nyVal, dolar));
  const paridadeExportacaoBRL = parseFloat(calcularValorSacaBRL(nyVal - diferencial, dolar));

  const baseBruta = fisicoVal - sacaBaseBRL;
  const atratividade = fisicoVal - paridadeExportacaoBRL;
  const basisImplicitoCalculado = dadosProntos ? ((fisicoVal * 100) / (librasPorSaca * dolar)) - nyVal : 0;

  const dadosComparativos = dadosProntos ? [
    { nome: 'NY (Base Teórica)', valorR$: sacaBaseBRL, tipo: 'bolsa' },
    { nome: 'Paridade Exportação', valorR$: paridadeExportacaoBRL, tipo: 'exportacao' },
    { nome: 'Mercado Físico', valorR$: fisicoVal, tipo: 'fisico' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Coffee className="text-amber-700" size={32} />
              Análise de Diferencial (Basis)
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Arábica Físico vs ICE NY</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
            <Settings2 className="text-slate-400 hidden lg:block" size={24} />
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">ICE NY (¢/lb)</label>
              <input type="number" placeholder="0.00" value={cotacaoNY} onChange={(e) => setCotacaoNY(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-24 px-2 py-1 border border-slate-300 rounded-md font-bold focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Basis Alvo (¢)</label>
              <input type="number" value={diferencial} onChange={(e) => setDiferencial(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-amber-300 bg-amber-50 rounded-md font-bold text-amber-700 focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                USDBRL (R$) {carregandoDolar ? <RefreshCw size={12} className="animate-spin text-blue-500" /> : <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded font-bold">AUTO</span>}
              </label>
              <input type="number" step="0.0001" value={dolar || ''} onChange={(e) => setDolar(Number(e.target.value))}
                className="w-24 px-2 py-1 border border-slate-300 rounded-md font-bold focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="pl-4 border-l border-slate-200">
              <label className="block text-xs font-semibold text-emerald-600 mb-1">Mercado Físico (R$)</label>
              <input type="number" placeholder="0.00" value={precoFisico} onChange={(e) => setPrecoFisico(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-28 px-2 py-1 border border-emerald-300 bg-emerald-50 rounded-md font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </header>

        {!dadosProntos && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-6 flex flex-col items-center justify-center text-center mb-8 h-80">
            <AlertCircle size={48} className="text-blue-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Aguardando Dados</h2>
            <p className="max-w-md">Preencha a <strong>Bolsa de NY</strong> e o <strong>Mercado Físico</strong> para liberar a análise.</p>
          </div>
        )}

        {dadosProntos && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-2"><Landmark size={16}/> Saca NY (Base Teórica)</h3>
                <p className="text-2xl font-bold">R$ {sacaBaseBRL.toFixed(2)}</p>
              </div>
              <div className="bg-amber-50 p-5 rounded-xl shadow-sm border border-amber-200">
                <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2"><Landmark size={16}/> Paridade de Exportação</h3>
                <p className="text-2xl font-bold text-amber-900">R$ {paridadeExportacaoBRL.toFixed(2)}</p>
              </div>
              <div className="bg-emerald-50 p-5 rounded-xl shadow-sm border border-emerald-200">
                <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-2"><MapPin size={16}/> Mercado Físico</h3>
                <p className="text-2xl font-bold text-emerald-900">R$ {fisicoVal.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Base Bruta (Físico vs NY)</h3>
                <p className={`text-2xl font-bold ${baseBruta < 0 ? "text-red-400" : "text-green-400"}`}>
                  {baseBruta > 0 ? '+' : ''}R$ {baseBruta.toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 ring-1 ring-white/10">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Atratividade vs Exportação</h3>
                <p className={`text-2xl font-bold ${atratividade < 0 ? "text-amber-400" : "text-emerald-400"}`}>
                  {atratividade > 0 ? '+' : ''}R$ {atratividade.toFixed(2)}
                </p>
                <span className="text-[10px] font-bold uppercase text-slate-500">{atratividade < 0 ? 'EXPORTAÇÃO GANHA' : 'FÍSICO GANHA'}</span>
              </div>
              <div className="bg-indigo-950 p-5 rounded-xl border border-indigo-800">
                <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">Basis Implícito (Balcão)</h3>
                <p className={`text-3xl font-bold ${basisImplicitoCalculado < 0 ? "text-red-400" : "text-green-400"}`}>
                  {basisImplicitoCalculado.toFixed(2)} ¢
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">Comparativo de Atratividade (R$/sc)</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosComparativos} margin={{ top: 20, right: 30, left: 60, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="nome" axisLine={false} tickLine={false} height={60} tickMargin={10} />
                    <YAxis axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} width={60} tick={{fontSize: 12}} tickFormatter={(val) => Math.round(val)} />
                    <Tooltip formatter={(value) => `R$ ${value}`} cursor={{fill: '#f8fafc'}} />
                    <ReferenceLine y={fisicoVal} stroke="#10b981" strokeDasharray="3 3" />
                    <Bar dataKey="valorR$" radius={[6, 6, 0, 0]} barSize={80}>
                      {dadosComparativos.map((entry, index) => {
                        let color = '#0ea5e9';
                        if (entry.tipo === 'exportacao') color = '#f59e0b';
                        if (entry.tipo === 'fisico') color = '#10b981';
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

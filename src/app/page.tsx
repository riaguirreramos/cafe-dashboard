"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Coffee, Settings2, MapPin, Scale, Landmark, RefreshCw, Target, AlertCircle } from 'lucide-react';

export default function CoffeeDashboard() {
  const [cotacaoNY, setCotacaoNY] = useState<number | ''>('');
  const [dolar, setDolar] = useState<number | ''>('');
  const [diferencialAlvo, setDiferencialAlvo] = useState<number>(20);
  const [carregandoDolar, setCarregandoDolar] = useState<boolean>(true);
  
  const [precoCooxupe, setPrecoCooxupe] = useState<number | ''>('');
  const [precoCoopercitrus, setPrecoCoopercitrus] = useState<number | ''>('');
  const [precoVarginha, setPrecoVarginha] = useState<number | ''>('');

  const librasPorSaca = 132.277;

  // 1. Carregar dados salvos ao iniciar
  useEffect(() => {
    const salvoNY = localStorage.getItem('cafe_ny');
    const salvoDolar = localStorage.getItem('cafe_dolar');
    const salvoDiferencial = localStorage.getItem('cafe_diferencial');
    const salvoCooxupe = localStorage.getItem('cafe_cooxupe');
    const salvoCoopercitrus = localStorage.getItem('cafe_coopercitrus');
    const salvoVarginha = localStorage.getItem('cafe_varginha');

    if (salvoNY) setCotacaoNY(Number(salvoNY));
    if (salvoDolar) {
      setDolar(Number(salvoDolar));
      setCarregandoDolar(false); // Se tem salvo, para o loading
    }
    if (salvoDiferencial) setDiferencialAlvo(Number(salvoDiferencial));
    if (salvoCooxupe) setPrecoCooxupe(Number(salvoCooxupe));
    if (salvoCoopercitrus) setPrecoCoopercitrus(Number(salvoCoopercitrus));
    if (salvoVarginha) setPrecoVarginha(Number(salvoVarginha));

    // Se não tiver dólar salvo, busca o automático uma única vez
    if (!salvoDolar) {
      fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
        .then(response => response.json())
        .then(data => {
          if (data && data.USDBRL && data.USDBRL.ask) {
            setDolar(parseFloat(parseFloat(data.USDBRL.ask).toFixed(4)));
          }
          setCarregandoDolar(false);
        })
        .catch(() => setCarregandoDolar(false));
    }
  }, []);

  // 2. Salvar dados automaticamente sempre que mudar
  useEffect(() => {
    if (cotacaoNY !== '') localStorage.setItem('cafe_ny', cotacaoNY.toString());
    if (dolar !== '') localStorage.setItem('cafe_dolar', dolar.toString());
    localStorage.setItem('cafe_diferencial', diferencialAlvo.toString());
    if (precoCooxupe !== '') localStorage.setItem('cafe_cooxupe', precoCooxupe.toString());
    if (precoCoopercitrus !== '') localStorage.setItem('cafe_coopercitrus', precoCoopercitrus.toString());
    if (precoVarginha !== '') localStorage.setItem('cafe_varginha', precoVarginha.toString());
  }, [cotacaoNY, dolar, diferencialAlvo, precoCooxupe, precoCoopercitrus, precoVarginha]);

  const dadosProntos = typeof cotacaoNY === 'number' && typeof dolar === 'number' && dolar > 0;
  const nyVal = Number(cotacaoNY) || 0;
  const dolarVal = Number(dolar) || 0;

  const calcularValorSacaBRL = (nyCents: number, txDolar: number) => {
    return ((nyCents / 100) * librasPorSaca * txDolar).toFixed(2);
  };

  const sacaBaseBRL = parseFloat(calcularValorSacaBRL(nyVal, dolarVal));
  const paridadeExportacaoBRL = parseFloat(calcularValorSacaBRL(nyVal - diferencialAlvo, dolarVal));

  const calcBasis = (preco: number | '') => {
    if (!preco || !dadosProntos) return 0;
    return ((Number(preco) * 100) / (librasPorSaca * dolarVal)) - nyVal;
  };

  const dadosGrafico = [
    { nome: 'NY Base', valor: sacaBaseBRL, tipo: 'bolsa' },
    { nome: 'Parid. Exp.', valor: paridadeExportacaoBRL, tipo: 'exportacao' },
    { nome: 'Cooxupé', valor: Number(precoCooxupe) || 0, tipo: 'fisico' },
    { nome: 'Coopercitrus', valor: Number(precoCoopercitrus) || 0, tipo: 'fisico' },
    { nome: 'Varginha', valor: Number(precoVarginha) || 0, tipo: 'fisico' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Coffee className="text-amber-700" size={32} />
              Monitor Regional de Basis
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic">Cooxupé • Coopercitrus • Varginha vs ICE NY</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ICE NY (¢/lb)</label>
              <input type="number" placeholder="0.00" value={cotacaoNY} onChange={(e) => setCotacaoNY(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-2 py-1 border border-slate-300 rounded font-bold focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Basis Alvo (¢)</label>
              <input type="number" value={diferencialAlvo} onChange={(e) => setDiferencialAlvo(Number(e.target.value))}
                className="w-full px-2 py-1 border border-amber-300 bg-amber-50 rounded font-bold text-amber-700 focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">USDBRL (R$)</label>
              <input type="number" step="0.0001" placeholder="0.00" value={dolar} onChange={(e) => setDolar(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-2 py-1 border border-slate-300 rounded font-bold focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-600 uppercase mb-1">Cooxupé (R$)</label>
              <input type="number" placeholder="0.00" value={precoCooxupe} onChange={(e) => setPrecoCooxupe(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-2 py-1 border border-emerald-300 bg-emerald-50 rounded font-bold text-emerald-800" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-600 uppercase mb-1">Varginha (R$)</label>
              <input type="number" placeholder="0.00" value={precoVarginha} onChange={(e) => setPrecoVarginha(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-2 py-1 border border-emerald-300 bg-emerald-50 rounded font-bold text-emerald-800" />
            </div>
          </div>
        </header>

        {!dadosProntos && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-6 flex flex-col items-center justify-center text-center mb-8 h-80">
            <AlertCircle size={48} className="text-blue-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Aguardando Dados</h2>
            <p className="max-w-md">Preencha os valores da <strong>Bolsa</strong>, <strong>Dólar</strong> e pelo menos um <strong>Físico</strong> para analisar.</p>
          </div>
        )}

        {dadosProntos && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-950 p-4 rounded-xl border border-indigo-800">
                <span className="text-[10px] font-bold text-indigo-300 uppercase">Basis Cooxupé</span>
                <p className="text-2xl font-bold text-white">{calcBasis(precoCooxupe).toFixed(2)} ¢</p>
              </div>
              <div className="bg-indigo-950 p-4 rounded-xl border border-indigo-800">
                <span className="text-[10px] font-bold text-indigo-300 uppercase">Basis Coopercitrus</span>
                <p className="text-2xl font-bold text-white">{calcBasis(precoCoopercitrus).toFixed(2)} ¢</p>
              </div>
              <div className="bg-indigo-950 p-4 rounded-xl border border-indigo-800">
                <span className="text-[10px] font-bold text-indigo-300 uppercase">Basis Varginha</span>
                <p className="text-2xl font-bold text-white">{calcBasis(precoVarginha).toFixed(2)} ¢</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">Comparativo de Preços Regional (R$/sc)</h3>
              <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 65, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="nome" axisLine={false} tickLine={false} interval={0} height={60} />
                    <YAxis axisLine={false} tickLine={false} domain={['dataMin - 150', 'dataMax + 100']} width={65} tickFormatter={(val) => Math.round(val).toString()} />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                    <ReferenceLine y={paridadeExportacaoBRL} stroke="#f59e0b" strokeDasharray="5 5" />
                    <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={60}>
                      {dadosGrafico.map((entry, index) => {
                        let color = '#94a3b8';
                        if (entry.tipo === 'bolsa') color = '#0ea5e9';
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

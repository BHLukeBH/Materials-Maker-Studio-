import React, { useState } from 'react';
import { Printer, RefreshCw } from 'lucide-react';
import { ScrambleItem } from '../types';

const ScrambleTool: React.FC = () => {
    const [title, setTitle] = useState('Sentence Scramble');
    const [inputText, setInputText] = useState('');
    const [items, setItems] = useState<ScrambleItem[]>([]);

    const handleGenerate = () => {
        const lines = inputText.split('\n').filter(line => line.trim().length > 0);
        
        const newItems: ScrambleItem[] = lines.map((line, idx) => {
            const words = line.trim().split(/\s+/);
            // Fisher-Yates Shuffle
            const scrambled = [...words];
            for (let i = scrambled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
            }
            return {
                id: idx,
                original: line,
                scrambled: scrambled
            };
        });

        setItems(newItems);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen pb-20">
             {/* Controls */}
            <div className="no-print bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Sentence Scramble</h2>
                        <p className="text-slate-500">Create unscramble worksheets for grammar practice.</p>
                    </div>
                    <button onClick={() => window.print()} disabled={items.length === 0} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                        <Printer size={20} /> Print Worksheet
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Worksheet Title</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Sentences (One per line)</label>
                            <textarea
                                className="w-full h-64 p-2 border rounded-lg resize-none"
                                placeholder="The cat sat on the mat.&#10;I like to eat apples.&#10;Where is the library?"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>
                        <button onClick={handleGenerate} className="w-full py-2 bg-bh-green text-white font-bold rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                            <RefreshCw size={20} /> Generate Worksheet
                        </button>
                    </div>

                    {/* Preview (Mini) */}
                    <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 overflow-hidden relative">
                         <h3 className="font-bold text-slate-400 mb-4 uppercase text-xs tracking-wider">Preview</h3>
                         <div className="bg-white p-6 shadow-sm border min-h-[300px] flex flex-col gap-6 scale-90 origin-top">
                            <div className="text-center font-serif font-bold text-xl border-b pb-4">{title}</div>
                            {items.length === 0 ? (
                                <div className="text-center text-slate-300 italic py-10">Add sentences to generate preview</div>
                            ) : (
                                items.slice(0, 3).map((item) => (
                                    <div key={item.id}>
                                        <div className="flex gap-2 mb-2 flex-wrap">
                                            <span className="font-bold mr-2">{item.id + 1}.</span>
                                            {item.scrambled.map((w, wi) => (
                                                <div key={wi} className="border border-slate-400 px-3 py-1 rounded bg-slate-50 text-sm">
                                                    {w}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-b border-slate-300 h-8"></div>
                                    </div>
                                ))
                            )}
                            {items.length > 3 && <div className="text-center text-slate-400 italic">... and {items.length - 3} more</div>}
                         </div>
                    </div>
                </div>
            </div>

            {/* Print View */}
             {items.length > 0 && (
                <div className="print-only w-full bg-white text-slate-900">
                    
                    {/* Page 1: Worksheet */}
                    <div className="p-8 min-h-screen relative page-break">
                        {/* Header */}
                        <div className="flex justify-between items-end border-b-2 border-slate-800 pb-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-bh-navy">{title}</h1>
                            </div>
                            <div className="flex gap-8 text-sm font-bold">
                                <div>Name: __________________________</div>
                                <div>Date: __________________________</div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-8">
                            {items.map((item) => (
                                <div key={item.id} className="break-inside-avoid">
                                    {/* Word Blocks */}
                                    <div className="flex flex-wrap gap-3 mb-4 items-center">
                                        <span className="font-bold text-lg mr-2 w-6">{item.id + 1}.</span>
                                        {item.scrambled.map((w, wi) => (
                                            <div key={wi} className="border-2 border-slate-700 px-4 py-2 rounded-lg bg-white font-comic text-lg shadow-sm">
                                                {w}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Writing Lines - Primary School Style */}
                                    <div className="pl-8 pr-4">
                                        <div className="h-12 border-b-2 border-slate-800 flex flex-col justify-end">
                                            <div className="border-b border-dashed border-slate-400 h-1/2 w-full mb-2"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                         {/* Footer Logo */}
                        <div className="fixed bottom-4 right-4 opacity-50">
                            <img src="logo.png" onError={(e) => e.currentTarget.style.display = 'none'} alt="BH Logo" className="h-8" />
                        </div>
                    </div>

                    {/* Page 2: Answer Key */}
                    <div className="p-8 min-h-screen relative">
                        <div className="flex justify-between items-end border-b-2 border-slate-800 pb-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-bh-navy">{title}</h1>
                                <h2 className="text-xl font-bold text-slate-500 mt-2">- ANSWER KEY -</h2>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 text-lg">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <span className="font-bold text-slate-500 w-8 text-right">{item.id + 1}.</span>
                                    <span className="font-serif border-b border-slate-200 w-full pb-1">{item.original}</span>
                                </div>
                            ))}
                        </div>

                         <div className="fixed bottom-4 right-4 opacity-50">
                            <img src="logo.png" onError={(e) => e.currentTarget.style.display = 'none'} alt="BH Logo" className="h-8" />
                        </div>
                    </div>

                </div>
             )}
        </div>
    );
};

export default ScrambleTool;

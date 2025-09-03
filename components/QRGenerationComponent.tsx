// 'use client';

// import React, { useState, useRef } from 'react';
// import QRCode from 'react-qr-code';
// import QRCodeLib from 'qrcode';
// import { jsPDF } from 'jspdf';
// import {
//     QrCode, Download, Check, RotateCcw, Upload
    
//  } from 'lucide-react';
// import html2canvas from 'html2canvas';

// const QRGenerationComponent = () => {
//     const [selectedBatch, setSelectedBatch] = useState('');
//     const [quantity, setQuantity] = useState(10);
//     const [generatedCodes, setGeneratedCodes] = useState(false);
//     const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//     const [isGenerating, setIsGenerating] = useState(false);

//     // Mock batch data

//     const batches = [
//         { id: 'BAT12345', name: 'Amoxicillin 500mg' },
//         { id: 'BAT23456', name: 'Paracetamol 650mg' },
//         { id: 'BAT34567', name: 'Lisinopril 10mg' },
//         { id: 'BAT45678', name: 'Metformin 500mg' },
//         { id: 'BAT56789', name: 'Atorvastatin 20mg' }
//     ];

//     const [unitCodes, setUnitCodes] = useState<string[]>([]);

//     const [batchCode, setBatchCode] = useState('');

//     const handleGenerate = () => {
//         if (!selectedBatch) return;

//         setIsGenerating(true);

//         // Simulate generation process
//         setTimeout(() => {
//             // Generate mock QR data
//             const batchQR = `batch-${selectedBatch}-${Date.now()}`;
//             const unitQRs = Array.from({ length: quantity }, (_, i) => `unit-${selectedBatch}-${i + 1}-${Date.now()}`);

//             setBatchCode(batchQR);
//             setUnitCodes(unitQRs);
//             setGeneratedCodes(true);
//             setShowSuccessMessage(true);
//             setIsGenerating(false);

//             setTimeout(() => setShowSuccessMessage(false), 3000);
//         }, 1000);
//     };

//     const handleReset = () => {
//         setSelectedBatch('');
//         setQuantity(10);
//         setGeneratedCodes(false);
//         setBatchCode('');
//         setUnitCodes([]);
//     };
    

//     const handleDownloadAll = async () => {

//         const pdf = new jsPDF('p', 'mm', 'a4', true); // Enable compression

//         const batch = batches.find(b => b.id === selectedBatch);
//         const batchName = batch ? batch.name : selectedBatch;

//         // Create a hidden container for rendering
//         const hiddenContainer = document.createElement('div');
//         hiddenContainer.style.position = 'absolute';
//         hiddenContainer.style.top = '-9999px';
//         hiddenContainer.style.left = '-9999px';
//         document.body.appendChild(hiddenContainer);

//         // ✅ Add Batch QR on first page
//         hiddenContainer.innerHTML = '';
//         const batchContainer = document.createElement('div');
//         batchContainer.style.width = '600px';
//         batchContainer.style.height = '800px';
//         batchContainer.style.padding = '30px';
//         batchContainer.style.backgroundColor = '#fff';
//         batchContainer.style.textAlign = 'center';
//         batchContainer.style.display = 'flex';
//         batchContainer.style.flexDirection = 'column';
//         batchContainer.style.justifyContent = 'center';
//         batchContainer.style.alignItems = 'center';

//         const batchTitle = document.createElement('div');
//         batchTitle.style.fontSize = '28px';
//         batchTitle.style.fontWeight = 'bold';
//         batchTitle.style.marginBottom = '20px';
//         batchTitle.innerText = `Batch: ${batchName}`;

//         const batchQrCanvas = document.createElement('canvas');
//         await QRCodeLib.toCanvas(batchQrCanvas, selectedBatch, { width: 200 });

//         batchContainer.appendChild(batchTitle);
//         batchContainer.appendChild(batchQrCanvas);
//         hiddenContainer.appendChild(batchContainer);

//         // Convert Batch page
//         let canvas = await html2canvas(batchContainer, { scale: 1 });
//         let imgData = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
//         pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

//         // ✅ Add Unit Pages
//         for (let i = 0; i < unitCodes.length; i++) {
//             hiddenContainer.innerHTML = '';

//             const container = document.createElement('div');
//             container.style.width = '600px';
//             container.style.height = '800px';
//             container.style.padding = '30px';
//             container.style.backgroundColor = '#fff';
//             container.style.textAlign = 'center';
//             container.style.display = 'flex';
//             container.style.flexDirection = 'column';
//             container.style.justifyContent = 'center';
//             container.style.alignItems = 'center';

//             const unitLabel = document.createElement('div');
//             unitLabel.style.fontSize = '20px';
//             unitLabel.style.marginBottom = '15px';
//             unitLabel.innerText = `Unit ${i + 1} of ${quantity}`;

//             const qrCanvas = document.createElement('canvas');
//             await QRCodeLib.toCanvas(qrCanvas, unitCodes[i], { width: 150 });

//             const codeText = document.createElement('div');
//             codeText.style.fontSize = '16px';
//             codeText.style.color = '#555';
//             codeText.innerText = unitCodes[i];

//             container.appendChild(unitLabel);
//             container.appendChild(qrCanvas);

//             hiddenContainer.appendChild(container);

//             // Convert to canvas & add to PDF
//             canvas = await html2canvas(container, { scale: 1 });
//             imgData = canvas.toDataURL('image/jpeg', 0.7);
//             pdf.addPage();
//             pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
//         }

//         document.body.removeChild(hiddenContainer);
//         pdf.save(`batch-${selectedBatch}-all-units.pdf`);
//     };


//     // ✅ CSV Export
//     const handleExportCSV = () => {
//         const headers = ['Type', 'Code'];
//         const rows = [
//             ['Batch', batchCode],
//             ...unitCodes.map(code => ['Unit', code])
//         ];
//         const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.setAttribute('href', url);
//         link.setAttribute('download', `batch-${selectedBatch}-qrcodes.csv`);
//         link.click();
//     };


//     return (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//             <div className="p-4 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-800">QR Code Generation</h2>
//                 <p className="text-sm text-gray-600 mt-1">
//                     Generate and download QR codes for product units
//                 </p>
//             </div>

//             <div className="p-6">
//                 {showSuccessMessage && (
//                     <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
//                         <Check size={20} className="mr-2" />
//                         QR codes successfully generated!
//                     </div>
//                 )}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {/* Left: Settings */}
//                     <div>
//                         <h3 className="text-md font-semibold mb-4">Generation Settings</h3>
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">Select Batch</label>
//                                 <select
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                                     value={selectedBatch}
//                                     onChange={e => setSelectedBatch(e.target.value)}
//                                 >
//                                     <option value="">Select a batch</option>
//                                     {batches.map(batch => (
//                                         <option key={batch.id} value={batch.id}>
//                                             {batch.id} - {batch.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Number of Codes to Generate
//                                 </label>
//                                 <input
//                                     type="number"
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                                     value={quantity}
//                                     onChange={e => setQuantity(parseInt(e.target.value) || 0)}
//                                     min="1"
//                                     max="100"
//                                 />
//                             </div>

//                             <div className="pt-4">
//                                 <button
//                                     onClick={handleGenerate}
//                                     disabled={!selectedBatch || quantity <= 0 || isGenerating}
//                                     className={`w-full px-4 py-2 rounded-md font-medium flex items-center justify-center
//                     ${!selectedBatch || quantity <= 0 || isGenerating ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
//                                 >
//                                     {isGenerating ? (
//                                         <>
//                                             <div className="spinner mr-2"></div>
//                                             Generating...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <QrCode size={18} className="mr-2" />
//                                             Generate Codes
//                                         </>
//                                     )}
//                                 </button>

//                                 {generatedCodes && (
//                                     <button
//                                         onClick={handleReset}
//                                         className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
//                                     >
//                                         <RotateCcw size={18} className="mr-2" />
//                                         Reset & Generate New Codes
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right: Preview & Download */}
//                     <div>
//                         <h3 className="text-md font-semibold mb-4">Preview & Download</h3>

//                         {!generatedCodes ?
//                             (
//                                 <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center text-gray-500">
//                                     <QrCode size={48} strokeWidth={1} />
//                                     <p className="mt-4">Select a batch and generate codes to preview</p>
//                                 </div>
//                             )
//                             :
//                             (
//                                 <div>
//                                     <div className="bg-gray-50 rounded-lg p-4 mb-4">
//                                         {/* Batch QR Code */}
//                                         <div className="text-center mb-6">
//                                             <p className="font-medium text-lg mb-2">Batch QR Code</p>
//                                             <QRCode value={batchCode} size={128} />
//                                             <p className="text-sm text-gray-600 mt-1">{selectedBatch}</p>
//                                         </div>

//                                         {/* Units */}
//                                         <div>
//                                             <div className="flex justify-between items-center mb-3">
//                                                 <p className="font-medium">Unit QR Codes</p>
//                                                 <button
//                                                     onClick={handleDownloadAll}
//                                                     className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
//                                                 >
//                                                     <Download size={14} className="mr-1" />
//                                                     Download All
//                                                 </button>
//                                                 <button
//                                                     onClick={handleExportCSV}
//                                                     className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
//                                                 >
//                                                     <Upload size={16} className="mr-1" />
//                                                     Export CSV
//                                                 </button>
//                                             </div>
                                            

//                                             <div className="grid grid-cols-3 gap-4 overflow-y-auto h-[50vh]">
//                                                 {unitCodes.map((code, index) => (
//                                                     <div
//                                                         key={index}
//                                                         className="flex flex-col items-center p-2 border rounded bg-white"
//                                                     >
//                                                         <QRCode value={code} size={80} />
//                                                         <p className="text-xs text-gray-500 mt-1">Unit {index + 1}</p>
                                        
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )
//                         }
//                     </div>
//                 </div>
//             </div>

//             <style jsx>{`
//         .spinner {
//           border: 2px solid #f3f3f3;
//           border-top: 2px solid #3498db;
//           border-radius: 50%;
//           width: 16px;
//           height: 16px;
//           animation: spin 1s linear infinite;
//         }
        
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}
//             </style>
//         </div>
//     );
// };

// export default QRGenerationComponent;


'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import QRCodeLib from 'qrcode';
import { jsPDF } from 'jspdf';
import { QrCode, Download, Check, RotateCcw, Upload } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';

type Batch = {
    id: string;
    batchId: string;      // token generated in POST /api/batches
    drugName: string;
    batchSize: number;
    manufacturingDate: string;
    expiryDate: string;
};

type Unit = {
    id: string;
    batchId: string;
    serialNumber: string;
    createdAt: string;
};

const QRGenerationComponent = () => {

    const [batches, setBatches] = useState<Batch[]>([]);

    const [selectedBatchId, setSelectedBatchId] = useState('');

    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

    const [units, setUnits] = useState<Unit[]>([]);

    const [quantity, setQuantity] = useState(0);

    const [generatedCodes, setGeneratedCodes] = useState(false);

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const [isGenerating, setIsGenerating] = useState(false);

    const [loadingBatches, setLoadingBatches] = useState(false);

    useEffect(() => {

        const getAllBatches = async () => {
            try {
                setLoadingBatches(true);
                const res = await fetch('/api/batches', { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch batches');
                const formattedResponse = await res.json();
                const data: Batch[] = formattedResponse;
                setBatches(data);
            }
            catch (e) {
                toast.error(e instanceof Error ? e.message : String(e));
            }
            finally {
                setLoadingBatches(false);
            }
        };

        getAllBatches();

    }, []);

    // When dropdown changes, record the selected batch (but don't fetch units yet)

    useEffect(() => {
        const getAllUnitsUnderSelectedBatch = async () => {
            const b = batches.find(batch => batch.id === selectedBatchId) || null;
            setSelectedBatch(b);
            const res = await fetch(`/api/batches/${selectedBatchId}/units`, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch batches');
            const formattedUnitsResponse = await res.json();
            // 
            setQuantity(formattedUnitsResponse.length)
        };

        getAllUnitsUnderSelectedBatch();
    }, [selectedBatchId]);

    const handleGenerate = async () => {
        if (!selectedBatch) return;
        setIsGenerating(true);
        try {
            // Fetch the units for the selected batch
            const res = await fetch(`/api/batches/${selectedBatch.id}/units`, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch units');
            const data: Unit[] = await res.json();
            setUnits(data);
            setQuantity(data.length); // lock to actual unit count
            setGeneratedCodes(true);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 2500);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReset = () => {
        setSelectedBatchId('');
        setSelectedBatch(null);
        setUnits([]);
        setQuantity(0);
        setGeneratedCodes(false);
    };

    const handleDownloadAll = async () => {
        if (!selectedBatch) return;

        const pdf = new jsPDF('p', 'mm', 'a4', true);
        // Hidden container to avoid Tailwind/oklch parsing
        const hiddenContainer = document.createElement('div');
        hiddenContainer.style.position = 'absolute';
        hiddenContainer.style.top = '-9999px';
        hiddenContainer.style.left = '-9999px';
        document.body.appendChild(hiddenContainer);

        // First page: Batch QR (value = batch.batchId token from DB)
        hiddenContainer.innerHTML = '';
        const batchContainer = document.createElement('div');
        batchContainer.style.width = '600px';
        batchContainer.style.height = '800px';
        batchContainer.style.padding = '30px';
        batchContainer.style.backgroundColor = '#fff';
        batchContainer.style.textAlign = 'center';
        batchContainer.style.display = 'flex';
        batchContainer.style.flexDirection = 'column';
        batchContainer.style.justifyContent = 'center';
        batchContainer.style.alignItems = 'center';

        const batchTitle = document.createElement('div');
        batchTitle.style.fontSize = '28px';
        batchTitle.style.fontWeight = 'bold';
        batchTitle.style.marginBottom = '20px';
        batchTitle.innerText = `Batch: ${selectedBatch.drugName}`;

        const batchQrCanvas = document.createElement('canvas');
        await QRCodeLib.toCanvas(batchQrCanvas, selectedBatch.batchId, { width: 200 });

        batchContainer.appendChild(batchTitle);
        batchContainer.appendChild(batchQrCanvas);
        hiddenContainer.appendChild(batchContainer);

        let canvas = await html2canvas(batchContainer, { scale: 1, backgroundColor: '#ffffff' });
        let imgData = canvas.toDataURL('image/jpeg', 0.7);
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

        // Unit pages
        for (let i = 0; i < units.length; i++) {
            hiddenContainer.innerHTML = '';
            const container = document.createElement('div');
            container.style.width = '600px';
            container.style.height = '800px';
            container.style.padding = '30px';
            container.style.backgroundColor = '#fff';
            container.style.textAlign = 'center';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.justifyContent = 'center';
            container.style.alignItems = 'center';

            const unitLabel = document.createElement('div');
            unitLabel.style.fontSize = '20px';
            unitLabel.style.marginBottom = '15px';
            unitLabel.innerText = `Unit ${i + 1} of ${units.length}`;

            const qrCanvas = document.createElement('canvas');
            // Encode the real unit serialNumber (from DB)
            await QRCodeLib.toCanvas(qrCanvas, units[i].serialNumber, { width: 150 });

            container.appendChild(unitLabel);
            container.appendChild(qrCanvas);
            hiddenContainer.appendChild(container);

            canvas = await html2canvas(container, { scale: 1, backgroundColor: '#ffffff' });
            imgData = canvas.toDataURL('image/jpeg', 0.7);
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        }

        document.body.removeChild(hiddenContainer);
        pdf.save(`batch-${selectedBatch.batchId}-all-units.pdf`);
    };

    const handleExportCSV = () => {
        if (!selectedBatch) return;
        const headers = ['Type', 'Code'];
        const rows: string[][] = [
            ['Batch', selectedBatch.batchId],
            ...units.map(u => ['Unit', u.serialNumber]),
        ];
        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `batch-${selectedBatch.batchId}-qrcodes.csv`);
        link.click();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">QR Code Generation</h2>
                <p className="text-sm text-gray-600 mt-1">
                    Generate and download QR codes for existing product batches
                </p>
            </div>

            <div className="p-6">
                {showSuccessMessage && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
                        <Check size={20} className="mr-2" />
                        QR codes loaded from batch successfully!
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Settings */}
                    <div>
                        <h3 className="text-md font-semibold mb-4">Generation Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Select Batch</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    value={selectedBatchId}
                                    onChange={e => setSelectedBatchId(e.target.value)}
                                    disabled={loadingBatches}
                                >
                                    <option value="">{loadingBatches ? 'Loading…' : 'Select a batch'}</option>
                                    {batches.map(b => (
                                        <option key={b.id} value={b.id}>
                                            {b.drugName} — {b.batchId.slice(0, 8)}…
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Number of Codes
                                </label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    value={quantity}
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    This matches the number of units created for the selected batch.
                                </p>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleGenerate}
                                    disabled={!selectedBatchId || isGenerating}
                                    className={`w-full px-4 py-2 rounded-md font-medium flex items-center justify-center
                    ${!selectedBatchId || isGenerating ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="spinner mr-2"></div>
                                            Loading from DB…
                                        </>
                                    ) : (
                                        <>
                                            <QrCode size={18} className="mr-2" />
                                            Generate Codes
                                        </>
                                    )}
                                </button>

                                {generatedCodes && (
                                    <button
                                        onClick={handleReset}
                                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    >
                                        <RotateCcw size={18} className="mr-2" />
                                        Reset & Select Another Batch
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Preview & Download */}
                    <div>
                        <h3 className="text-md font-semibold mb-4">Preview & Download</h3>

                        {!generatedCodes ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center text-gray-500">
                                <QrCode size={48} strokeWidth={1} />
                                <p className="mt-4">Select a batch and click “Generate Codes”.</p>
                            </div>
                        ) : (
                            <div>
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    {/* Batch QR Code */}
                                    {selectedBatch && (
                                        <div className="text-center mb-6">
                                            <p className="font-medium text-lg mb-2">Batch QR Code</p>
                                            <QRCode value={selectedBatch.batchId} size={128} />
                                            <p className="text-sm text-gray-600 mt-1">{selectedBatch.drugName}</p>
                                        </div>
                                    )}

                                    {/* Units */}
                                    <div>
                                        <div className="flex flex-wrap gap-2 items-center justify-between mb-3">
                                            <p className="font-medium">Unit QR Codes</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleDownloadAll}
                                                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                                                >
                                                    <Download size={14} className="mr-1" />
                                                    Download All
                                                </button>
                                                <button
                                                    onClick={handleExportCSV}
                                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
                                                >
                                                    <Upload size={14} className="mr-1" />
                                                    Export CSV
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 overflow-y-auto h-[50vh]">
                                            {units.map((u, idx) => (
                                                <div key={u.id} className="flex flex-col items-center p-2 border rounded bg-white">
                                                    <QRCode value={u.serialNumber} size={80} />
                                                    <p className="text-xs text-gray-500 mt-1">Unit {idx + 1}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .spinner {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default QRGenerationComponent;

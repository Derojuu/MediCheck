'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import QRCodeLib from 'qrcode';
import { jsPDF } from 'jspdf';
import { QrCode, Download, Check, Upload } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import { MedicationBatchInfoProps, MedicationUnitProp } from '@/utils';


const QRGenerationComponent = ({ allBatches }: {allBatches: MedicationBatchInfoProps[] }) => {

    const [batches, setBatches] = useState<MedicationBatchInfoProps[]>(allBatches);

    const [selectedBatchId, setSelectedBatchId] = useState('');

    const [selectedBatch, setSelectedBatch] = useState<MedicationBatchInfoProps | null>(null);

    const [units, setUnits] = useState<MedicationUnitProp[]>([]);

    const [quantity, setQuantity] = useState<number>(0);

    const [generatedCodes, setGeneratedCodes] = useState(false);

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        console.log(selectedBatchId)
        setQuantity(batches.find(b => b.id === selectedBatchId)?._count.medicationUnits || 0);
        setSelectedBatch(batches.find(b => b.id === selectedBatchId) || null);
    }, [selectedBatchId])

    // When dropdown changes, record the selected batch (but don't fetch units yet)

    const handleGenerate = async () => {
        if (!selectedBatch) return;
        setIsGenerating(true);
        try {
            // Fetch the units for the selected batch
            const res = await fetch(`/api/batches/${selectedBatch.id}/units`, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch units');
            const data: MedicationUnitProp[] = await res.json();
            setUnits(data);
            setGeneratedCodes(true);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 2500);
        }
        catch (e) {
            toast.error(e instanceof Error ? e.message : String(e));
        }
        finally {
            setIsGenerating(false);
        }
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
                    <div
                        className={`
                            mb-6 bg-green-50 border border-green-200text-green-700 px-4 py-3 rounded flex items-center`
                        }
                    >
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
                                >
                                    <option value="">Select a batch</option>
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
                                        ${!selectedBatchId || isGenerating ?
                                            'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            :
                                            'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`
                                        }
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
                            </div>
                        </div>
                    </div>

                    {/* Right: Preview & Download */}
                    <div>
                        <h3 className="text-md font-semibold mb-4">Preview & Download</h3>

                        {!generatedCodes ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center text-gray-500">
                                <QrCode size={48} strokeWidth={1} />
                                <p className="mt-4 text-center">Select a batch and click “Generate Codes”.</p>
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

                                        <div className="grid grid-cols-3 gap-4 overflow-y-auto h-[50vh] items-start">
                                            {units.map((u, idx) => (
                                                <div
                                                    key={u.id}
                                                    className="flex flex-col items-center text-center p-2 border rounded bg-white"
                                                >
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

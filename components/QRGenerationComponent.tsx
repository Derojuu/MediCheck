import React, { useState, Component } from 'react'
import {
    QrCode,
    Download,
    Copy,
    Printer,
    Upload,
    Check,
    Smartphone,
    Package,
    X,
} from 'lucide-react';

const QRGenerationComponent = () => {
    const [selectedBatch, setSelectedBatch] = useState('')
    const [quantity, setQuantity] = useState(100)
    const [generatedCodes, setGeneratedCodes] = useState<boolean>(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    // Mock batch data
    const batches = [
        {
            id: 'BAT12345',
            name: 'Amoxicillin 500mg',
        },
        {
            id: 'BAT23456',
            name: 'Paracetamol 650mg',
        },
        {
            id: 'BAT34567',
            name: 'Lisinopril 10mg',
        },
        {
            id: 'BAT45678',
            name: 'Metformin 500mg',
        },
        {
            id: 'BAT56789',
            name: 'Atorvastatin 20mg',
        },
    ]
    const handleGenerate = () => {
        // In a real app, this would call an API to generate QR codes
        setGeneratedCodes(true)
        setShowSuccessMessage(true)
        setTimeout(() => {
            setShowSuccessMessage(false)
        }, 3000)
    }
    const handleReset = () => {
        setSelectedBatch('')
        setQuantity(100)
        setGeneratedCodes(false)
    }
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                    QR/NFC Code Generation
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Generate secure, blockchain-linked QR codes and NFC tags for your
                    batches
                </p>
            </div>
            <div className="p-6">
                {showSuccessMessage && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
                        <Check size={20} className="mr-2" />
                        QR and NFC codes successfully generated and linked to the blockchain
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-md font-semibold mb-4">Generation Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Select Batch
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                >
                                    <option value="">Select a batch</option>
                                    {batches.map((batch) => (
                                        <option key={batch.id} value={batch.id}>
                                            {batch.id} - {batch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Number of Codes to Generate
                                </label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                    min="1"
                                    max="10000"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Generate between 1 and 10,000 codes at once
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Code Type
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded text-blue-600 mr-2"
                                            checked
                                        />
                                        <span>QR Codes</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded text-blue-600 mr-2"
                                            checked
                                        />
                                        <span>NFC Tags</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Security Level
                                </label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                                    <option value="high">High - 256-bit encryption</option>
                                    <option value="medium">Medium - 128-bit encryption</option>
                                    <option value="standard">Standard - 64-bit encryption</option>
                                </select>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={handleGenerate}
                                    disabled={!selectedBatch || quantity <= 0}
                                    className={`w-full px-4 py-2 rounded-md font-medium flex items-center justify-center
                    ${!selectedBatch || quantity <= 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
                                >
                                    <QrCode size={18} className="mr-2" />
                                    Generate Codes
                                </button>
                                {generatedCodes && (
                                    <button
                                        onClick={handleReset}
                                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        Reset & Generate New Codes
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-md font-semibold mb-4">Preview & Download</h3>
                        {!generatedCodes ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center text-gray-500">
                                <QrCode size={48} strokeWidth={1} />
                                <p className="mt-4">
                                    Select a batch and generate codes to preview
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">Batch: {selectedBatch}</p>
                                        <p className="text-sm text-gray-600">
                                            {quantity} codes generated
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Blockchain linked: Yes
                                        </p>
                                    </div>
                                    <div className="bg-white p-2 border border-gray-200 rounded-md">
                                        <QrCode size={64} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center">
                                        <Download size={16} className="mr-1" />
                                        Download PDF
                                    </button>
                                    <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center">
                                        <Copy size={16} className="mr-1" />
                                        Copy to Clipboard
                                    </button>
                                    <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center">
                                        <Printer size={16} className="mr-1" />
                                        Print Codes
                                    </button>
                                    <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center">
                                        <Upload size={16} className="mr-1" />
                                        Export CSV
                                    </button>
                                </div>
                                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start">
                                    <Smartphone size={20} className="text-blue-600 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-800">
                                            NFC Tags Ready for Programming
                                        </p>
                                        <p className="text-xs text-blue-600">
                                            Use the MediVerify NFC Programmer app to program your
                                            physical NFC tags
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {generatedCodes && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex items-center mb-2 sm:mb-0">
                            <Package size={18} className="text-gray-600 mr-2" />
                            <span className="text-sm text-gray-600">
                                <span className="font-medium">{quantity}</span> codes are ready
                                for application to products
                            </span>
                        </div>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center">
                            <Check size={16} className="mr-1" />
                            Mark as Applied
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}


export default QRGenerationComponent;

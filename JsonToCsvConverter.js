import React, { useState } from 'react';
import Papa from 'papaparse';
import { Shield, Lock, Server } from 'lucide-react';

const JsonToCsvConverter = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Function to flatten nested JSON objects for CSV conversion
  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  // Main conversion function
  const convertJsonToCsv = (jsonContent) => {
    try {
      const jsonData = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
      const flattenedData = dataArray.map(item => flattenObject(item));
      
      const csv = Papa.unparse(flattenedData, {
        quotes: true,
        skipEmptyLines: true,
        header: true
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'converted_data.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Error converting JSON to CSV: ' + err.message);
      setSuccess(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      convertJsonToCsv(text);
    } catch (err) {
      setError('Error reading file: ' + err.message);
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">JSON to CSV Converter</h1>
        <p className="text-gray-600">Convert your JSON files to CSV format securely and privately</p>
      </div>

      {/* Privacy and Security Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="font-semibold text-blue-800 mb-3 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Data Privacy & Security Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <Lock className="w-5 h-5 mt-1 mr-2 text-blue-600" />
            <p className="text-sm text-gray-700">
              Your data remains private. All conversion happens directly in your browser - no data is ever uploaded to or stored on any servers.
            </p>
          </div>
          <div className="flex items-start">
            <Server className="w-5 h-5 mt-1 mr-2 text-blue-600" />
            <p className="text-sm text-gray-700">
              This is a client-side tool. Your JSON data never leaves your device during the conversion process.
            </p>
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />
        <p className="text-gray-600">Drop your JSON file here or click to upload</p>
        <p className="text-sm text-gray-500 mt-2">Files are processed locally in your browser</p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg">
          Successfully converted! The CSV file will download automatically.
        </div>
      )}

      {/* Additional Information */}
      <div className="text-sm text-gray-500 mt-4">
        <p>
          This tool converts JSON data to CSV format entirely within your web browser. 
          The conversion process is completely offline and your data never touches any external servers. 
          For large files, processing might take a few moments depending on your device's capabilities.
        </p>
      </div>
    </div>
  );
};

export default JsonToCsvConverter;
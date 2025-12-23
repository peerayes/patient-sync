'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

export default function TestDBPage() {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [error, setError] = useState<string | null>(null);
  const [tableExists, setTableExists] = useState<boolean>(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Check if we can connect
      setStatus('Testing Supabase connection...');

      const { data, error: queryError } = await supabase
        .from('patients')
        .select('*')
        .limit(1);

      if (queryError) {
        if (queryError.message.includes('relation') || queryError.message.includes('does not exist')) {
          setStatus('Connected! But table "patients" does not exist yet.');
          setTableExists(false);
          setError(`Error: ${queryError.message}`);
        } else {
          setStatus('Connection failed!');
          setError(`Error: ${queryError.message}`);
        }
      } else {
        setStatus('Successfully connected to Supabase!');
        setTableExists(true);
        setError(null);
      }
    } catch (err: any) {
      setStatus('Connection error!');
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className={`p-4 rounded-lg ${error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            <p className={`font-medium ${error ? 'text-red-800' : 'text-green-800'}`}>
              {status}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Details:</h3>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold">SUPABASE_URL:</span>
              <span className="text-gray-600">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">SUPABASE_ANON_KEY:</span>
              <span className="text-gray-600">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
              </span>
            </div>
            {process.env.NEXT_PUBLIC_SUPABASE_URL && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
              </div>
            )}
          </div>
        </div>

        {!tableExists && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              Next Steps: Create the patients table
            </h3>
            <p className="text-sm text-yellow-700 mb-4">
              Go to your Supabase Dashboard → SQL Editor and run this SQL:
            </p>
            <pre className="bg-white p-4 rounded text-xs overflow-x-auto border border-yellow-300">
{`CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,

  -- Personal Information
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,

  -- Contact Information
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,

  -- Additional Information
  preferred_language TEXT,
  nationality TEXT,
  religion TEXT,

  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'filling',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime
ALTER TABLE patients REPLICA IDENTITY FULL;`}
            </pre>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={testConnection}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Connection Again
          </button>
        </div>
      </div>
    </div>
  );
}

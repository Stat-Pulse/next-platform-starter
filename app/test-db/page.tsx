'use client';

     import { useEffect, useState } from 'react';

     interface User {
       id: number;
       name: string;
     }

     export default function TestDB() {
       const [data, setData] = useState<User[]>([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState<string | null>(null);

       useEffect(() => {
         async function fetchData() {
           try {
             const response = await fetch('/api/db/connect');
             const result = await response.json();
             if (result.success) {
               setData(result.data);
             } else {
               setError(result.error);
             }
           } catch (err) {
             setError('Failed to fetch data');
           } finally {
             setLoading(false);
           }
         }
         fetchData();
       }, []);

       return (
         <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
           <h1 className="text-3xl font-bold mb-6 text-blue-600">StatPulse DB Test</h1>
           {loading && <p className="text-gray-600">Loading...</p>}
           {error && <p className="text-red-500">Error: {error}</p>}
           {data.length > 0 && (
             <ul className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
               {data.map((user) => (
                 <li key={user.id} className="border-b py-2 last:border-b-0">
                   <p className="text-gray-800">
                     <span className="font-semibold">ID:</span> {user.id}
                   </p>
                   <p className="text-gray-800">
                     <span className="font-semibold">Name:</span> {user.name}
                   </p>
                 </li>
               ))}
             </ul>
           )}
           {data.length === 0 && !loading && !error && (
             <p className="text-gray-600">No data found.</p>
           )}
         </div>
       );
     }

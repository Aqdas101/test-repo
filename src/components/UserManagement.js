import React, { useState } from 'react';

/**
 * UserManagement Component
 * Patterns: Uses standard React hooks, modular styling, and Axios for API.
 */
const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com' }
  ]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  // FIXME: Clients requested a way to export this list to CSV for reporting.
  // The backend endpoint exists at /api/users/export but the frontend logic is missing.

  const handleExportCsv = async () => {
    setIsExporting(true);
    setExportError(null); // Clear any previous errors

    try {
      const response = await fetch('/api/users/export');

      if (!response.ok) {
        // Attempt to parse a more specific error message from the response body if available
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else {
            const errorText = await response.text();
            if (errorText) errorMessage += `: ${errorText}`;
          }
        } catch (jsonError) {
          const errorText = await response.text();
          if (errorText) errorMessage += `: ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv'; // Desired filename for the downloaded file
      document.body.appendChild(a); // Append the link to the document body
      a.click(); // Programmatically click the link to start the download
      a.remove(); // Remove the link from the document
      
      // Revoke the object URL to free up browser memory
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Failed to export users to CSV:', error);
      setExportError(error.message || 'An unexpected error occurred during export.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Directory</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add User
        </button>
        {/* TODO: Add Export Button Here */}
        <button
          onClick={handleExportCsv}
          className={`px-4 py-2 rounded ${isExporting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export to CSV'}
        </button>
      </div>
      {exportError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded border border-red-400">
          Error: {exportError}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API calls

/**
 * UserManagement Component
 * Patterns: Uses standard React hooks, modular styling, and Axios for API.
 */
const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com' }
  ]);

  // State to manage loading indicator for the export button
  const [isLoadingExport, setIsLoadingExport] = useState(false);

  // FIXME: Clients requested a way to export this list to CSV for reporting.
  // The backend endpoint exists at /api/users/export but the frontend logic is missing.

  /**
   * Handles the click event for the "Export to CSV" button.
   * Fetches user data as a CSV blob from the API and triggers a file download.
   */
  const handleExportCsv = async () => {
    setIsLoadingExport(true);
    let objectUrl; // Declare here to ensure it's accessible in finally for revocation

    try {
      // Make a GET request to the export endpoint using Axios.
      // responseType: 'blob' tells Axios to expect a binary response (like a file).
      const response = await axios.get('/api/users/export', {
        responseType: 'blob',
      });

      // Axios, by default, throws an error for any status code outside the 2xx range.
      // If we reach here, the response status was in the 2xx range (e.g., 200 OK).
      
      const blob = response.data; // response.data is directly the Blob object
      const filename = 'users.csv'; // Desired filename for the downloaded file

      // Create a temporary URL for the Blob object
      objectUrl = URL.createObjectURL(blob);

      // Programmatically create an anchor element to trigger the download
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename; // Set the download attribute to specify the filename

      // Append the link to the document body, simulate a click, and then remove it.
      // This approach works across most browsers to initiate a file download.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error exporting users to CSV:', error);
      let errorMessage = 'Failed to export users.';
      
      // Provide more specific error messages if it's an Axios error
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage += ` Server responded with status ${error.response.status}.`;
          // If the server sent a text/JSON error message, it would be in error.response.data (as ArrayBuffer/Blob)
          // For simplicity, not attempting to parse it here, just using status.
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage += ' No response received from server. Please check your network connection.';
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage += ' An error occurred during request setup.';
        }
      } else {
        errorMessage += ' An unexpected error occurred.';
      }
      alert(errorMessage); // Simple alert for error notification, following basic error handling pattern
    } finally {
      setIsLoadingExport(false); // Always reset loading state
      // Revoke the object URL to free up memory, regardless of success or failure
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
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
        {/* Export to CSV Button */}
        <button
          onClick={handleExportCsv}
          disabled={isLoadingExport} // Disable button while export is in progress
          className={`px-4 py-2 rounded ${
            isLoadingExport
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed' // Styling for loading state
              : 'bg-green-600 text-white hover:bg-green-700'  // Normal styling for export button
          }`}
        >
          {isLoadingExport ? 'Exporting...' : 'Export to CSV'}
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
import React, { useState } from 'react';
import axios from 'axios'; // Import Axios as per existing patterns

/**
 * UserManagement Component
 * Patterns: Uses standard React hooks, modular styling, and Axios for API.
 */
const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com' }
  ]);
  // State to manage loading status during export, improving UX.
  const [isLoadingExport, setIsLoadingExport] = useState(false);

  // FIXME: Clients requested a way to export this list to CSV for reporting.
  // The backend endpoint exists at /api/users/export but the frontend logic is missing.

  /**
   * handleExportPpt
   * Asynchronously handles the export of user data to a PPT file.
   * Makes a GET request to the /api/users/export endpoint using Axios,
   * then processes the binary response to trigger a file download in the browser.
   */
  const handleExportPpt = async () => {
    setIsLoadingExport(true); // Set loading state to true when export starts
    try {
      // Make API call using Axios. 'responseType: "blob"' is crucial for handling binary files.
      const response = await axios.get('/api/users/export', {
        responseType: 'blob' // Expect the response to be a binary blob (e.g., .ppt file)
      });

      // Check if the request was successful (HTTP status 200)
      if (response.status === 200) {
        // Axios automatically provides the blob data in `response.data` when `responseType: 'blob'`
        const blob = response.data; 
        
        // Create a temporary URL for the Blob object
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor (<a>) element to programmatically trigger the download
        const link = document.createElement('a');
        link.href = url;
        
        // Set the 'download' attribute to suggest a filename for the downloaded file
        // The backend can also suggest a filename via 'Content-Disposition' header
        link.setAttribute('download', 'users.ppt'); 
        
        // Append the link to the document body (necessary for Firefox to work reliably)
        document.body.appendChild(link);
        
        // Simulate a click on the link to initiate the file download
        link.click();
        
        // Clean up: Remove the temporary link element from the DOM
        document.body.removeChild(link);
        
        // Clean up: Revoke the object URL to release the memory allocated for the blob
        window.URL.revokeObjectURL(url);
        
        console.log('User list exported successfully to users.ppt');
      } else {
        // Handle cases where the server responds with a non-200 status
        console.error(`Export failed: Server responded with status ${response.status} - ${response.statusText}`);
        alert('Failed to export users. Please try again.'); // Provide user feedback
      }
    } catch (error) {
      // Catch and handle any errors that occur during the API request or response processing
      console.error('Error during user export:', error);
      if (axios.isAxiosError(error)) {
        // Specific Axios error handling
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Server error data:', error.response.data);
          alert(`Export failed: ${error.response.statusText || 'Server error'}.`);
        } else if (error.request) {
          // The request was made but no response was received (e.g., network error)
          console.error('No response received from server:', error.request);
          alert('Export failed: No response from server. Check your network connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Axios request setup error:', error.message);
          alert('Export failed: Client error during request setup.');
        }
      } else {
        // Handle any non-Axios related errors
        alert('An unexpected error occurred during export.');
      }
    } finally {
      setIsLoadingExport(false); // Reset loading state when the operation completes (success or failure)
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
        {/* New button to trigger the export functionality */}
        <button 
          onClick={handleExportPpt} 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoadingExport} // Disable button while export is in progress
        >
          {isLoadingExport ? 'Exporting...' : 'Export to PPT'}
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
import React, { useState } from 'react';
import axios from 'axios'; // Import Axios as per project pattern for API calls

/**
 * UserManagement Component
 * Patterns: Uses standard React hooks, modular styling, and Axios for API.
 */
const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com' }
  ]);

  // FIXME: Clients requested a way to export this list to CSV for reporting.
  // The backend endpoint exists at /api/users/export but the frontend logic is missing.

  /**
   * Handles the export of user data to a Markdown file.
   * Makes an API call to /api/users/export and triggers a file download.
   */
  const handleExport = async () => {
    try {
      // Make a GET request to the export endpoint.
      // Set responseType to 'blob' to handle binary file responses correctly.
      const response = await axios.get('/api/users/export', {
        responseType: 'blob'
      });

      // Retrieve the Content-Type header from the response.
      // Axios automatically lowercases headers.
      const contentType = response.headers['content-type'];

      // Check if the received content type indicates a Markdown file.
      // The task specifically requests text/markdown.
      if (contentType && contentType.includes('text/markdown')) {
        // response.data is already a Blob object due to `responseType: 'blob'`.
        const blob = response.data;

        // Create a temporary URL for the Blob object.
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor (<a>) element to trigger the download.
        const link = document.createElement('a');
        link.href = url;
        // Set the 'download' attribute to specify the filename for the downloaded file.
        link.setAttribute('download', 'user_list.md'); 

        // Programmatically click the link to initiate the download.
        // Appending to body ensures wider browser compatibility.
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the temporary link element.

        // Revoke the object URL to release browser memory once the download is triggered.
        window.URL.revokeObjectURL(url);
      } else {
        // Handle cases where the server sends an unexpected content type.
        console.error('Export failed: Unexpected content type received:', contentType);
        alert('Failed to export users: Received an unexpected file type from the server.');
      }
    } catch (error) {
      console.error('Error exporting users:', error);
      // Provide basic user feedback for export failures.
      alert('Failed to export users. Please check your network and try again.');
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
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export to Markdown
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
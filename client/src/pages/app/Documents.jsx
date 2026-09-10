import { useEffect, useState } from 'react';
import { getDocuments, uploadDocument } from '../../services/documentService';

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const loadDocuments = () => {
    getDocuments()
      .then((res) => setDocuments(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('employeeId', employeeId);
    formData.append('title', title);
    formData.append('file', file);

    try {
      await uploadDocument(formData);
      setEmployeeId('');
      setTitle('');
      setFile(null);
      loadDocuments();
    } catch (err) {
      alert('Failed to upload document');
    }
  };

  return (
    <div>
      <h1>Documents</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <input
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Title</th>
            <th>File</th>
            <th>Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((d) => (
            <tr key={d.id}>
              <td>{d.employee?.firstName} {d.employee?.lastName}</td>
              <td>{d.title}</td>
              <td>
                <a
                  href={`http://localhost:5000/uploads/${d.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {d.fileName}
                </a>
              </td>
              <td>{new Date(d.uploadedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Documents;
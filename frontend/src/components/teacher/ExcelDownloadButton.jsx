import axiosClient from '../../api/axiosClient';

export default function ExcelDownloadButton({ sectionId }) {
  if (!sectionId) return null;

  const handleDownload = async () => {
    try {
      const response = await axiosClient.get(`/excel/download?sectionId=${sectionId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `section_${sectionId}_students.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download Excel file');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Download Section Excel
    </button>
  );
}

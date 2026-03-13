import React, { useRef, useState } from 'react';

const ACCEPTED = '.pdf,.doc,.docx,.txt,.csv';

const RagUploadModal = ({ show, onClose, isUploading, uploadError, hasRagDocument, handleRagUpload, clearUploadError }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file) => {
    clearUploadError();
    setSelectedFile(file || null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    const success = await handleRagUpload(selectedFile);
    if (success) {
      setSelectedFile(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    clearUploadError();
    onClose();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />

      {/* Modal — click on the overlay (outside modal-content) closes it */}
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1050 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ragModalLabel"
        onClick={handleClose}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content shadow-lg">
            {/* Header */}
            <div className="modal-header border-bottom">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-database-add fs-5" style={{ color: '#601db1' }}></i>
                <h5 className="modal-title mb-0 fw-semibold" id="ragModalLabel">
                  Upload RAG Document
                </h5>
                {hasRagDocument && (
                  <span className="badge rounded-pill ms-1" style={{ backgroundColor: '#601db1', fontSize: '0.65rem' }}>
                    Active
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
                disabled={isUploading}
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              <p className="text-body-secondary small mb-3">
                Upload a document to extend the AI's knowledge base with your own content.
                Accepted formats: <strong>PDF, DOCX, DOC, TXT, CSV</strong>.
              </p>

              {/* Drop zone */}
              <div
                className={`border rounded-3 p-4 text-center position-relative ${isDragging ? 'border-primary border-2' : 'border-dashed'}`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: isDragging ? 'rgba(var(--bs-primary-rgb), 0.05)' : 'var(--bs-body-bg)',
                  transition: 'border-color 0.15s, background-color 0.15s',
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED}
                  className="d-none"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  disabled={isUploading}
                />

                {selectedFile ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-file-earmark-text fs-4 text-primary"></i>
                    <div className="text-start">
                      <div className="fw-medium small">{selectedFile.name}</div>
                      <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <button
                      className="btn-close ms-2"
                      style={{ fontSize: '0.6rem' }}
                      onClick={(e) => { e.stopPropagation(); handleFileChange(null); }}
                      disabled={isUploading}
                    />
                  </div>
                ) : (
                  <div className="text-body-secondary">
                    <i className="bi bi-cloud-upload fs-3 d-block mb-2"></i>
                    <span className="small">
                      {isDragging ? 'Release to attach' : 'Drag & drop or click to choose a file'}
                    </span>
                  </div>
                )}
              </div>

              {/* Error */}
              {uploadError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mt-3 mb-0 py-2 small">
                  <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                  {uploadError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer border-top">
              <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={handleClose}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm text-white"
                style={{ backgroundColor: '#601db1', borderColor: '#601db1' }}
                onClick={handleSubmit}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cloud-upload me-1"></i>
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RagUploadModal;

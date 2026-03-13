import { useState } from 'react';
import { ragService } from '../services/api.service';
import { useAuth } from './useAuth';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.csv'];

export const useRag = () => {
  const { user, token } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [hasRagDocument, setHasRagDocument] = useState(false);

  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const mimeOk = ALLOWED_MIME_TYPES.includes(file.type);
    const extOk = ALLOWED_EXTENSIONS.includes(ext);

    if (!mimeOk && !extOk) {
      return `Tipo de arquivo não permitido. Use: ${ALLOWED_EXTENSIONS.join(', ')}`;
    }
    return null;
  };

  const handleRagUpload = async (file) => {
    setUploadError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return false;
    }

    setIsUploading(true);
    try {
      await ragService.uploadDocument(file, user.id, token);
      setHasRagDocument(true);
      return true;
    } catch (err) {
      setUploadError(err.message || 'Erro ao enviar documento');
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const clearUploadError = () => setUploadError(null);

  return {
    isUploading,
    uploadError,
    hasRagDocument,
    handleRagUpload,
    clearUploadError,
  };
};

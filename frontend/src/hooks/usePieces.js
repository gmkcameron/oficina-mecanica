import { useEffect, useState } from 'react';
import {
  getPieces,
  createPiece,
  updatePiece,
  deletePiece,
} from '../api/pieceApi';

const usePieces = () => {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadPieces = async () => {
    try {
      setLoading(true);
      const response = await getPieces();
      setPieces(response.data);
    } catch (err) {
      setError('Não foi possível carregar as peças.');
    } finally {
      setLoading(false);
    }
  };

  const savePiece = async (payload, id = null) => {
    if (id) {
      await updatePiece(id, payload);
    } else {
      await createPiece(payload);
    }
    await loadPieces();
  };

  const removePiece = async (id) => {
    await deletePiece(id);
    await loadPieces();
  };

  useEffect(() => {
    loadPieces();
  }, []);

  return {
    pieces,
    loading,
    error,
    reload: loadPieces,
    savePiece,
    removePiece,
  };
};

export default usePieces;

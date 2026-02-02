import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { gql, useMutation } from '@apollo/client';
import { Star, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(createReviewInput: $input) {
      id
      rating
      content
    }
  }
`;

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, listingId, listingTitle, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [createReview, { loading }] = useMutation(CREATE_REVIEW_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({
        variables: {
          input: {
            listingId,
            rating,
            content,
          },
        },
      });
      setContent('');
      setRating(5);
      onClose();
      if (onSuccess) onSuccess();
      
      // Celebration for points
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5A5F', '#00A699', '#FC642D', '#FFD700']
      });
      
    } catch (err) {
      console.error(err);
      alert('Error al crear la reseña');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-ink">Calificar tu estadía</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-muted mb-6">
              ¿Qué te pareció tu estadía en <span className="font-bold text-ink">{listingTitle}</span>?
            </p>

            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>

              <textarea
                className="w-full p-4 border border-gray-200 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                placeholder="Comparte tu experiencia..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Publicando...' : 'Publicar Reseña'}
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  details?: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = 'Erro de Autenticação',
  message,
  details
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={onClose}
          className="relative z-50"
        >
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                duration: 0.2,
                ease: [0.4, 0.0, 0.2, 1]
              }}
            >
              <DialogPanel className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-900/20 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <DialogTitle className="text-lg font-semibold text-white">
                      {title}
                    </DialogTitle>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-2">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {message}
                  </p>
                  {details && (
                    <div className="mt-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 font-mono">
                        {details}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-700">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      // Opcional: limpar campos ou fazer outra ação
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </DialogPanel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

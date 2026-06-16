// src/features/product-delete/ui/delete-product-button.tsx

import { Button } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal";
import { deleteProduct, useAppDispatch } from "@/store";
import type { ProductId } from "@/types";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface DeleteProductButtonProps {
  productId: ProductId | string;
  productName: string;
  onDeleted?: () => void;
}

export const DeleteProductButton: React.FC<DeleteProductButtonProps> = ({ productId, productName, onDeleted }) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteProduct(productId as ProductId)).unwrap();
      toast.success(`Товар «${productName}» удалён`);
      setIsModalOpen(false);
      onDeleted?.();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Не удалось удалить товар";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="text-red-600 border-red-300 hover:bg-red-50 focus:ring-red-500"
        aria-label={`Удалить товар ${productName}`}
      >
        Удалить
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Подтверждение удаления" closeButtonLabel="Закрыть">
        <div className="space-y-4">
          <p>
            Вы уверены, что хотите удалить товар <strong>«{productName}»</strong>? Это действие необратимо.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isDeleting}>
              Отмена
            </Button>
            <Button variant="primary" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

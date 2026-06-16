// src/features/shop-delete/ui/delete-shop-button.tsx

import { Button, Modal } from "@/shared/ui";
import { deleteShop, useAppDispatch } from "@/store";
import type { ShopId } from "@/types";
import { useState } from "react";
import { toast } from "react-toastify";

interface DeleteShopButtonProps {
  shopId: ShopId | string;
  shopName: string;
  onDeleted?: () => void;
}

export const DeleteShopButton: React.FC<DeleteShopButtonProps> = ({ shopId, shopName, onDeleted }) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteShop(shopId as ShopId)).unwrap();
      toast.success(`Магазин «${shopName}» удалён`);
      setIsModalOpen(false);
      onDeleted?.();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Не удалось удалить магазин";
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
        aria-label={`Удалить магазин ${shopName}`}
      >
        Удалить
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Подтверждение удаления" closeButtonLabel="Закрыть">
        <div className="space-y-4">
          <p>
            Вы уверены, что хотите удалить магазин <strong>«{shopName}»</strong>?<br />
            Все товары этого магазина также будут удалены. Это действие необратимо.
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

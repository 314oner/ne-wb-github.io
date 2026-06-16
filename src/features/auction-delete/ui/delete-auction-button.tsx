// src/features/auction-delete/ui/delete-auction-button.tsx

import { Button, Modal } from "@/shared/ui";
import { deleteAuction, useAppDispatch } from "@/store";
import type { Auction } from "@/types";
import { useState } from "react";
import { toast } from "react-toastify";

interface DeleteAuctionButtonProps {
  auction: Auction;
  onDeleted?: () => void;
}

export const DeleteAuctionButton: React.FC<DeleteAuctionButtonProps> = ({ auction, onDeleted }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await dispatch(deleteAuction(auction._id)).unwrap();
      toast.success(`Аукцион «${auction.itemName}» удалён`);
      setOpen(false);
      onDeleted?.();
    } catch {
      toast.error("Не удалось удалить аукцион");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label={`Удалить аукцион ${auction.itemName}`}
      >
        Удалить
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Подтверждение удаления" closeButtonLabel="Закрыть">
        <div className="space-y-4">
          <p>
            Вы уверены, что хотите удалить аукцион <strong>«{auction.itemName}»</strong>? Это действие необратимо.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Отмена
            </Button>
            <Button variant="primary" onClick={handleDelete} disabled={loading}>
              {loading ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

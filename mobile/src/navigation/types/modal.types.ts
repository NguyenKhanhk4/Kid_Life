import { Routes } from '../constants';

export type ModalStackParamList = {
  [Routes.Modal.Dialog]: {
    title: string;
    message: string;
  };
  [Routes.Modal.Confirmation]: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  };
  [Routes.Modal.ImagePreview]: {
    imageUrl: string;
  };
};

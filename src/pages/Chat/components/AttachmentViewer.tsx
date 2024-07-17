import { useAttachmentViewer } from "lib/hooks";
import Modal from "components/Modal";
import AttachementContent from "./AttachementContent";

const AttachmentViewer = () => {
  const { attachmentViewer, closeViewer } = useAttachmentViewer();
  if (!attachmentViewer.visible || !attachmentViewer.params?.attachment)
    return null;

  return (
    <Modal
      visible={attachmentViewer.visible}
      onClose={() => {
        closeViewer();
      }}
    >
      <AttachementContent
        className="rounded-md overflow-hidden aspect-auto max-w-2xl"
        attachment={attachmentViewer.params.attachment}
        autoPlay
      />
    </Modal>
  );
};

export default AttachmentViewer;

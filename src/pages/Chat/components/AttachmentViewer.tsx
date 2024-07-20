import { useAttachmentViewer } from "lib/hooks";
import Modal from "components/Modal";
import AttachementContent from "./AttachementContent";
import MsgText from "./MsgText";

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
      <div className="max-w-md px-10">
        <AttachementContent
          className="rounded-md aspect-auto max-h-[calc(100vh-350px)]"
          caption={attachmentViewer.params.caption}
          attachment={attachmentViewer.params.attachment}
          autoPlay
        />
        <div className="py-8">
          <div className="max-h-[170px] max-w-2xl overflow-x-hidden overflow-y-auto no-scrollbar">
            {attachmentViewer.params.caption && (
              <MsgText
                className="text-white"
                text={attachmentViewer.params.caption}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AttachmentViewer;

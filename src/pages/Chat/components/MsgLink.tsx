import Microlink from "@microlink/react";

type Props = {
  link: string;
};

const MsgLink = ({ link }: Props) => {
  return (
    <div className="pt-3 px-3 msg-link">
      <Microlink url={link} size="large" />
    </div>
  );
};

export default MsgLink;

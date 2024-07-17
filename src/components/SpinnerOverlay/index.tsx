import Loader from "../Loader";

const SpinnerOverlay = (props: { backdrop?: boolean }) => {
  const { backdrop } = props;
  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 h-full z-10">
      <div className="flex justify-center items-center h-full">
        <div role="status">
          <Loader size="lg" />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      {backdrop && (
        <div className="absolute top-0 right-0 left-0 bottom-0 h-full z-10 bg-[#00000080]" />
      )}
    </div>
  );
};

export default SpinnerOverlay;

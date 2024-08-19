import { useNavigate } from "react-router-dom";

import { Button } from "components/ui/button";

const NoMatch = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center space-y-6">
        <h4 className="font-bold text-xl">Page not found</h4>
        <p className="text-slate-600">
          Sorry, we could not find the page you are looking for.
        </p>
        <Button color="secondary" onClick={() => navigate("/chats")}>
          Go to chats
        </Button>
      </div>
    </div>
  );
};

export default NoMatch;

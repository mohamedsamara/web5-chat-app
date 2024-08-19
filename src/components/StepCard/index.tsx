import { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  title: string;
  subtitle: string;
};

const StepCard = ({ title, subtitle, children }: Props) => {
  return (
    <div className="space-y-8 bg-slate-50 p-10 rounded-lg">
      <div className="space-y-3">
        <h1 className="font-bold text-2xl">{title}</h1>
        <p className="text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default StepCard;

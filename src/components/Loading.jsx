import { MoonLoader } from "react-spinners";

export default function Loading({ loading, color = "#071942" }) {
  return (
    <div className="flex items-center h-auto justify-center flex-auto w-auto">
      <MoonLoader
        loading={loading}
        color={color}
        size={200}
        speedMultiplier={0.5}
      />
    </div>
  );
}

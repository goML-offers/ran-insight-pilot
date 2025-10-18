import { DashboardHeader } from "@/components/DashboardHeader";
import { CanvasView } from "@/components/CanvasView";
import { CoPilotPanel } from "@/components/CoPilotPanel";

const Index = () => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <CanvasView />
        </div>
        <div className="w-96 shrink-0">
          <CoPilotPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;

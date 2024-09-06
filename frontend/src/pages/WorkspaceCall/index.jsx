import React, { useEffect, useState } from "react";
import { default as WorkspaceCallContainer } from "@/components/WorkspaceCall";
import Sidebar from "@/components/Sidebar";
import { useParams } from "react-router-dom";
import Workspace from "@/models/workspace";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import { FineTuningAlert } from "../FineTuning/Banner";

export default function WorkspaceCall() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return <ShowWorkspaceCall />;
}

function ShowWorkspaceCall() {
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWorkspace() {
      if (!slug) return;
      const _workspace = await Workspace.bySlug(slug);
      if (!_workspace) {
        setLoading(false);
        return;
      }
      const suggestedMessages = await Workspace.getSuggestedMessages(slug);
      const pfpUrl = await Workspace.fetchPfp(slug);
      setWorkspace({
        ..._workspace,
        suggestedMessages,
        pfpUrl,
      });
      setLoading(false);
    }
    getWorkspace();
  }, []);

  return (
    <>
      <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
        {!isMobile && <Sidebar />}
        <WorkspaceCallContainer loading={loading} workspace={workspace} />
      </div>
      <FineTuningAlert />
    </>
  );
}

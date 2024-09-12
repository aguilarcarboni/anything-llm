import React from "react";
import DefaultChatContainer from "@/components/DefaultChat";
import Sidebar from "@/components/Sidebar";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import UserMenu from "@/components/UserMenu";

export default function Main() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <>
      <UserMenu>
        <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
          {!isMobile && <Sidebar />}
          <div className="flex w-screen h-full flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-white">Welcome to Athena.</h1>
          </div>
        </div>
      </UserMenu>
    </>
  );
}

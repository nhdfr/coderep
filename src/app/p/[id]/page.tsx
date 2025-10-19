"use client";

import React from "react";
import { useParams } from "next/navigation";
import CollabEditor from "@/components/CollabEditor";

export default function SharedPage() {
  const params = useParams();
  const rawId = params?.id || "shared";
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">shared buffer : {id}</h1>
        <p className="text-sm text-zinc-400 mb-4">Share this URL to let others edit the buffer in real-time.</p>
        <CollabEditor docId={id} language="javascript" />
      </div>
    </div>
  );
}

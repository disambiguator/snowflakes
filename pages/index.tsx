import dynamic from "next/dynamic";
import React from "react";

export default function Wash() {
  const Snowflake = dynamic(() => import("../snowflakes"), {
    ssr: false,
  });

  return <Snowflake />;
}

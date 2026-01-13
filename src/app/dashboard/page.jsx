"use client";

import React from "react";
import useSWR from "swr";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  // correct destructuring: `data` holds the session
  const { data: session, status } = useSession();

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    `https://jsonplaceholder.typicode.com/posts`,
    fetcher
  );

  // session can be undefined initially — check status
  console.log("session:", session, "status:", status);

  return <div className={styles.container}>Dashboard Page</div>;
};

export default Dashboard;

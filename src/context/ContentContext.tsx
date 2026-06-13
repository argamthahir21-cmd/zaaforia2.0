"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface ContentItem {
  key: string;
  value: string;
}

interface ContentContextType {
  contentMap: Record<string, string>;
  getContent: (key: string, defaultValue: string) => string;
  loading: boolean;
  refetch: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data: ContentItem[] = await res.json();
        const map: Record<string, string> = {};
        data.forEach((item) => {
          map[item.key] = item.value;
        });
        setContentMap(map);
      }
    } catch (err) {
      console.error("Failed to fetch site content:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const getContent = useCallback(
    (key: string, defaultValue: string) => {
      return contentMap[key] ?? defaultValue;
    },
    [contentMap]
  );

  return (
    <ContentContext.Provider value={{ contentMap, getContent, loading, refetch: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}

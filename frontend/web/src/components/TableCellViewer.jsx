import React from 'react';
export function TableCellViewer({ item }) {
  
  const headerContent = item.nome || item.header || "N/A";

  return (
    <div className="font-medium">
      {headerContent}
    </div>
  );
}

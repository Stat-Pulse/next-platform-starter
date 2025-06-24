// components/Card.tsx
/** @jsxImportSource react */
import React, { ReactNode } from 'react';
import type { ReactElement } from 'react';

interface CardProps {
  title: string;
  value?: string;
  children?: ReactNode;
}

export default function Card({ title, value, children }: CardProps): ReactElement {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {value && <p className="text-gray-600 mb-2">{value}</p>}
      <div>{children}</div>
    </div>
  );
}
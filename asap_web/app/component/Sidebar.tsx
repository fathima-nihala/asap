
'use client';
import React, { useState } from 'react';

export default function Sidebar() {
  const [selectedItem, setSelectedItem] = useState('Basic Information');

  const menuItems = [
    'Basic Information',
    'Education',
    'Career Objective',
    'Key Skills',
    'Resume/Portfolio',
    'Preferences',
    'Work Experience',
    'Additional Documents'
  ];

  return (
    <aside className="w-full p-4 h-screen">
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 p-2 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className={`w-2 h-2 rounded-full border ${
                selectedItem === item ? 'border-purple-600 border-2 h-3 w-3' : 'border-gray-300'
              }`} />
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
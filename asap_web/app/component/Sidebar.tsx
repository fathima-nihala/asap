'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Basic Information', path: '/home' },
    { name: 'Education', path: '/education' },
    { name: 'Career Objective', path: '/career-objective' },
    { name: 'Key Skills', path: '/key-skills' },
    { name: 'Resume/Portfolio', path: '/resume-portfolio' },
    { name: 'Preferences', path: '/preferences' },
    { name: 'Work Experience', path: '/work-experience' },
    { name: 'Additional Documents', path: '/additional-documents' }
  ];

  return (
    <aside className="w-full p-4 h-screen">
      <nav>
        <ul className="space-y-1">
          {menuItems.map(({ name, path }) => (
            <li key={name}>
              <Link href={path} className="flex items-center gap-3 p-2 cursor-pointer">
                <div
                  className={`w-2 h-2 rounded-full border ${
                    pathname === path ? 'border-purple-600 border-2 h-3 w-3' : 'border-gray-300'
                  }`}
                />
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

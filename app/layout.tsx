import './globals.css';

     export const metadata = {
       title: 'StatPulse Analytics',
       description: 'Fantasy sports and analytics platform',
     };

     export default function RootLayout({
       children,
     }: {
       children: React.ReactNode;
     }) {
       return (
         <html lang="en">
           <body>{children}</body>
         </html>
       );
     }

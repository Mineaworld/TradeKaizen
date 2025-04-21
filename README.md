# TradeKaizen

TradeKaizen is a modern web application built with Next.js 14, featuring a sophisticated trading platform with a focus on continuous improvement and efficiency - inspired by the Kaizen philosophy.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Real-time Trading Interface**: Powered by Supabase for real-time data
- **Responsive Design**: Beautiful UI components using Radix UI
- **Drag and Drop**: Intuitive drag-and-drop functionality with dnd-kit
- **Authentication**: Secure authentication system using Supabase Auth
- **Dark Mode Support**: Built-in theme switching with next-themes
- **Interactive Charts**: Data visualization using Recharts
- **Form Handling**: Robust form management with React Hook Form and Zod validation

## 🧭 Navigation Structure

The application follows a clean, intuitive routing structure:

- `/home` - Landing page and main dashboard
- `/dashboard` - Trading dashboard and analytics
- `/strategies` - Trading strategies management
- `/journal` - Trading journal entries
- `/calendar` - Schedule and important dates
- `/analytics` - Detailed performance analytics
- `/resources` - Trading resources and documentation
- `/notes` - Personal trading notes
- `/login` - User authentication
- `/register` - New user registration

To ensure the application redirects to the home page by default, you'll need to update your `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Git

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/TradeKaizen.git
cd TradeKaizen
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the necessary environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
TradeKaizen/
├── app/                # Next.js 14 app directory
├── components/         # Reusable UI components
├── contexts/          # React Context providers
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and shared logic
├── public/           # Static assets
├── types/            # TypeScript type definitions
├── styles/           # Global styles and Tailwind config
└── supabase/         # Supabase related configurations
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run analyze-db` - Analyze database schema

## 🎨 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Authentication**: Supabase Auth
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/TradeKaizen](https://github.com/yourusername/TradeKaizen)

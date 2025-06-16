# VMS Fullstack Application

A modern, full-stack web application built with Next.js 15, React 19, and TypeScript, featuring a robust authentication system and MongoDB integration made for Kalpabriksha-Nepal

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 15, React 19, and TypeScript
- **Authentication**: Secure user authentication using NextAuth.js
- **Database**: MongoDB integration with Mongoose ODM
- **UI Components**: Beautiful UI components using Radix UI
- **Form Handling**: Advanced form management with React Hook Form and Zod validation
- **Styling**: Modern styling with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm or yarn
- MongoDB (local or Atlas instance)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Anand-Chaudhary/jms_fullstack.git
cd jms_fullstack
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
```

## 🚀 Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
src/
├── app/          # Next.js app directory (pages and layouts)
├── components/   # Reusable UI components
├── context/      # React context providers
├── lib/          # Utility functions and configurations
├── models/       # MongoDB models
├── schemas/      # Zod validation schemas
└── types/        # TypeScript type definitions
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests (when implemented)

## 🔧 Tech Stack

- **Frontend Framework**: Next.js 15
- **UI Library**: React 19
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI
- **Form Management**: React Hook Form + Zod
- **Styling**: Tailwind CSS
- **Theme**: next-themes
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Notifications**: Sonner

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Anand Chaudhary - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- All contributors who have helped shape this project

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <Card className="max-w-lg w-full bg-slate-800 border-slate-700">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="mb-6">
            <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              404
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => router.back()}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              asChild
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700">
            <p className="text-sm text-slate-500">
              Need help? Check out our{' '}
              <Link href="/#docs" className="text-blue-400 hover:text-blue-300 underline">
                documentation
              </Link>
              {' '}or{' '}
              <a 
                href="https://github.com/yourusername/devflow-ai/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                report an issue
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

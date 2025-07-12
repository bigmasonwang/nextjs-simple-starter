import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build Your SaaS Product Faster
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The complete starter kit with authentication, payments, and database ready to go. 
            Focus on your product, not the infrastructure.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground">
              Built with modern tools and best practices
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔐 Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Secure authentication with multiple providers, session management, and user profiles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💳 Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stripe integration with subscriptions, one-time payments, and webhook handling.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🗄️ Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Prisma ORM with PostgreSQL, migrations, and type-safe database operations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎨 UI Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Beautiful shadcn/ui components with dark mode and customizable themes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚡ Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Next.js 14 with App Router, server components, and optimized bundle size.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔧 Developer Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  TypeScript, ESLint, Prettier, and comprehensive documentation included.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Launch Your SaaS?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Stop building the same features over and over. Start with a solid foundation.
          </p>
          <Button size="lg" className="text-lg px-8">
            Start Building Today
          </Button>
        </div>
      </section>
    </div>
  );
}

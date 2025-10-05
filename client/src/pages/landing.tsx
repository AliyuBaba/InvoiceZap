import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-bolt text-primary-foreground text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-foreground">ZapInvoice</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <Link href="/invoice">
                <Button data-testid="button-get-started">Get Started</Button>
              </Link>
            </nav>
            <button className="md:hidden" data-testid="button-mobile-menu">
              <i className="fas fa-bars text-foreground"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Professional Invoices in
            <span className="text-primary"> Seconds</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Generate beautiful, branded invoices for your business or freelance work. 
            No account required, all data stays on your device.
          </p>
          <div className="flex justify-center">
            <Link href="/invoice">
              <Button size="lg" className="text-lg font-medium" data-testid="button-create-invoice">
                Create Your First Invoice
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20" id="features">
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <i className="fas fa-shield-alt text-primary text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
            <p className="text-muted-foreground">
              All your data stays on your device. No servers, no tracking, complete privacy.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <i className="fas fa-mobile-alt text-primary text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fully Responsive</h3>
            <p className="text-muted-foreground">
              Works perfectly on desktop, tablet, and mobile devices with touch support.
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <i className="fas fa-file-pdf text-primary text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional PDFs</h3>
            <p className="text-muted-foreground">
              Export branded, print-ready PDFs with your logo and custom styling.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center" id="privacy">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Your Privacy Matters
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            ZapInvoice is built with privacy in mind. All your company profiles, invoice templates, 
            and data are stored locally in your browser. Nothing is sent to external servers. 
            You have complete control over your information.
          </p>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 ZapInvoice. Built with privacy in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

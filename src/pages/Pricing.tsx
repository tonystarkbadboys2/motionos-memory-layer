import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Check, ArrowLeft } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out MotionOS",
      features: [
        "1,000 memories/month",
        "Basic API access",
        "7-day memory retention",
        "Community support",
        "1 project",
      ],
      cta: "Get Started",
      ctaLink: "/auth?mode=signup",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For developers building production apps",
      features: [
        "50,000 memories/month",
        "Full API access",
        "Unlimited retention",
        "Priority support",
        "Unlimited projects",
        "AI chat integration",
        "Webhooks",
        "Custom decay rates",
      ],
      cta: "Start Free Trial",
      ctaLink: "/auth?mode=signup",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For teams with advanced needs",
      features: [
        "Unlimited memories",
        "Dedicated infrastructure",
        "SLA guarantee",
        "24/7 support",
        "Custom integrations",
        "On-premise option",
        "SSO/SAML",
        "Compliance (HIPAA, SOC2)",
      ],
      cta: "Contact Sales",
      ctaLink: "mailto:enterprise@motionos.dev",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-mono">MotionOS</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/docs" className="text-sm font-mono text-muted-foreground hover:text-foreground">
              Docs
            </Link>
            <Button asChild size="sm" className="font-mono">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-mono text-sm">Back to home</span>
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold font-mono mb-4">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground font-mono max-w-xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-panel rounded-xl p-8 relative ${
                plan.popular ? "border-primary/50 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-mono">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-xl font-bold font-mono mb-2">{plan.name}</h3>
              <p className="text-muted-foreground font-mono text-sm mb-4">
                {plan.description}
              </p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold font-mono">{plan.price}</span>
                <span className="text-muted-foreground font-mono">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="font-mono text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                asChild 
                className="w-full font-mono"
                variant={plan.popular ? "default" : "outline"}
              >
                <Link to={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-mono text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: "What counts as a memory?",
                a: "A memory is any piece of information stored via the API. This includes user preferences, conversation context, facts, or any structured data you want your AI to remember."
              },
              {
                q: "What happens when I hit my limit?",
                a: "You'll receive a 429 error. We'll notify you before you hit 80% of your limit. You can upgrade anytime without losing data."
              },
              {
                q: "Can I export my data?",
                a: "Yes, all plans include full data export. Your data is yours."
              },
              {
                q: "Is there a free trial for Pro?",
                a: "Yes! Pro includes a 14-day free trial with full access to all features. No credit card required to start."
              },
            ].map((faq, i) => (
              <div key={i} className="glass-panel rounded-xl p-6">
                <h3 className="font-bold font-mono mb-2">{faq.q}</h3>
                <p className="font-mono text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

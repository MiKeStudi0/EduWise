import Image from "next/image"; // Replaced standard img
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Developer at Google",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    content: "CodeForge's structured learning path helped me transition from marketing to software engineering in 6 months. The practice problems prepared me perfectly for technical interviews.",
    rating: 5,
  },
  {
    name: "Michael Torres",
    role: "Full Stack Engineer at Stripe",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "The best coding platform I've used. Clean interface, great problems, and the explanations are top-notch. Solved over 500 problems here before my interviews.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Software Engineer at Meta",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "I love how CodeForge combines tutorials with practice. Unlike other platforms, it doesn't feel cluttered. The dark mode is perfect for late-night coding sessions.",
    rating: 5,
  },
];

const companies = [
  { name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" },
  { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/200px-Meta_Platforms_Inc._logo.svg.png" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/200px-Microsoft_logo.svg.png" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/200px-Netflix_2015_logo.svg.png" },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by developers worldwide
          </h2>
          <p className="text-muted-foreground">
            Join thousands of developers who've accelerated their careers with CodeForge.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              
              <div className="flex gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 relative z-10">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Companies */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-8">
            Our learners work at top companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company) => (
              <div key={company.name} className="relative h-6 sm:h-8 w-24">
                <Image
                  src={company.logo}
                  alt={company.name}
                  fill
                  className="object-contain grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
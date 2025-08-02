"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { MessageCircle, Zap, CheckCircle, Bot, Users, ArrowRight, Star } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(".hero-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })

      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" },
      )

      gsap.fromTo(".hero-cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" })

      // Features animation
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Stats animation
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // CTA section animation
      gsap.fromTo(
        ".cta-content",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Floating animation for hero elements
      gsap.to(".floating", {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Instant Support",
      description: "Get immediate responses to your questions with our lightning-fast support system.",
      cta: "Get Help Now",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: "Many Issues Resolved",
      description: "Join thousands of users who have successfully resolved their issues through our platform.",
      cta: "Browse Solutions",
    },
    {
      icon: <Bot className="w-8 h-8 text-purple-500" />,
      title: "AI-Assisted Answers",
      description: "Our intelligent system provides smart suggestions and automated responses.",
      cta: "Try AI Help",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Questions Answered" },
    { number: "95%", label: "Resolution Rate" },
    { number: "< 2 min", label: "Average Response Time" },
    { number: "24/7", label: "Support Available" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 lg:py-32"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Ask any question, <span className="text-primary">our support agent</span> will help you
            </h1>
            <p className="hero-subtitle text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get instant, professional support for all your questions. Our intelligent system connects you with the
              right answers quickly and efficiently.
            </p>
            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/ask" className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Ask a Question</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                <Link href="/tickets">Browse Tickets</Link>
              </Button>
            </div>
          </div>

          {/* Floating elements */}
          <div className="floating absolute top-20 left-10 w-16 h-16 bg-primary/10 rounded-full hidden lg:block"></div>
          <div
            className="floating absolute top-40 right-20 w-12 h-12 bg-purple-500/10 rounded-full hidden lg:block"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="floating absolute bottom-20 left-1/4 w-8 h-8 bg-green-500/10 rounded-full hidden lg:block"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose QuickDesk?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of customer support with our innovative features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="feature-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Link href="/ask">{feature.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-600">See why users love our support platform</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-item text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-2xl lg:text-3xl font-medium text-gray-900 mb-6">
              "QuickDesk transformed our support experience. The AI-assisted answers and instant responses have
              significantly improved our customer satisfaction."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Sarah Johnson</div>
                <div className="text-gray-600">Customer Success Manager</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="cta-content">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied users and experience the future of customer support today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/ask" className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Ask Your First Question</span>
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/tickets">Explore Tickets</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

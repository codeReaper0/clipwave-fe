"use client";
import Link from "next/link";
import React, {useState, useEffect} from "react";
import {
  FaPlay,
  FaUpload,
  FaHeart,
  FaComment,
  FaShare,
  FaUser,
  FaUsers,
  FaChartLine,
  FaDollarSign,
} from "react-icons/fa";
import {
  MdSmartphone,
  MdCloudUpload,
  MdSpeed,
  MdAttachMoney,
} from "react-icons/md";
import Cookie from "js-cookie";

// Define TypeScript interfaces
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface VideoCardProps {
  id: number;
  title: string;
  creator: string;
  likes: number;
  comments: number;
  shares: number;
}

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

// Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl hover:bg-opacity-70 transition-all duration-300 hover:-translate-y-1">
    <div className="text-blue-500 text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

// Video Card Component
const VideoCard: React.FC<VideoCardProps> = ({
  title,
  creator,
  likes,
  comments,
  shares,
}) => (
  <div className="bg-gray-800 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105">
    <div className="relative">
      <div className="bg-gradient-to-r from-purple-900 to-blue-800 aspect-[9/16] w-full flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 animate-pulse" />
        </div>
        <button className="absolute bottom-4 right-4 bg-red-500 rounded-full p-3 hover:bg-red-600 transition-colors">
          <FaPlay />
        </button>
      </div>
    </div>
    <div className="p-4">
      <h4 className="font-bold truncate">{title}</h4>
      <p className="text-sm text-gray-400 mb-3">@{creator}</p>
      <div className="flex justify-between text-sm">
        <div className="flex items-center space-x-1 text-gray-300">
          <FaHeart className="text-red-500" /> <span>{likes}K</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-300">
          <FaComment className="text-blue-400" /> <span>{comments}K</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-300">
          <FaShare className="text-green-400" /> <span>{shares}K</span>
        </div>
      </div>
    </div>
  </div>
);

// Testimonial Component
const Testimonial: React.FC<TestimonialProps> = ({
  name,
  role,
  content,
  avatar,
}) => (
  <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
    <p className="text-gray-300 italic mb-4">{content}</p>
    <div className="flex items-center">
      <div className="bg-gray-700 border-2 border-dashed rounded-full w-12 h-12 mr-3" />
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
    </div>
  </div>
);

// Main Landing Page Component
const ClipWaveLanding: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = !!Cookie.get("token");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mock data for videos
  const videos: VideoCardProps[] = [
    {
      id: 1,
      title: "Morning Coffee Routine",
      creator: "coffeelover",
      likes: 245,
      comments: 32,
      shares: 18,
    },
    {
      id: 2,
      title: "Guitar Cover - Latest Hit",
      creator: "musicguru",
      likes: 512,
      comments: 87,
      shares: 42,
    },
    {
      id: 3,
      title: "Cooking Challenge",
      creator: "chefextra",
      likes: 387,
      comments: 56,
      shares: 29,
    },
    {
      id: 4,
      title: "Travel Vlog: Mountains",
      creator: "wanderlust",
      likes: 623,
      comments: 94,
      shares: 67,
    },
  ];

  // Mock testimonials
  const testimonials: TestimonialProps[] = [
    {
      name: "Alex Johnson",
      role: "Content Creator",
      content:
        "ClipWave has transformed how I connect with my audience. The analytics help me understand what works best!",
      avatar: "",
    },
    {
      name: "Sarah Chen",
      role: "Digital Marketer",
      content:
        "The engagement on ClipWave is incredible. Our brand saw a 40% increase in conversions after running a campaign here.",
      avatar: "",
    },
    {
      name: "Miguel Rodriguez",
      role: "Viewer",
      content:
        "I love how smooth the streaming is, even on my older phone. The algorithm always shows me content I enjoy!",
      avatar: "",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Navigation */}
      <nav
        className={`py-4 px-6 flex justify-between items-center sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-gray-900 bg-opacity-90 backdrop-blur-md" : ""
        }`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <FaPlay className="text-white" />
          </div>
          <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            ClipWave
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10">
          <Link
            href="#features"
            className="hover:text-blue-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-blue-400 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="hover:text-blue-400 transition-colors"
          >
            Testimonials
          </Link>
        </div>

        {/* Auth Buttons */}
        {isAuthenticated ? (
          <div className="hidden md:flex space-x-4">
            <Link
              href={"/home"}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Go to App
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex space-x-4">
            <Link
              href={"/login"}
              className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Log In
            </Link>
            <Link
              href={"/register"}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Sign Up Free
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 rounded-lg p-4 mt-2">
          <div className="flex flex-col space-y-3">
            <a
              href="#features"
              className="hover:text-blue-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-blue-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="hover:text-blue-400 transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="hover:text-blue-400 transition-colors"
            >
              Pricing
            </a>
            <div className="border-t border-gray-700 pt-3 mt-3 flex flex-col space-y-2">
              <button className="w-full py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Log In
              </button>
              <button className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all">
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            The Next Generation{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Short Video
            </span>{" "}
            Platform
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-lg">
            Upload, stream, and engage with a platform built for creators and
            viewers. Powered by your PHP backend and DigitalOcean
            infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all font-medium">
              Start Creating
            </button>
            <button className="px-8 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors font-medium">
              Watch Demo
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-3xl w-80 h-[520px] flex items-center justify-center relative overflow-hidden">
              {/* Mock video grid */}
              <div className="absolute inset-0 grid grid-cols-2 gap-2 p-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div
                    key={item}
                    className="bg-gray-800 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>

              {/* Floating video card */}
              <div className="relative z-10 w-64 bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-purple-800 to-blue-800 aspect-[9/16] flex items-center justify-center">
                  <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 animate-pulse" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-gray-700 border-2 border-dashed rounded-full w-8 h-8 mr-2" />
                      <span className="font-bold">@creator</span>
                    </div>
                    <button className="bg-red-500 hover:bg-red-600 rounded-full p-2 transition-colors">
                      <FaHeart />
                    </button>
                  </div>
                  <p className="text-sm">Check out my new video! #clipwave</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for Scale and Engagement
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ClipWave is engineered to handle massive traffic while providing a
            seamless experience for both creators and viewers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<MdSmartphone className="inline-block" />}
            title="Responsive Streaming"
            description="Adaptive bitrate streaming ensures smooth playback on any device, anywhere."
          />
          <FeatureCard
            icon={<FaUser className="inline-block" />}
            title="Creator Dashboard"
            description="Comprehensive analytics and tools to grow your audience."
          />
          <FeatureCard
            icon={<MdCloudUpload className="inline-block" />}
            title="Effortless Uploads"
            description="Batch processing and background uploads for creators."
          />
          <FeatureCard
            icon={<FaUsers className="inline-block" />}
            title="Community Engagement"
            description="Powerful interaction tools to build your following."
          />
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Optimized Cloud Architecture
          </h2>
          <p className="text-gray-300 mb-12">
            Leveraging your PHP backend and DigitalOcean infrastructure for cost
            efficiency and performance
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">PHP Backend</h3>
              <p className="text-gray-300">Robust API integration</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
              <div className="text-4xl mb-4">🌊</div>
              <h3 className="text-xl font-bold mb-2">DigitalOcean</h3>
              <p className="text-gray-300">Scalable infrastructure</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-2">Object Storage</h3>
              <p className="text-gray-300">Cost-effective media storage</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-2">Secure Permissions</h3>
              <p className="text-gray-300">Role-based access control</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How ClipWave Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A seamless experience for both content creators and viewers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl">
            <div className="text-5xl font-bold mb-4 text-blue-500">1</div>
            <h3 className="text-xl font-bold mb-2">Upload Content</h3>
            <p className="text-gray-300 mb-4">
              Creators upload videos with rich metadata through our optimized
              PHP backend
            </p>
            <div className="text-blue-500 text-3xl">
              <FaUpload />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl">
            <div className="text-5xl font-bold mb-4 text-purple-500">2</div>
            <h3 className="text-xl font-bold mb-2">Process & Optimize</h3>
            <p className="text-gray-300 mb-4">
              Videos are transcoded for all devices and stored on DigitalOcean
              Spaces
            </p>
            <div className="text-purple-500 text-3xl">
              <MdSpeed />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl">
            <div className="text-5xl font-bold mb-4 text-green-500">3</div>
            <h3 className="text-xl font-bold mb-2">Engage & Monetize</h3>
            <p className="text-gray-300 mb-4">
              Viewers discover content through personalized feeds and interact
              in real-time
            </p>
            <div className="text-green-500 text-3xl">
              <FaDollarSign />
            </div>
          </div>
        </div>
      </section>

      {/* Video Feed Preview */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience the Feed
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our algorithm showcases trending and personalized content
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear from creators and viewers who use ClipWave daily
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the Wave?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of creators and viewers on the most efficient short
            video platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-8 py-3 rounded-lg bg-white text-blue-600 font-bold hover:bg-gray-100 transition-colors">
              Create Account
            </button>
            <button className="px-8 py-3 rounded-lg bg-black bg-opacity-30 hover:bg-opacity-40 transition-colors font-medium">
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <FaPlay className="text-white text-sm" />
              </div>
              <span className="ml-2 text-xl font-bold">ClipWave</span>
            </div>
            <p className="text-gray-400">
              The next-generation short video platform built for scale and
              engagement.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  For Creators
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  For Viewers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  For Brands
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Legal
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} ClipWave. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ClipWaveLanding;

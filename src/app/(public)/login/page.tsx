'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { useLanguage } from '@/contexts/LanguageContext';

const LoginPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login attempt:', formData);
      // Here you would typically handle the actual login logic
    }, 2000);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Handle social login logic here
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Login Card */}
          <motion.div
            className="bg-card-bg border border-border rounded-2xl p-8 shadow-lg"
            whileHover={{ boxShadow: '0 0 20px rgba(209, 238, 68, 0.1)' }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1
                className="orbitron-title text-3xl font-bold text-foreground mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t('welcomeBack')}
              </motion.h1>
              <motion.p
                className="text-foreground/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t('signInToAccount')}
              </motion.p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <motion.button
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center space-x-3 bg-secondary hover:bg-accent hover:text-background border border-border rounded-xl py-3 px-4 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-5 h-5 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="font-medium">{t('continueWithGoogle')}</span>
              </motion.button>
              
              <motion.button
                onClick={() => handleSocialLogin('github')}
                className="w-full flex items-center justify-center space-x-3 bg-secondary hover:bg-accent hover:text-background border border-border rounded-xl py-3 px-4 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github size={20} />
                <span className="font-medium">{t('continueWithGithub')}</span>
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card-bg px-4 text-foreground/70">{t('orContinueWithEmail')}</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('emailAddress')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 ${
                      errors.email ? 'border-red-500' : 'border-border focus:border-accent'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-3 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 ${
                      errors.password ? 'border-red-500' : 'border-border focus:border-accent'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                  />
                  <span className="text-sm text-foreground/70">{t('rememberMe')}</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  {t('forgotPassword')}
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 text-background font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-background border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <>
                    <span>{t('signIn')}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-foreground/70">
                {t('dontHaveAccount')}{' '}
                <Link
                  href="/signup"
                  className="text-accent hover:text-accent/80 font-medium transition-colors"
                >
                  {t('signup')}
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
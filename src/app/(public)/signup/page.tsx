'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github, Check } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { useLanguage } from '@/contexts/LanguageContext';

const SignUpPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      console.log('Sign up attempt:', formData);
      // Here you would typically handle the actual registration logic
    }, 2000);
  };

  const handleSocialSignUp = (provider: string) => {
    console.log(`Sign up with ${provider}`);
    // Handle social sign up logic here
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^\w\s]/.test(password)) strength++;
    
    return strength;
  };

  const getPasswordStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength < 2) return { text: 'Weak', color: 'text-red-500' };
    if (strength < 4) return { text: 'Medium', color: 'text-yellow-500' };
    return { text: 'Strong', color: 'text-green-500' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Sign Up Card */}
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
                {t('createAccount')}
              </motion.h1>
              <motion.p
                className="text-foreground/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t('joinMarketplace')}
              </motion.p>
            </div>

            {/* Social Sign Up Buttons */}
            <div className="space-y-3 mb-6">
              <motion.button
                onClick={() => handleSocialSignUp('google')}
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
                onClick={() => handleSocialSignUp('github')}
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
                <span className="bg-card-bg px-4 text-foreground/70">{t('orCreateWithEmail')}</span>
              </div>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('firstName')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={20} />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 ${
                        errors.firstName ? 'border-red-500' : 'border-border focus:border-accent'
                      }`}
                      placeholder="First name"
                    />
                  </div>
                  {errors.firstName && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.firstName}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('lastName')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={20} />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 ${
                        errors.lastName ? 'border-red-500' : 'border-border focus:border-accent'
                      }`}
                      placeholder="Last name"
                    />
                  </div>
                  {errors.lastName && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.lastName}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
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
                transition={{ delay: 0.6 }}
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
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-secondary rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            getPasswordStrength() < 2 ? 'bg-red-500 w-1/3' :
                            getPasswordStrength() < 4 ? 'bg-yellow-500 w-2/3' :
                            'bg-green-500 w-full'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${getPasswordStrengthText().color}`}>
                        {getPasswordStrengthText().text}
                      </span>
                    </div>
                  </div>
                )}
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

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-3 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-border focus:border-accent'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </motion.div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <motion.div
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2 mt-1"
                  />
                  <div className="flex-1">
                    <label className="text-sm text-foreground/70">
                      I agree to the{' '}
                      <Link href="/terms" className="text-accent hover:text-accent/80 transition-colors">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-accent hover:text-accent/80 transition-colors">
                        Privacy Policy
                      </Link>
                    </label>
                    {errors.agreeToTerms && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.agreeToTerms}
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <input
                    type="checkbox"
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                  />
                  <label className="text-sm text-foreground/70">
                    Subscribe to our newsletter for updates and exclusive offers
                  </label>
                </motion.div>
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
                transition={{ delay: 1.0 }}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-background border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <>
                    <span>{t('createAccountBtn')}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign In Link */}
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <p className="text-foreground/70">
                {t('alreadyHaveAccount')}{' '}
                <Link
                  href="/login"
                  className="text-accent hover:text-accent/80 font-medium transition-colors"
                >
                  {t('signIn')}
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
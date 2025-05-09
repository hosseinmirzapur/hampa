import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Calendar, Heart, ChevronDown, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: 'پیدا کردن همراه',
      description: 'دونده‌های هم‌مسیر خود را پیدا کنید'
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: 'مسیرهای دویدن',
      description: 'بهترین مسیرها برای دویدن را کشف کنید'
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: 'برنامه‌ریزی آسان',
      description: 'به راحتی برنامه دویدن خود را تنظیم کنید'
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: 'ایجاد انگیزه',
      description: 'با دویدن گروهی انگیزه خود را حفظ کنید'
    }
  ];

  const faqs = [
    {
      question: 'چطور می‌توانم همراه دویدن پیدا کنم؟',
      answer: 'به سادگی یک کارت جدید ایجاد کنید یا در بخش اکسپلور، کارت‌های دیگران را ببینید و به آنها علاقه‌مندی نشان دهید.'
    },
    {
      question: 'آیا استفاده از همپا رایگان است؟',
      answer: 'بله! بخش اعظم امکانات همپا رایگان است. برای دسترسی به امکانات بیشتر می‌توانید اشتراک ویژه تهیه کنید.'
    },
    {
      question: 'چطور می‌توانم با دونده‌های دیگر ارتباط برقرار کنم؟',
      answer: 'پس از نشان دادن علاقه‌مندی به یک کارت، می‌توانید با دونده مورد نظر ارتباط برقرار کنید.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen flex items-center justify-center bg-gradient-to-l from-primary/10 to-primary/5 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={fadeInUp}
          >
            همپا
            <span className="block text-xl md:text-2xl text-gray-600 mt-2">
              دوست همراه دویدن
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            با همپا، هیچوقت تنها نمی‌دوید! همین حالا دونده‌های هم‌مسیر خود را پیدا کنید.
          </motion.p>
          
          <motion.div variants={fadeInUp}>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary text-lg px-8 py-3"
            >
              شروع کنید
              <ArrowRight className="mr-2" />
            </button>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
            variants={fadeInUp}
          >
            <ChevronDown className="w-8 h-8 text-primary" />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={fadeInUp}
          >
            امکانات کلیدی
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center"
                variants={fadeInUp}
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How it Works Section */}
      <motion.section 
        className="py-20 bg-gradient-to-l from-primary/10 to-primary/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={fadeInUp}
          >
            چطور کار می‌کند؟
          </motion.h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            {[
              { number: '۱', text: 'ثبت‌نام کنید و پروفایل خود را بسازید' },
              { number: '۲', text: 'برنامه دویدن خود را به اشتراک بگذارید' },
              { number: '۳', text: 'دونده‌های هم‌مسیر خود را پیدا کنید' },
              { number: '۴', text: 'با هم بدوید و لذت ببرید!' }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center bg-white rounded-xl p-6 shadow-sm"
                variants={fadeInUp}
              >
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold ml-4">
                  {step.number}
                </div>
                <p className="text-lg">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQs Section */}
      <motion.section 
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={fadeInUp}
          >
            سوالات متداول
          </motion.h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6"
                variants={fadeInUp}
              >
                <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-primary text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            variants={fadeInUp}
          >
            همین حالا به جمع دونده‌های همپا بپیوندید
          </motion.h2>
          
          <motion.p 
            className="text-lg mb-8 opacity-90"
            variants={fadeInUp}
          >
            تجربه دویدن گروهی را با همپا شروع کنید
          </motion.p>
          
          <motion.div variants={fadeInUp}>
            <button
              onClick={() => navigate('/login')}
              className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
            >
              ورود / ثبت‌نام
              <ArrowRight className="mr-2" />
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, MapPin, Calendar, Heart, ArrowRight } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate(); // Uses the real useNavigate from react-router-dom

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const staggerContainer = {
    hidden: {}, // Valid hidden state for framer-motion variants
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const titleAnimation = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.3 },
    },
  };

  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "پیدا کردن همراه",
      description: "دونده‌های هم‌مسیر خود را پیدا کنید",
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "مسیرهای دویدن",
      description: "بهترین مسیرها برای دویدن را کشف کنید",
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "برنامه‌ریزی آسان",
      description: "به راحتی برنامه دویدن خود را تنظیم کنید",
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "ایجاد انگیزه",
      description: "با دویدن گروهی انگیزه خود را حفظ کنید",
    },
  ];

  const faqs = [
    {
      question: "چطور می‌توانم همراه دویدن پیدا کنم؟",
      answer:
        "به سادگی یک کارت جدید ایجاد کنید یا در بخش اکسپلور، کارت‌های دیگران را ببینید و به آنها علاقه‌مندی نشان دهید.",
    },
    {
      question: "آیا استفاده از همپا رایگان است؟",
      answer:
        "بله! بخش اعظم امکانات همپا رایگان است. برای دسترسی به امکانات بیشتر می‌توانید اشتراک ویژه تهیه کنید.",
    },
    {
      question: "چطور می‌توانم با دونده‌های دیگر ارتباط برقرار کنم؟",
      answer:
        "پس از نشان دادن علاقه‌مندی به یک کارت، می‌توانید با دونده مورد نظر ارتباط برقرار کنید.",
    },
  ];

  const BlurredBackgroundElements = () => (
    <>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-light rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary-light rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-l from-primary/10 to-primary/5 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Blurred Background Elements specific to Hero */}
        {/* These classes (bg-primary-light, animate-blob, etc.) expect definitions elsewhere (global CSS / Tailwind config) */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-light rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary-light rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="flex flex-col gap-10 container mx-auto px-4 text-center relative z-10">
          <motion.img
            src="/logo.svg" // Preserved image path
            alt="HamPa Logo"
            className="h-40 w-auto mx-auto mb-8 mt-16 rounded-lg"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 text-gray-900"
            variants={titleAnimation}
          >
            همپا
            <motion.span
              className="block text-xl md:text-2xl text-gray-700 mt-4"
              variants={titleAnimation}
            >
              دوست همراه دویدن
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            با همپا، هیچوقت تنها نمی‌دوید! همین حالا دونده‌های هم‌مسیر خود را
            پیدا کنید.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary text-lg px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
            >
              شروع کنید
              <ArrowRight className="mr-2 h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features-section"
        className="py-20 bg-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <BlurredBackgroundElements />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
            variants={fadeInUp}
          >
            امکانات کلیدی
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={fadeInUp}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <motion.div
                  className="mb-4 flex justify-center items-center bg-primary/10 text-primary w-16 h-16 rounded-full mx-auto"
                  variants={scaleIn}
                >
                  {React.isValidElement(feature.icon)
                    ? React.cloneElement(feature.icon)
                    : feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How it Works Section */}
      <motion.section
        className="py-20 bg-gradient-to-l from-primary/10 to-primary/5 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <BlurredBackgroundElements />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
            variants={fadeInUp}
          >
            چطور کار می‌کند؟
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {[
              { number: "۱", text: "ثبت‌نام کنید و پروفایل خود را بسازید" },
              { number: "۲", text: "برنامه دویدن خود را به اشتراک بگذارید" },
              { number: "۳", text: "دونده‌های هم‌مسیر خود را پیدا کنید" },
              { number: "۴", text: "با هم بدوید و لذت ببرید!" },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={fadeInUp}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
                }}
              >
                <motion.div
                  className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold ml-6 shrink-0"
                  variants={scaleIn}
                >
                  {step.number}
                </motion.div>
                <p className="text-lg text-gray-700">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQs Section */}
      <motion.section
        className="py-20 bg-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <BlurredBackgroundElements />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
            variants={fadeInUp}
          >
            سوالات متداول
          </motion.h2>
          <motion.div
            className="max-w-3xl mx-auto space-y-6"
            variants={staggerContainer}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={fadeInUp}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-primary text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {/* Using distinct blurred elements for CTA */}
        {/* These classes also expect definitions elsewhere */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-3000"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            همین حالا به جمع دونده‌های همپا بپیوندید
          </motion.h2>
          <motion.p
            className="text-lg mb-8 opacity-90 max-w-xl mx-auto"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            تجربه دویدن گروهی را با همپا شروع کنید
          </motion.p>
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <button
              onClick={() => navigate("/login")}
              className="btn bg-white text-primary hover:bg-gray-100 font-semibold text-lg px-10 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
            >
              ورود / ثبت‌نام
              <ArrowRight className="mr-2 h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer - Basic example */}
      <footer className="py-10 bg-gray-800 text-gray-300 text-center">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} همپا. تمام حقوق محفوظ است.</p>
          <p className="text-sm mt-2">
            ساخته شده با <Heart className="inline h-4 w-4 text-red-500" /> برای
            دونده‌ها
          </p>
        </div>
      </footer>
      {/* Global styles, animations (like @keyframes blob), and custom color definitions 
        (for text-primary, bg-primary, bg-primary-light, animate-blob, animation-delay-xxxx etc.) 
        are removed from here. 
        In a real project, these would be in a separate CSS file (e.g., index.css, App.css) 
        imported into your application, or defined within your tailwind.config.js file.
        Without these definitions, some visual styles (like the blob animation and custom primary/secondary colors) 
        might not appear as intended in a standalone preview if not part of the default Tailwind setup.
      */}
    </div>
  );
};

export default Home;

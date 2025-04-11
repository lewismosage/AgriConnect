import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Lock, Database, Share2, User, Mail, Shield, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Privacy Policy | AgriConnect</title>
        <meta name="description" content="AgriConnect Privacy Policy" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Lock className="h-12 w-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-lg text-emerald-600">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Shield className="mr-2 h-6 w-6 text-emerald-500" />
              Your Privacy Matters
            </h2>
            <p className="text-gray-600 mb-4">
              At AgriConnect, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Platform.
            </p>
          </div>

          <div className="space-y-8">
            <Section 
              title="1. Information We Collect" 
              icon={<Database className="h-5 w-5 text-emerald-500" />}
              content={
                <>
                  <h4 className="font-medium text-gray-800 mb-2">Personal Information:</h4>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Name, email, phone number for account creation</li>
                    <li>Payment information for transactions (processed securely)</li>
                    <li>Farm details for farmer profiles</li>
                  </ul>
                  
                  <h4 className="font-medium text-gray-800 mb-2">Usage Data:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Browser type and device information</li>
                    <li>Pages visited and features used</li>
                    <li>IP address for security and analytics</li>
                  </ul>
                </>
              }
            />

            <Section 
              title="2. How We Use Your Information" 
              icon={<Share2 className="h-5 w-5 text-emerald-500" />}
              content={
                <ul className="list-disc pl-5 space-y-2">
                  <li>To provide and maintain our service</li>
                  <li>To process transactions between farmers and consumers</li>
                  <li>To communicate with you about your account</li>
                  <li>To improve our Platform and develop new features</li>
                  <li>To prevent fraud and enhance security</li>
                </ul>
              }
            />

            <Section 
              title="3. Data Sharing" 
              icon={<User className="h-5 w-5 text-emerald-500" />}
              content={
                <>
                  <p className="mb-3">We do not sell your personal information. We may share data with:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Payment processors to complete transactions</li>
                    <li>Farmers and consumers to facilitate orders</li>
                    <li>Service providers who assist our operations</li>
                    <li>When required by law or to protect our rights</li>
                  </ul>
                </>
              }
            />

            <Section 
              title="4. Data Security" 
              icon={<Lock className="h-5 w-5 text-emerald-500" />}
              content={
                <>
                  <p className="mb-3">We implement industry-standard security measures including:</p>
                  <ul className="list-disc pl-5 mb-3 space-y-1">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Secure storage with access controls</li>
                    <li>Regular security audits</li>
                  </ul>
                  <p>Despite our measures, no internet transmission is 100% secure.</p>
                </>
              }
            />

            <Section 
              title="5. Your Rights" 
              icon={<Mail className="h-5 w-5 text-emerald-500" />}
              content={
                <>
                  <p className="mb-3">You have the right to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Access and request a copy of your data</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </>
              }
            />

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-600">
                For privacy-related inquiries, please contact our Data Protection Officer at{' '}
                <a href="mailto:privacy@agriconnect.com" className="text-emerald-600 hover:underline">
                  privacy@agriconnect.com
                </a>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon, content }: { title: string; icon: React.ReactNode; content: React.ReactNode }) => (
  <div className="border-l-4 border-emerald-200 pl-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
      <span className="mr-2">{icon}</span>
      {title}
    </h3>
    <div className="text-gray-600">
      {content}
    </div>
  </div>
);

export default PrivacyPolicy;